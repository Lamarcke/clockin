from pasta.base.annotate import statement
from sqlmodel import select

from clockin_face_processing.config import get_db_session
from clockin_face_processing.dao.models import User


class UserService:

    async def get_all(self):
        with get_db_session() as session:
            statement = select(User)
            return session.exec(statement).all()

    async def get_one(self, id: int):
        with get_db_session() as session:
            statement_1 = select(User).where(User.id == id)
            return session.exec(statement_1).one()
