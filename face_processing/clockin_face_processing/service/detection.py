import base64
import io
import json
import os.path
import tempfile
from http import HTTPStatus
from typing import Any, Dict

from fastapi import UploadFile, HTTPException, File
from pathlib import Path

import cv2

from sqlmodel import select
from starlette.responses import FileResponse

from ..config import db_engine, get_db_session
from deepface import DeepFace

from ..config import get_project_root
from ..dao.models import FaceRepresentation
from ..dto.detection_dto import CreateDetectionDto, FindDetectionMatchDto


def clean_temp_file(file_path: str):
    return os.unlink(file_path)


class DetectionService:

    # Make sure all DeepFace methods receive this model name.
    __MODEL_NAME = "Facenet512"
    __DETECTOR_BACKEND = "retinaface"
    __FAST_DETECTOR_BACKEND = "opencv"
    __MIN_IMAGE_SIZES = {"h": 400, "w": 400}

    def __validate_image_size(self, file_path: str):
        img = cv2.imread(file_path)
        img_h, img_w, img_c = img.shape

        print("")

        if (
            self.__MIN_IMAGE_SIZES.get("h") > img_h
            or self.__MIN_IMAGE_SIZES.get("w") > img_w
        ):
            raise HTTPException(
                400,
                "Image resolution is too small. Please upload a image with at least 400x400 pixels.",
            )

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

    async def detect_faces(self, picture: UploadFile):
        """

        :param picture:
        :return:
        """
        with tempfile.NamedTemporaryFile() as f:
            f.write(picture.file.read())

            self.__validate_image_size(f.name)

            # Assuming this function will be called multiple times, the detection pipeline should run as fast as possible.
            # that's why we are using 'opencv' as detector_backend here.
            # Keep in mind that "retinaface" over-performs it, but is way slower.
            extracted_faces = DeepFace.extract_faces(
                f.name, detector_backend=self.__FAST_DETECTOR_BACKEND
            )
            first_extracted_face = extracted_faces[0]
            first_facial_area: Dict[str, Any] = first_extracted_face.get("facial_area")

            x = first_facial_area.get("x")
            y = first_facial_area.get("y")
            w = first_facial_area.get("w")
            h = first_facial_area.get("h")

            img = cv2.imread(f.name)

            img_with_box = cv2.rectangle(img, (x, y), (x + w, y + h), (0, 255, 0), 2)

            temp_save_bytes, temp_save_dest = tempfile.mkstemp(suffix=".jpg")

            cv2.imwrite(temp_save_dest, img_with_box)

            return FileResponse(temp_save_dest)

    async def create_face_representation(self, dto: CreateDetectionDto):
        uploaded_picture = dto.picture
        representation: dict[str, Any]
        with tempfile.NamedTemporaryFile() as f:
            f.write(uploaded_picture.file.read())

            self.__validate_image_size(f.name)

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

            self.__validate_image_size(tf.name)

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

    async def analyze_faces(self, picture: UploadFile):
        with tempfile.NamedTemporaryFile() as f:
            f.write(picture.file.read())

            analysis = DeepFace.analyze(
                f.name, detector_backend=self.__FAST_DETECTOR_BACKEND
            )

            return analysis
