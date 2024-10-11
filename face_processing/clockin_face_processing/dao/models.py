# Models need to be in a single file to avoid circular-imports in relationships
from typing import List, Optional

from pydantic import ConfigDict
from sqlmodel import SQLModel, Field
from sqlalchemy.types import JSON


class User(SQLModel, table=True):
    __tablename__ = "user"
    id: Optional[str] = Field(default=None, primary_key=True)
    name: str = Field(...)


class FaceRepresentation(SQLModel, table=True):
    __tablename__ = "face_representation"
    user_id: int = Field(nullable=False, primary_key=True, foreign_key="user.id")
    embedding: List[float] = Field(nullable=False, sa_type=JSON, exclude=True)
    model_name: str = Field(default=None, nullable=False, exclude=True)

    model_config = ConfigDict(protected_namespaces=())
