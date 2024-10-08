from functools import lru_cache

from pydantic.v1 import BaseSettings, Field
from sqlalchemy import create_engine
from sqlmodel import SQLModel, Session
from ..dao import models


class DatabaseSettings(BaseSettings):
    url: str = Field(
        "mysql+pymysql://face_processing:face_processing@localhost:3306/face_processing",
        env="DB_URL",
    )

    class Config:
        env_file = ".env"


@lru_cache
def get_db_settings():
    return DatabaseSettings()


settings = get_db_settings()

db_engine = create_engine(settings.url, echo=True)


def create_engine_metadata():
    SQLModel.metadata.create_all(db_engine)


def get_db_session():
    return Session(db_engine)
