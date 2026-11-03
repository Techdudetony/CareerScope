from pathlib import Path

from app.database import Base, SessionLocal, engine
from app.etl import load_bls_data, parse_bls_file

BASE_DIR = Path(__file__).resolve().parents[1]

SOURCE_FILE = BASE_DIR / "data" / "raw" / "national_M2025_dl.xlsx"


def main():
    if not SOURCE_FILE.exists():
        raise FileNotFoundError(f"BLS workbook not found: {SOURCE_FILE}")

    print("Reading BLS workbook...")

    df = parse_bls_file(SOURCE_FILE)

    print(f"Validated {len(df)} occupations")

    Base.metadata.create_all(bind=engine)

    with SessionLocal() as session:
        count = load_bls_data(session, df)

    print(f"Successfully imported {count} records")


if __name__ == "__main__":
    main()
