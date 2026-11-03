from sqlalchemy import (
    ForeignKey,
    Integer,
    Numeric,
    String,
    UniqueConstraint,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from .database import Base


class Occupation(Base):
    __tablename__ = "occupations"

    id: Mapped[int] = mapped_column(primary_key=True)

    code: Mapped[str] = mapped_column(String(10), unique=True, index=True)

    title: Mapped[str] = mapped_column(String(255), index=True)

    group: Mapped[str] = mapped_column(String(20))

    wages: Mapped[list["WageEstimate"]] = relationship(back_populates="occupation")


class WageEstimate(Base):
    __tablename__ = "wage_estimates"

    id: Mapped[int] = mapped_column(primary_key=True)

    occupation_id: Mapped[int] = mapped_column(
        ForeignKey("occupations.id"),
        index=True,
    )

    year: Mapped[int] = mapped_column(Integer)

    area_code: Mapped[str] = mapped_column(String(20))
    area_name: Mapped[str] = mapped_column(String(255))

    employment: Mapped[int | None] = mapped_column(Integer, nullable=True)

    annual_mean: Mapped[float | None] = mapped_column(Numeric(12, 2), nullable=True)

    annual_median: Mapped[float | None] = mapped_column(Numeric(12, 2), nullable=True)

    annual_p10: Mapped[float | None] = mapped_column(Numeric(12, 2), nullable=True)

    annual_p90: Mapped[float | None] = mapped_column(Numeric(12, 2), nullable=True)

    source: Mapped[str] = mapped_column(String(100), default="BLS OEWS")

    occupation: Mapped[Occupation] = relationship(back_populates="wages")

    __table_args__ = (
        UniqueConstraint(
            "occupation_id",
            "year",
            "area_code",
            name="uq_occupation_year_area",
        ),
    )
