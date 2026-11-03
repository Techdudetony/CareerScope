from sqlalchemy import func, select

from app.database import SessionLocal
from app.models import Occupation, WageEstimate

with SessionLocal() as session:
    occupation_count = session.scalar(select(func.count()).select_from(Occupation))

    wage_count = session.scalar(select(func.count()).select_from(WageEstimate))

    software = session.scalar(select(Occupation).where(Occupation.code == "15-1252"))

    assert occupation_count == 830
    assert wage_count == 830
    assert software is not None

    wage = session.scalar(
        select(WageEstimate).where(WageEstimate.occupation_id == software.id)
    )

    assert wage is not None

    print(f"Occupations: {occupation_count}")
    print(f"Wage records: {wage_count}")
    print(f"Occupation: {software.title}")
    print(f"Median salary: ${wage.annual_median:,.2f}")

    print("\nDatabase validation passed.")
