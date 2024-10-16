from typing import List

from fastapi import APIRouter
from fastapi.params import Depends

from clockin_face_processing.dao.models import User
from clockin_face_processing.dto.user_dto import CreateUserDto
from clockin_face_processing.service.user import UserService

router = APIRouter(prefix="/user", tags=["user"])


@router.get("", response_model=List[User])
async def get_all_users(user_service: UserService = Depends()):
    return await user_service.get_all()


@router.get("/{id}", response_model=User)
async def get_one(id: int, user_service: UserService = Depends()):
    return await user_service.get_one(id)


@router.get("/verification/{user_id}")
async def get_verification_list(user_id: int, user_service: UserService = Depends()):
    return user_service.get_verification_list(user_id)


@router.post("", status_code=201)
async def create(dto: CreateUserDto, user_service: UserService = Depends()):
    return await user_service.create(dto)


@router.delete("/{id}", status_code=204)
async def delete(id: int, user_service: UserService = Depends()):
    return await user_service.delete(id)
