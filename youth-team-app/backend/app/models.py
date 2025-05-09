# app/models/members.py

from pydantic import BaseModel
from sqlalchemy import Column, Integer, String, Date
from app.database import Base
from datetime import date
from typing import Optional

# SQLAlchemy model (DB table)
class MemberDB(Base):
    __tablename__ = "members"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    birthday = Column(Date, nullable=False)

# Pydantic model (API schema)
class Member(BaseModel):
    id: int
    name: str
    birthday: date

    class Config:
        orm_mode = True


class MemberUpdate(BaseModel):
    name: Optional[str] = None
    birthday: Optional[date] = None
