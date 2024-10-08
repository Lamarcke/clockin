from typing import Annotated

from fastapi import UploadFile, File
from pydantic import BaseModel, Field


class CreateDetectionDto(BaseModel):
    employeeId: int = Field(...)
    companyId: int = Field(...)
    picture: Annotated[UploadFile, File()] = File(
        ..., description="Employee's picture with a face visible"
    )


class FindDetectionMatchDto(BaseModel):
    companyId: int = Field(...)
    picture: Annotated[UploadFile, File()] = File(
        ..., description="Employee's picture with a face visible"
    )
