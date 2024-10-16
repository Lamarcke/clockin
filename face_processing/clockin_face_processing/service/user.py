from pasta.base.annotate import statement
from sqlmodel import select

from clockin_face_processing.config import get_db_session
from clockin_face_processing.dao.models import User, UserVerification
from clockin_face_processing.dto.user_dto import CreateUserDto


class UserService:

    async def get_all(self):
        with get_db_session() as session:
            statement = select(User)
            return session.exec(statement).all()

    async def get_one(self, id: int):
        with get_db_session() as session:
            statement_1 = select(User).where(User.id == id)
            return session.exec(statement_1).one()

    async def create(self, dto: CreateUserDto):
        with get_db_session() as session:
            user = User(**dto.model_dump())
            session.add(user)
            session.commit()

    async def delete(self, id: int):
        with get_db_session() as session:
            statement = select(User)
            user = session.exec(statement).one()
            session.delete(user)
            session.commit()

    def get_verification_list(self, user_id: int):
        with get_db_session() as session:
            statement = select(UserVerification).where(
                UserVerification.user_id == user_id
            )
            return session.exec(statement).all()

    def register_user_verification(self, id: int):
        with get_db_session() as session:
            statement = select(User).where(User.id == id)
            user = session.exec(statement).one()
            verification = UserVerification(user_id=user.id)
            session.add(verification)
            session.commit()
