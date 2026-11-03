from app.database import Base, get_db
from app.main import app
from app.models import Occupation, WageEstimate
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool


def test_api():
    engine = create_engine(
        "sqlite://",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )

    Base.metadata.create_all(engine)
    TestSession = sessionmaker(bind=engine)

    with TestSession() as db:
        occupation = Occupation(
            code="15-1252",
            title="Software Developers",
            group="detailed",
        )
        db.add(occupation)
        db.flush()

        db.add(
            WageEstimate(
                occupation_id=occupation.id,
                year=2025,
                area_code="99",
                area_name="U.S.",
                employment=100000,
                annual_mean=148100,
                annual_median=135980,
                annual_p10=70000,
                annual_p90=220000,
                source="BLS OEWS",
            )
        )
        db.commit()

    def override_get_db():
        with TestSession() as db:
            yield db

    app.dependency_overrides[get_db] = override_get_db

    try:
        with TestClient(app) as client:
            assert client.get("/health").status_code == 200

            response = client.get("/api/v1/occupations?search=software")
            assert response.status_code == 200
            assert len(response.json()) == 1

            response = client.get("/api/v1/occupations/15-1252")
            assert response.status_code == 200
            assert response.json()["code"] == "15-1252"

            response = client.get("/api/v1/occupations/top-paying")
            assert response.status_code == 200
            assert response.json()[0]["code"] == "15-1252"

            response = client.get("/api/v1/occupations/99-9999")
            assert response.status_code == 404
    finally:
        app.dependency_overrides.clear()
        engine.dispose()
