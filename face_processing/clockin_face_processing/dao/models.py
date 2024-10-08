# Models need to be in a single file to avoid circular-imports in relationships
from typing import List

from sqlmodel import SQLModel, Field
from sqlalchemy.types import JSON


class FaceRepresentation(SQLModel, table=True):
    __tablename__ = "face_representation"
    employeeId: int = Field(default=None, primary_key=True)
    companyId: int = Field(default=None, primary_key=True)
    embedding: List[float] = Field(nullable=False, sa_type=JSON)
    file_path: str = Field(..., nullable=False)
