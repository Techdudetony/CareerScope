from pathlib import Path

import pandas as pd
from sqlalchemy import select
from sqlalchemy.orm import Session

from .models import Occupation, WageEstimate

REQUIRED_COLUMNS = [
    "AREA",
    "OCC_CODE",
    "OCC_TITLE",
    "O_GROUP",
    "I_GROUP",
    "OWN_CODE",
    "NAICS",
    "TOT_EMP",
    "A_MEAN",
    "A_MEDIAN",
    "A_PCT10",
    "A_PCT90",
]

NUMERIC_COLUMNS = [
    "TOT_EMP",
    "A_MEAN",
    "A_MEDIAN",
    "A_PCT10",
    "A_PCT90",
]


def parse_bls_file(path: str | Path) -> pd.DataFrame:
    """Parse the May 2025 national OEWS workbook."""

    df = pd.read_excel(
        path,
        sheet_name="national_M2025_dl",
        dtype={
            "OCC_CODE": str,
            "AREA": str,
            "NAICS": str,
            "OWN_CODE": str,
        },
    )

    df.columns = df.columns.str.strip().str.upper()

    missing = set(REQUIRED_COLUMNS) - set(df.columns)
    if missing:
        raise ValueError(f"Missing required columns: {sorted(missing)}")

    # National, detailed occupations only.
    df = df[
        (df["AREA"] == "99")
        & (df["NAICS"] == "000000")
        & (df["I_GROUP"] == "cross-industry")
        & (df["OWN_CODE"] == "1235")
        & (df["O_GROUP"] == "detailed")
    ].copy()

    # Preserve occupational classification codes.
    df["OCC_CODE"] = df["OCC_CODE"].str.strip()
    df["OCC_TITLE"] = df["OCC_TITLE"].str.strip()

    # Invalid, suppressed, and missing values become NaN.
    for column in NUMERIC_COLUMNS:
        df[column] = pd.to_numeric(
            df[column].astype(str).str.replace(",", "", regex=False), errors="coerce"
        )
    if df["OCC_CODE"].duplicated().any():
        raise ValueError("Duplicate occupation codes found")

    df = df.rename(
        columns={
            "OCC_CODE": "code",
            "OCC_TITLE": "title",
            "O_GROUP": "group",
            "TOT_EMP": "employment",
            "A_MEAN": "annual_mean",
            "A_MEDIAN": "annual_median",
            "A_PCT10": "annual_p10",
            "A_PCT90": "annual_p90",
        }
    )

    return df[
        [
            "code",
            "title",
            "group",
            "employment",
            "annual_mean",
            "annual_median",
            "annual_p10",
            "annual_p90",
        ]
    ].reset_index(drop=True)


def load_bls_data(
    session: Session,
    df: pd.DataFrame,
    year: int = 2025,
) -> int:
    """Insert or update BLS occupation and wage data."""

    count = 0

    for row in df.to_dict(orient="records"):
        occupation = session.scalar(
            select(Occupation).where(Occupation.code == row["code"])
        )

        if occupation is None:
            occupation = Occupation(
                code=row["code"],
                title=row["title"],
                group=row["group"],
            )
            session.add(occupation)
            session.flush()
        else:
            occupation.title = row["title"]
            occupation.group = row["group"]

        wage = session.scalar(
            select(WageEstimate).where(
                WageEstimate.occupation_id == occupation.id,
                WageEstimate.year == year,
                WageEstimate.area_code == "99",
            )
        )

        if wage is None:
            wage = WageEstimate(
                occupation_id=occupation.id,
                year=year,
                area_code="99",
                area_name="U.S.",
            )
            session.add(wage)

        for field in [
            "employment",
            "annual_mean",
            "annual_median",
            "annual_p10",
            "annual_p90",
        ]:
            value = row[field]

            setattr(
                wage,
                field,
                None if pd.isna(value) else value,
            )

        count += 1

    return count
