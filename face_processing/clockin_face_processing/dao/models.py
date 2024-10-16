# Models need to be in a single file to avoid circular-imports in relationships
import datetime
from typing import List, Optional, Dict

from pydantic import ConfigDict
from sqlalchemy import Column, DateTime, func
from sqlmodel import SQLModel, Field
from sqlalchemy.types import JSON


class User(SQLModel, table=True):
    __tablename__ = "user"
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str = Field(...)
    identifier: Optional[str] = Field(default=None, index=True)
    created_at: datetime.datetime = Field(
        default_factory=datetime.datetime.utcnow,
    )
    updated_at: Optional[datetime.datetime] = Field(
        sa_column=Column(DateTime(), onupdate=func.now())
    )


class FaceRepresentation(SQLModel, table=True):
    __tablename__ = "face_representation"
    user_id: int = Field(nullable=False, primary_key=True, foreign_key="user.id")
    embedding: List[float] = Field(nullable=False, sa_type=JSON, exclude=True)
    model_name: str = Field(default=None, nullable=False, exclude=True)
    created_at: datetime.datetime = Field(
        default_factory=datetime.datetime.utcnow,
    )
    updated_at: Optional[datetime.datetime] = Field(
        sa_column=Column(DateTime(), onupdate=func.now())
    )

    model_config = ConfigDict(protected_namespaces=())


class UserVerification(SQLModel, table=True):
    __tablename__ = "user_verification"
    user_id: int = Field(nullable=False, primary_key=True, foreign_key="user.id")
    created_at: datetime.datetime = Field(
        default_factory=datetime.datetime.utcnow,
    )
    updated_at: Optional[datetime.datetime] = Field(
        sa_column=Column(DateTime(), onupdate=func.now())
    )
