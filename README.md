# Estaris Tenant Management System

Estaris is a premium, modern, and mobile-responsive property and tenant management application. It allows landlords and property owners to easily track properties (buildings), manage rooms and bed occupancies, monitor tenant check-ins, oversee lease contracts, log rent payments, and send automated notifications.

## Features

- **Dashboard**: High-level key metrics (total occupancy, expected vs. collected rents, active/vacating tenants count, pending dues).
- **Directory Directories**: Unified search and filterable directories for Buildings, Rooms, Tenants, and Leases.
- **Tenant Profile Page**: Complete tenant dashboard with lease details, payment histories, and actions to message them or send rent reminders.
- **Automated Alerts**: Real-time reminders for pending/overdue rent cycles.
- **Sleek UI/UX**: Premium dark theme sidebar navigation with Outfit typography and smooth transitions, fully optimized for both desktop and mobile screens.

---

## Tech Stack

### Backend
- **Framework**: FastAPI (Python)
- **ORM / DB Layer**: SQLModel & SQLAlchemy
- **Migration Engine**: Alembic
- **Database**: PostgreSQL (e.g. Neon)
- **Authentication**: JWT tokens (Access + Refresh)

### Frontend
- **Framework**: React (TypeScript) + Vite
- **Styling**: Tailwind CSS v4
- **Icons**: Lucide Icons
- **HTTP Client**: Axios (configured with auto-joins for subpaths)

---

## Getting Started

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Create and activate a virtual environment:
   ```bash
   python3 -m venv .venv
   source .venv/bin/activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Set up your `.env` configuration:
   ```env
   SECRET_KEY=your-random-token-secret
   DATABASE_URL=postgresql://user:pass@host/dbname
   ```
5. Run migrations:
   ```bash
   alembic upgrade head
   ```
6. Start the development server:
   ```bash
   uvicorn app.main:app --reload
   ```

### Seeding Demo Data

To populate the database with mock properties, rooms, tenants, leases, and payment history:
```bash
python scripts/seed.py
```
**Default Admin Credentials:**
- **Email**: `admin@estaris.com`
- **Password**: `admin123`

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install npm packages:
   ```bash
   npm install
   ```
3. Start the dev server:
   ```bash
   npm run dev
   ```

---

## Deployment on Render

### 1. Deploying the Blueprint
This project contains a `render.yaml` blueprint configuration in the root directory that automatically provisions both services together:
1. Log in to your Render Dashboard.
2. Click **New +** -> **Blueprint**.
3. Select this GitHub repository.
4. Render will read `render.yaml` and prompt you for configuration details.

### 2. Environment Variables Required

#### `estaris-backend` (Python Web Service - Free Plan):
- `DATABASE_URL`: Connection string to your PostgreSQL instance (e.g. Neon).
- `SECRET_KEY`: A secure random secret string for JWT authentication tokens.

#### `estaris-frontend` (Static Site - Free Plan):
- `VITE_API_URL`: The URL of your deployed backend (e.g. `https://estaris-backend.onrender.com/api/v1`).
