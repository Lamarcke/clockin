import base64
from typing import Annotated

from fastapi import APIRouter, Depends, UploadFile, File, Form

from ..dto.detection_dto import CreateDetectionDto, FindDetectionMatchDto
from ..service.detection import DetectionService

router = APIRouter(prefix="/detection", tags=["detection"])


@router.post("")
async def create_representation(
    detection_dto: Annotated[CreateDetectionDto, Form()],
    detection_service: DetectionService = Depends(),
):
    """
    Searches for faces in a employee picture, and store the result for later processing.
    :return:
    """
    return await detection_service.detect_faces(detection_dto)


@router.post("/match")
async def find_match(
    match_dto: Annotated[FindDetectionMatchDto, Form()],
    detection_service: DetectionService = Depends(),
):
    return await detection_service.find_match(match_dto)
