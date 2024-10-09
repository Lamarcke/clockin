# Models need to be in a single file to avoid circular-imports in relationships
from typing import List

from pydantic import ConfigDict
from sqlmodel import SQLModel, Field
from sqlalchemy.types import JSON


class FaceRepresentation(SQLModel, table=True):
    __tablename__ = "face_representation"
    employee_id: int = Field(default=None, primary_key=True)
    company_id: int = Field(default=None, primary_key=True)
    embedding: List[float] = Field(nullable=False, sa_type=JSON)
    model_name: str = Field(default=None, nullable=False)

    model_config = ConfigDict(protected_namespaces=())
