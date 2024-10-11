from typing import Annotated, List

from fastapi import APIRouter
from fastapi.params import Depends

from clockin_face_processing.dao.models import User
from clockin_face_processing.service.user import UserService

router = APIRouter(prefix="/user", tags=["user"])

@router.get("", response_model=List[User])
async def get_all_users(user_service: UserService = Depends()):
    return await user_service.get_all()

@router.get("{id}", response_model=User)
async def get_one(id: int, user_service: UserService = Depends()):
    return await user_service.get_one(id)
