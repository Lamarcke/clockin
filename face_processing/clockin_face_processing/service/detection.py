import base64
import json
import os.path
import tempfile
from http import HTTPStatus
from typing import Any

from fastapi import UploadFile, HTTPException, File
from pathlib import Path

from sqlmodel import select

from ..config import db_engine, get_db_session
from deepface import DeepFace

from ..config import get_project_root
from ..dao.models import FaceRepresentation
from ..dto.detection_dto import CreateDetectionDto, FindDetectionMatchDto


class DetectionService:

    # Make sure all DeepFace methods receive this model name.
    __MODEL_NAME = "Facenet512"
    __DETECTOR_BACKEND = "retinaface"

    def __get_facial_representation(self, file_path: str):
        """
        :param file_path: str representing an absolute path. can also be a base64.
        :return:
        """
        return DeepFace.represent(
            file_path,
            model_name=self.__MODEL_NAME,
            detector_backend=self.__DETECTOR_BACKEND,
            max_faces=1,
            enforce_detection=True,
        )[0]

    async def detect_faces(self, dto: CreateDetectionDto):
        uploaded_picture = dto.picture
        representation: dict[str, Any]
        with tempfile.NamedTemporaryFile() as f:
            f.write(uploaded_picture.file.read())
            representation = self.__get_facial_representation(f.name)

        with get_db_session() as session:
            face_representation = FaceRepresentation(
                **dto.model_dump(),
                embedding=representation.get("embedding"),
                model_name=self.__MODEL_NAME
            )
            session.add(face_representation)
            session.commit()

    async def find_match(self, match_dto: FindDetectionMatchDto):
        uploaded_file = match_dto.picture
        uploaded_face_representation = dict[str, Any]
        with tempfile.NamedTemporaryFile() as tf:
            tf.write(uploaded_file.file.read())
            uploaded_face_representation = self.__get_facial_representation(tf.name)

        file_embedding = uploaded_face_representation.get("embedding")

        with get_db_session() as session:
            statement = select(FaceRepresentation).where(
                FaceRepresentation.company_id == match_dto.company_id
            )
            results = session.execute(statement)

            # TODO: check if Celery tasks are applicable here.
            for result in results:
                face_representation: FaceRepresentation = result[0]

                verify = DeepFace.verify(
                    file_embedding,
                    face_representation.embedding,
                    model_name=self.__MODEL_NAME,
                    detector_backend=self.__DETECTOR_BACKEND,
                )

                if verify.get("verified"):
                    return face_representation

        raise HTTPException(
            HTTPStatus.BAD_REQUEST.value, "No matches found for the uploaded file."
        )
