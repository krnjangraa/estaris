from fastapi import APIRouter, Depends, HTTPException, status

from app.api.deps import SessionDep, get_current_admin
from app.modules.auth.schemas import (
    AdminRead,
    LoginRequest,
    RefreshTokenRequest,
    SignupRequest,
    TokenResponse,
)
from app.modules.auth.services import AuthService

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"],
)


@router.post(
    "/signup",
    response_model=TokenResponse,
    status_code=status.HTTP_201_CREATED,
)
def signup(
    payload: SignupRequest,
    session: SessionDep,
):
    result = AuthService.signup(
        session=session,
        name=payload.name,
        email=payload.email,
        password=payload.password,
    )

    if result is None:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="An account with this email already exists",
        )

    return result


@router.post(
    "/login",
    response_model=TokenResponse,
)
def login(
    payload: LoginRequest,
    session: SessionDep,
):
    token = AuthService.login(
        session=session,
        email=payload.email,
        password=payload.password,
    )

    if token is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )

    return token



@router.post(
    "/refresh",
    response_model=TokenResponse,
)
def refresh(
    payload: RefreshTokenRequest,
    session: SessionDep,
):
    token = AuthService.refresh(
        session=session,
        refresh_token=payload.refresh_token,
    )

    if token is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid refresh token",
        )

    return token

@router.get(
    "/me",
    response_model=AdminRead,
)
def me(
    admin=Depends(get_current_admin),
):
    return admin