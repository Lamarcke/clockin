from pydantic import BaseModel


class CreateUserDto(BaseModel):
    name: str
    identifier: str
