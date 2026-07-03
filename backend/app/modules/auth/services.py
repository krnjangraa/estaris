from sqlmodel import Session
from uuid import UUID

from app.core.security import (
    create_access_token,
    create_refresh_token,
    decode_token,
    verify_password,
)

from app.modules.auth.repositories import AdminRepository
from app.modules.auth.schemas import (
    AdminRead,
    TokenResponse,
)


class AuthService:

    @staticmethod
    def login(
        session: Session,
        email: str,
        password: str,
    ) -> TokenResponse | None:

        admin = AdminRepository.get_by_email(session, email)

        if admin is None:
            return None

        if not verify_password(password, admin.password_hash):
            return None

        return TokenResponse(
            access_token=create_access_token(admin.id),
            refresh_token=create_refresh_token(admin.id),
            admin=AdminRead.model_validate(admin),
        )

    @staticmethod
    def refresh(
        session: Session,
        refresh_token: str,
    ) -> TokenResponse | None:

        try:
            payload = decode_token(refresh_token)
        except Exception:
            return None

        if payload.get("type") != "refresh":
            return None


        admin = AdminRepository.get_by_id(
            session=session,
            admin_id=UUID(payload["sub"]),
        )

        if admin is None:
            return None

        return TokenResponse(
            access_token=create_access_token(admin.id),
            refresh_token=create_refresh_token(admin.id),
            admin=AdminRead.model_validate(admin),
        )