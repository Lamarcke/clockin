from typing import Annotated

from fastapi import UploadFile, File
from pydantic import BaseModel, Field


class CreateDetectionDto(BaseModel):
    employee_id: int = Field(...)
    company_id: int = Field(...)
    picture: Annotated[UploadFile, File()] = File(
        ..., description="Employee's picture with a face visible"
    )


class FindDetectionMatchDto(BaseModel):
    company_id: int = Field(...)
    picture: Annotated[UploadFile, File()] = File(
        ..., description="Employee's picture with a face visible"
    )
