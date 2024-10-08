from fastapi import FastAPI

from clockin_face_processing.config.db import create_engine_metadata
from clockin_face_processing.controller import detection

app = FastAPI()

app.include_router(detection.router)


@app.on_event("startup")
def on_startup():
    create_engine_metadata()


@app.get("/")
async def root():

    return {"message": "Hello World"}
