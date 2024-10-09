from fastapi import FastAPI
from starlette.requests import Request
from starlette.responses import JSONResponse

from clockin_face_processing.config.db import create_engine_metadata
from clockin_face_processing.controller import detection
from sqlalchemy.exc import IntegrityError


app = FastAPI()

app.include_router(detection.router)


@app.on_event("startup")
def on_startup():
    create_engine_metadata()


@app.exception_handler(IntegrityError)
def integrity_error_handler(request: Request, exc: IntegrityError):
    return JSONResponse(
        status_code=400, content={"message": f"Duplicated value for id!"}
    )


@app.get("/")
async def root():

    return {"message": "Hello World"}
