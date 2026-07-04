from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict, EmailStr

from app.modules.auth.models import AdminRole


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class SignupRequest(BaseModel):
    name: str
    email: EmailStr
    password: str

class RefreshTokenRequest(BaseModel):
    refresh_token: str


class AdminRead(BaseModel):
    id: UUID
    name: str
    email: EmailStr
    role: AdminRole

    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(
        from_attributes=True,
    )


class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"

    admin: AdminRead