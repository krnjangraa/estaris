import sys
import pathlib
from datetime import date, timedelta
import random

sys.path.append(str(pathlib.Path(__file__).resolve().parents[1]))

# Import ALL models in correct order before any session ops so SQLAlchemy mapper
# can resolve all string-based relationship references at config time.
from app.modules.auth import models as _auth_models          # Admin
from app.modules.buildings import models as _building_models  # Building (imports Admin bottom-up)
from app.modules.rooms import models as _room_models          # Room
from app.modules.tenants import models as _tenant_models      # Tenant
from app.modules.leases import models as _lease_models        # Lease
from app.modules.payments import models as _payment_models    # Payment

from sqlmodel import Session, select

from app.core.security import hash_password
from app.db.session import engine
from app.modules.auth.models import Admin, AdminRole
from app.modules.buildings.models import Building
from app.modules.rooms.models import Room
from app.modules.tenants.models import Tenant, TenantStatus
from app.modules.leases.models import Lease, LeaseStatus
from app.modules.payments.models import Payment, PaymentStatus, PaymentMethod


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def _receipt(n: int) -> str:
    return f"RCP-2025-{n:05d}"


ROOM_TYPE_MAP = {
    "single": 1,
    "double": 2,
    "triple": 3,
}


# ---------------------------------------------------------------------------
# Seed functions
# ---------------------------------------------------------------------------

def seed_admin(session: Session) -> Admin:
    existing = session.exec(select(Admin).where(Admin.email == "admin@estaris.com")).first()
    if existing:
        print("  ✓ Admin already exists — skipping")
        return existing

    admin = Admin(
        name="Demo Owner",
        email="admin@estaris.com",
        password_hash=hash_password("admin123"),
        role=AdminRole.OWNER,
    )
    session.add(admin)
    session.commit()
    session.refresh(admin)
    print("  ✓ Created admin@estaris.com  (password: admin123)")
    return admin


def seed_buildings(session: Session, admin: Admin) -> list[Building]:
    buildings_data = [
        {
            "name": "Sunrise Residency",
            "address": "12, MG Road, Koramangala, Bengaluru – 560034",
            "total_rooms": 8,
        },
        {
            "name": "Green Valley PG",
            "address": "45, Sector 18, Noida, Uttar Pradesh – 201301",
            "total_rooms": 6,
        },
        {
            "name": "Skyline Hostel",
            "address": "78, Anna Salai, Teynampet, Chennai – 600018",
            "total_rooms": 4,
        },
    ]

    buildings = []
    for bd in buildings_data:
        existing = session.exec(
            select(Building).where(Building.name == bd["name"])
        ).first()
        if existing:
            print(f"  ✓ Building '{bd['name']}' already exists — skipping")
            buildings.append(existing)
            continue

        b = Building(admin_id=admin.id, **bd)
        session.add(b)
        session.commit()
        session.refresh(b)
        print(f"  ✓ Created building: {bd['name']}")
        buildings.append(b)

    return buildings


def seed_rooms(session: Session, buildings: list[Building]) -> list[Room]:
    # (building_index, room_number, room_type, base_rent)
    room_specs = [
        # Sunrise Residency — 8 rooms
        (0, "101", "single", 8500),
        (0, "102", "single", 8500),
        (0, "103", "double", 6500),
        (0, "104", "double", 6500),
        (0, "105", "triple", 5000),
        (0, "201", "single", 9000),
        (0, "202", "double", 7000),
        (0, "203", "triple", 5500),
        # Green Valley PG — 6 rooms
        (1, "A1",  "single", 7500),
        (1, "A2",  "double", 5500),
        (1, "A3",  "double", 5500),
        (1, "B1",  "triple", 4500),
        (1, "B2",  "triple", 4500),
        (1, "B3",  "single", 8000),
        # Skyline Hostel — 4 rooms
        (2, "G01", "double", 6000),
        (2, "G02", "triple", 4800),
        (2, "G03", "single", 8200),
        (2, "G04", "double", 6200),
    ]

    rooms = []
    for bidx, room_no, rtype, rent in room_specs:
        building = buildings[bidx]
        existing = session.exec(
            select(Room).where(
                Room.building_id == building.id,
                Room.room_number == room_no,
            )
        ).first()
        if existing:
            print(f"  ✓ Room {room_no} in {building.name} already exists — skipping")
            rooms.append(existing)
            continue

        r = Room(
            building_id=building.id,
            room_number=room_no,
            room_type=rtype,
            capacity=ROOM_TYPE_MAP[rtype],
            base_rent=float(rent),
        )
        session.add(r)
        session.commit()
        session.refresh(r)
        print(f"  ✓ Created room {room_no} ({rtype}) in {building.name}")
        rooms.append(r)

    return rooms


def seed_tenants_and_leases(session: Session, rooms: list[Room]) -> None:
    # Each entry: (room_index, tenant_name, contact, id_type, id_num, move_in, rent_override)
    tenant_specs = [
        # Sunrise Residency — rooms 0..7
        (0, "Aarav Sharma",    "+91-9876543210", "Aadhaar", "2345-6789-0123", date(2025, 1, 15), None),
        (1, "Priya Mehta",     "+91-9123456789", "PAN",     "BFNPM3456D",     date(2024, 11, 1), None),
        # double room 103 — 2 tenants
        (2, "Rohit Verma",     "+91-9988776655", "Aadhaar", "1234-5678-9012", date(2025, 2, 1),  None),
        (2, "Sneha Joshi",     "+91-8877665544", "Passport","P1234567",       date(2025, 2, 1),  None),
        # double room 104 — 1 tenant
        (3, "Kiran Rao",       "+91-7766554433", "Aadhaar", "9876-5432-1098", date(2024, 10, 15), None),
        # triple room 105 — 3 tenants
        (4, "Amit Patel",      "+91-6655443322", "DL",      "MH-0220-1234567",date(2025, 3, 1),  None),
        (4, "Deepa Nair",      "+91-5544332211", "Aadhaar", "3456-7890-1234", date(2025, 3, 1),  None),
        (4, "Sanjay Kumar",    "+91-4433221100", "PAN",     "CJNPK7890F",     date(2025, 3, 1),  None),
        # Green Valley PG — rooms 8..13
        (8,  "Neha Gupta",     "+91-9000011111", "Aadhaar", "4567-8901-2345", date(2025, 1, 1),  None),
        (9,  "Vijay Singh",    "+91-9000022222", "Passport","P9876543",       date(2024, 12, 1), None),
        (9,  "Meena Reddy",    "+91-9000033333", "Aadhaar", "5678-9012-3456", date(2024, 12, 1), None),
        (11, "Arun Iyer",      "+91-9000044444", "PAN",     "DMNAI4567G",     date(2025, 4, 1),  None),
        (11, "Pooja Desai",    "+91-9000055555", "Aadhaar", "6789-0123-4567", date(2025, 4, 1),  None),
        (13, "Rahul Tiwari",   "+91-9000066666", "DL",      "UP-32-20201234", date(2025, 2, 15), None),
        # Skyline Hostel — rooms 14..17
        (14, "Kavya Pillai",   "+91-8000011111", "Aadhaar", "7890-1234-5678", date(2025, 1, 20), None),
        (14, "Arjun Das",      "+91-8000022222", "PAN",     "FHPDA1234H",     date(2025, 1, 20), None),
        (16, "Sunita Bose",    "+91-8000033333", "Passport","P5432167",       date(2025, 3, 10), None),
        (17, "Ravi Chandra",   "+91-8000044444", "Aadhaar", "8901-2345-6789", date(2024, 11, 20), None),
        (17, "Divya Krishnan", "+91-8000055555", "DL",      "TN-09-20191234", date(2024, 11, 20), None),
    ]

    receipt_counter = [1]

    for (ridx, name, contact, id_type, id_num, move_in, rent_override) in tenant_specs:
        room = rooms[ridx]
        rent = float(rent_override or room.base_rent)
        security = rent * 2  # 2-month security deposit

        # Check if tenant already exists
        existing = session.exec(
            select(Tenant).where(Tenant.contact_number == contact)
        ).first()
        if existing:
            print(f"  ✓ Tenant {name} already exists — skipping")
            receipt_counter[0] += 10
            continue

        tenant = Tenant(
            room_id=room.id,
            name=name,
            permanent_address="123, Home Town, India",
            contact_number=contact,
            emergency_contact_name="Family Contact",
            emergency_contact_number="+91-9999999999",
            id_proof_type=id_type,
            id_proof_number=id_num,
            move_in_date=move_in,
            status=TenantStatus.ACTIVE,
        )
        session.add(tenant)
        session.commit()
        session.refresh(tenant)

        # Create lease
        lease = Lease(
            tenant_id=tenant.id,
            start_date=move_in,
            end_date=move_in + timedelta(days=365),
            monthly_rent=rent,
            security_deposit=security,
            payment_due_day=5,
            status=LeaseStatus.ACTIVE,
        )
        session.add(lease)
        session.commit()
        session.refresh(lease)

        # Seed payment history — every month from move_in up to June 2025
        payment_date = move_in
        billing_start = date(move_in.year, move_in.month, 1)
        billing_end = date(2025, 6, 1)

        current_billing = billing_start
        methods = [PaymentMethod.UPI, PaymentMethod.CASH, PaymentMethod.BANK_TRANSFER]
        m_idx = 0

        while current_billing <= billing_end:
            # Mark the last month as pending to simulate real data
            is_latest = (current_billing.year == 2025 and current_billing.month == 6)
            p_status = PaymentStatus.PENDING if is_latest else PaymentStatus.PAID
            p_date = current_billing.replace(day=5) if not is_latest else date(2025, 6, 5)
            p_method = methods[m_idx % len(methods)]

            receipt = _receipt(receipt_counter[0])
            receipt_counter[0] += 1

            payment = Payment(
                lease_id=lease.id,
                billing_month=current_billing.month,
                billing_year=current_billing.year,
                amount_due=rent,
                amount_paid=0.0 if is_latest else rent,
                payment_date=p_date,
                payment_method=p_method,
                status=p_status,
                receipt_number=receipt,
                transaction_reference=f"TXN{receipt_counter[0]:08d}" if not is_latest else None,
                remarks="On time" if not is_latest else "Pending payment",
            )
            session.add(payment)

            # Advance month
            if current_billing.month == 12:
                current_billing = current_billing.replace(year=current_billing.year + 1, month=1)
            else:
                current_billing = current_billing.replace(month=current_billing.month + 1)
            m_idx += 1

        session.commit()
        print(f"  ✓ Seeded tenant {name} with lease + payment history in room {room.room_number}")


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

def seed():
    print("\n🌱  Starting seed...\n")

    with Session(engine) as session:
        print("[ Admin ]")
        admin = seed_admin(session)

        print("\n[ Buildings ]")
        buildings = seed_buildings(session, admin)

        print("\n[ Rooms ]")
        rooms = seed_rooms(session, buildings)

        print("\n[ Tenants / Leases / Payments ]")
        seed_tenants_and_leases(session, rooms)

    print("\n✅  Seed complete!\n")
    print("  Login credentials:")
    print("  ─────────────────────────────────────")
    print("  Email   : admin@estaris.com")
    print("  Password: admin123")
    print("  Role    : Owner")
    print("  ─────────────────────────────────────\n")


if __name__ == "__main__":
    seed()