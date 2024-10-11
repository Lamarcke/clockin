import base64
import os
from typing import Annotated

from fastapi import APIRouter, Depends, UploadFile, File, Form, BackgroundTasks

from ..dto.detection_dto import CreateDetectionDto, FindDetectionMatchDto
from ..service.detection import DetectionService

router = APIRouter(prefix="/detection", tags=["detection"])


def __cleanup_temp_file(path: str):
    return os.unlink(path)


@router.post("", status_code=201)
async def create_representation(
    detection_dto: Annotated[CreateDetectionDto, Form()],
    detection_service: DetectionService = Depends(),
):
    """
    Searches for faces in a employee picture, and store the result for later processing.
    :return:
    """

    return await detection_service.create_face_representation(detection_dto)


@router.post("/match")
async def find_match(
    match_dto: Annotated[FindDetectionMatchDto, Form()],
    detection_service: DetectionService = Depends(),
):
    return await detection_service.find_match(match_dto)


@router.post("/detect")
async def detect_faces(
    picture: UploadFile,
    background_tasks: BackgroundTasks,
    detection_service: DetectionService = Depends(),
):
    temp_file_path, response = await detection_service.detect_faces(picture)

    background_tasks.add_task(__cleanup_temp_file, temp_file_path)

    return response


@router.post("/analyze")
async def analyze_faces(
    picture: UploadFile, detection_service: DetectionService = Depends()
):
    return await detection_service.analyze_faces(picture)
