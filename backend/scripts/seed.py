from sqlmodel import Session, select

from app.core.security import hash_password
from app.db.session import engine
from app.modules.auth.models import Admin, AdminRole


def create_admin(
    session: Session,
    *,
    name: str,
    email: str,
    password: str,
    role: AdminRole,
):
    existing = session.exec(
        select(Admin).where(Admin.email == email)
    ).first()

    if existing:
        print(f"✓ {email} already exists")
        return

    admin = Admin(
        name=name,
        email=email,
        password_hash=hash_password(password),
        role=role,
    )

    session.add(admin)
    session.commit()

    print(f"✓ Created {email}")


def seed():
    with Session(engine) as session:

        create_admin(
            session,
            name="Demo Owner",
            email="admin@estaris.com",
            password="admin123",
            role=AdminRole.OWNER,
        )

        create_admin(
            session,
            name="Demo Manager",
            email="manager@estaris.com",
            password="manager123",
            role=AdminRole.MANAGER,
        )

        create_admin(
            session,
            name="Demo Staff",
            email="staff@estaris.com",
            password="staff123",
            role=AdminRole.STAFF,
        )


if __name__ == "__main__":
    seed()