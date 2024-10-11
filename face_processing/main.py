from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware
from starlette.requests import Request
from starlette.responses import JSONResponse
from starlette.staticfiles import StaticFiles

from clockin_face_processing.config.db import create_engine_metadata
from clockin_face_processing.controller import detection, user
from sqlalchemy.exc import IntegrityError


app = FastAPI()

app.include_router(detection.router)
app.include_router(user.router)

app.add_middleware(
    CORSMiddleware,
    allow_origins="*",
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def on_startup():
    create_engine_metadata()


@app.exception_handler(IntegrityError)
def integrity_error_handler(request: Request, exc: IntegrityError):
    return JSONResponse(
        status_code=400, content={"message": f"Duplicated value for id!"}
    )


app.mount("/public", StaticFiles(directory="public"), name="public")


@app.get("/")
async def root():

    return {"message": "Hello World"}
