from sqlmodel import Session
from uuid import UUID

from app.core.security import (
    create_access_token,
    create_refresh_token,
    decode_token,
    hash_password,
    verify_password,
)

from app.modules.auth.models import Admin, AdminRole
from app.modules.auth.repositories import AdminRepository
from app.modules.auth.schemas import (
    AdminRead,
    TokenResponse,
)


class AuthService:

    @staticmethod
    def signup(
        session: Session,
        name: str,
        email: str,
        password: str,
    ) -> TokenResponse | None:
        """Create a new admin (owner) account. Returns None if email taken."""
        existing = AdminRepository.get_by_email(session, email)
        if existing is not None:
            return None

        admin = Admin(
            name=name,
            email=email,
            password_hash=hash_password(password),
            role=AdminRole.OWNER,
        )
        session.add(admin)
        session.commit()
        session.refresh(admin)

        return TokenResponse(
            access_token=create_access_token(admin.id),
            refresh_token=create_refresh_token(admin.id),
            admin=AdminRead.model_validate(admin),
        )

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