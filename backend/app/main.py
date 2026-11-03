from typing import Annotated

from fastapi import Depends, FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload

from .database import get_db
from .models import Occupation, WageEstimate
from .schemas import OccupationDetail, OccupationSummary

DbSession = Annotated[Session, Depends(get_db)]

app = FastAPI(
    title="CareerScope API",
    description="Explore occupational wages using BLS OEWS data.",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=False,
    allow_methods=["GET"],
    allow_headers=["*"],
)


@app.get("/health")
def health():
    return {"status": "ok"}


@app.get(
    "/api/v1/occupations",
    response_model=list[OccupationSummary],
)
def list_occupations(
    db: DbSession,
    search: str = Query(default="", max_length=100),
    limit: int = Query(default=25, ge=1, le=100),
    offset: int = Query(default=0, ge=0),
):
    statement = select(Occupation)

    if search.strip():
        statement = statement.where(Occupation.title.ilike(f"%{search.strip()}%"))

    statement = (
        statement.order_by(Occupation.title, Occupation.code)
        .offset(offset)
        .limit(limit)
    )

    return db.scalars(statement).all()


@app.get(
    "/api/v1/occupations/top-paying",
    response_model=list[OccupationDetail],
)
def top_paying_occupations(
    db: DbSession,
    limit: int = Query(default=10, ge=1, le=100),
    year: int = Query(default=2025),
):
    statement = (
        select(Occupation)
        .join(WageEstimate)
        .options(selectinload(Occupation.wages))
        .where(
            WageEstimate.year == year,
            WageEstimate.area_code == "99",
            WageEstimate.annual_median.is_not(None),
        )
        .order_by(
            WageEstimate.annual_median.desc(),
            Occupation.code,
        )
        .limit(limit)
    )

    return db.scalars(statement).all()


@app.get(
    "/api/v1/occupations/{code}",
    response_model=OccupationDetail,
)
def get_occupation(
    code: str,
    db: DbSession,
):
    statement = (
        select(Occupation)
        .options(selectinload(Occupation.wages))
        .where(Occupation.code == code)
    )

    occupation = db.scalar(statement)

    if occupation is None:
        raise HTTPException(
            status_code=404,
            detail="Occupation not found",
        )

    return occupation
