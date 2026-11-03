from decimal import Decimal

from pydantic import BaseModel, ConfigDict


class WageResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    year: int
    area_code: str
    area_name: str
    employment: int | None
    annual_mean: Decimal | None
    annual_median: Decimal | None
    annual_p10: Decimal | None
    annual_p90: Decimal | None
    source: str


class OccupationSummary(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    code: str
    title: str
    group: str


class OccupationDetail(OccupationSummary):
    wages: list[WageResponse]
