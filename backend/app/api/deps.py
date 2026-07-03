from typing import Annotated
from uuid import UUID

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer

from sqlmodel import Session

from app.core.security import decode_token
from app.db.session import get_session
from app.modules.auth.repositories import AdminRepository

oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl="/api/v1/auth/login"
)

SessionDep = Annotated[Session, Depends(get_session)]


def get_current_admin(
    token: Annotated[str, Depends(oauth2_scheme)],
    session: SessionDep,
):
    payload = decode_token(token)

    if payload["type"] != "access":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid access token",
        )

    admin = AdminRepository.get_by_id(
        session,
        UUID(payload["sub"]),
    )

    if admin is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Admin not found",
        )

    return admin

from app.modules.auth.models import Admin

CurrentAdmin = Annotated[
    Admin,
    Depends(get_current_admin),
]