from pathlib import Path

from app.etl import parse_bls_file

BASE_DIR = Path(__file__).resolve().parents[1]

source = BASE_DIR / "data/raw/national_M2025_dl.xlsx"

df = parse_bls_file(source)

print(f"Detailed occupations: {len(df)}")
print(f"Unique codes: {df['code'].nunique()}")

software = df[df["code"] == "15-1252"]

print("\nSoftware Developers:")
print(software.to_string(index=False))

assert len(df) == 830
assert len(software) == 1
assert software.iloc[0]["annual_median"] == 135980

print("\nBLS parsing validation passed.")
