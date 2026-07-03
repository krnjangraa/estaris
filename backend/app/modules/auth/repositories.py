from sqlmodel import Session, select

from app.modules.auth.models import Admin
from uuid import UUID

class AdminRepository:

    @staticmethod
    def get_by_email(
        session: Session,
        email: str,
    ) -> Admin | None:
        statement = select(Admin).where(Admin.email == email)
        return session.exec(statement).first()
    @staticmethod
    def get_by_id(
        session: Session,
        admin_id: UUID,
    ) -> Admin | None:
        statement = select(Admin).where(Admin.id == admin_id)
        return session.exec(statement).first()