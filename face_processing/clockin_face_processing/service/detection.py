import base64
import json
import os.path
import tempfile

from fastapi import UploadFile, HTTPException
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

    async def detect_faces(self, dto: CreateDetectionDto):
        file = dto.picture
        project_root = os.path.abspath(get_project_root())
        stored_upload_path: str
        with open(f"{project_root}/public/uploads/{file.filename}", "wb") as f:
            f.write(file.file.read())
            stored_upload_path = f.name

        representation = DeepFace.represent(
            stored_upload_path, model_name=self.__MODEL_NAME
        )[0]
        await self.analyze_face(stored_upload_path)

        with get_db_session() as session:
            representation = FaceRepresentation(
                **dto.model_dump(),
                file_path=stored_upload_path,
                embedding=representation.get("embedding"),
            )
            session.add(representation)
            session.commit()

    async def analyze_face(self, file_path: str):
        analysis = DeepFace.analyze(file_path)
        print(json.dumps(analysis))

    async def find_match(self, match_dto: FindDetectionMatchDto):
        uploaded_file = match_dto.picture
        with tempfile.NamedTemporaryFile() as tf:
            tf.write(uploaded_file.file.read())

            tf_representation = DeepFace.represent(
                tf.name, model_name=self.__MODEL_NAME
            )[0]

            with get_db_session() as session:
                statement = select(FaceRepresentation)
                results = session.execute(statement)

                for result in results.all():
                    face_representation: FaceRepresentation = result[0]
                    verify = DeepFace.verify(
                        tf_representation.get("embedding"),
                        face_representation.embedding,
                        model_name=self.__MODEL_NAME,
                    )
                    if verify.get("verified"):
                        return face_representation

        raise HTTPException(400, "No match found for given picture.")
