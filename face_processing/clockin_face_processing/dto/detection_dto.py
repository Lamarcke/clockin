from typing import Annotated

from fastapi import UploadFile, File
from pydantic import BaseModel, Field


class CreateDetectionDto(BaseModel):
    user_id: int
    picture: Annotated[UploadFile, File()] = File(
        ..., description="Employee's picture with a face visible"
    )


class FindDetectionMatchDto(BaseModel):
    picture: Annotated[UploadFile, File()] = File(
        ..., description="Employee's picture with a face visible"
    )

class FindDetectionMatchResponseDto(BaseModel):
    user_id: str
    file_path: str
