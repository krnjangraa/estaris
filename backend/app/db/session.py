from sqlmodel import Session, SQLModel, create_engine

from app.core.config import settings

# ── Import all ORM models in dependency order so SQLAlchemy's class registry
# ── is fully populated before the first mapper configuration is triggered.
# ── Order matters: parents before children (no circular imports at module level).
from app.modules.auth.models import Admin                       # no deps
from app.modules.buildings.models import Building               # depends on Admin (FK only)
from app.modules.rooms.models import Room                       # depends on Building (FK only)
from app.modules.tenants.models import Tenant                   # depends on Room (FK only)
from app.modules.leases.models import Lease                     # depends on Tenant (FK only)
from app.modules.payments.models import Payment                 # depends on Lease (FK only)

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