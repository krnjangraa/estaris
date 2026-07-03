from sqlmodel import Session, SQLModel, create_engine

from app.core.config import settings

# Import all models here

from app.modules.auth.models import Admin

engine = create_engine(
    settings.DATABASE_URL,
    echo=True,
    pool_pre_ping=True,
)


def create_db_and_tables():
    SQLModel.metadata.create_all(engine)


def get_session():
    with Session(engine) as session:
        yield session