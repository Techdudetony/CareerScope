from pathlib import Path
from token import NUMBER

import pandas as pd

REQUIRED_COLUMNS = [
    "AREA",
    "OCC_CODE",
    "OCC_TITLE",
    "O_GROUP",
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
        dtype={"OCC_CODE": str, "AREA": str},
    )

    df.columns = df.columns.str.strip().str.upper()

    missing = set(REQUIRED_COLUMNS) - set(df.columns)
    if missing:
        raise ValueError(f"Missing required columns: {sorted(missing)}")

    # National, detailed occuupations only.
    df = df[(df["AREA"] == "99") & (df["O_GROUP"] == "detailed")].copy()

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

    print("Columns after rename:", df.columns.tolist())

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
