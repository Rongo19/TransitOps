# TransitOps

**Smart Transport Operations Platform** — built for the Odoo Hackathon 2026 (8-hour build).

TransitOps digitizes fleet, driver, dispatch, maintenance, and expense management for logistics operations — replacing spreadsheets and manual logbooks with a centralized platform that enforces business rules automatically and gives real-time operational visibility.

---

## Problem

Logistics companies relying on spreadsheets and manual logbooks face scheduling conflicts, underutilized vehicles, missed maintenance, expired driver licenses, inaccurate expense tracking, and poor operational visibility.

## Solution

A single platform managing the complete transport operations lifecycle — vehicle registration, driver management, trip dispatch, maintenance, fuel/expense logging, and analytics — with business rules enforced automatically at the API layer, not just the UI.

## Target Users

- **Fleet Manager** — oversees fleet assets, maintenance, vehicle lifecycle
- **Dispatcher** — creates trips, assigns vehicles/drivers, monitors active deliveries
- **Safety Officer** — tracks driver compliance, license validity, safety scores
- **Financial Analyst** — reviews operational expenses, fuel consumption, profitability

---

## Tech Stack

**Frontend:** React + Vite, TypeScript, Tailwind CSS, shadcn/ui, React Router, TanStack Query, React Hook Form + Zod, Recharts, Axios

**Backend:** Node.js, Express, TypeScript, Prisma ORM, JWT + bcrypt, Zod validation

**Database:** PostgreSQL

**Deployment:** Frontend → Vercel · Backend → Render/Railway · Database → Neon

---

## Architecture

```
React Frontend (Vite + TS)
        │  REST API (JSON, JWT auth)
        ▼
Express Backend (TS)
        │
   ┌────┴─────┐
   │ RBAC middleware
   │ Service layer + business rule engine
   └────┬─────┘
        ▼
   Prisma ORM
        │
        ▼
   PostgreSQL (Neon)
```

Modular backend layout: `controllers/ → services/ → routes/`, with `middlewares/`, `validators/`, and `utils/` supporting each layer. Business logic lives in the service layer, never in controllers — this keeps trip/vehicle/driver status transitions centralized and testable.

---

## Database Design

**Entities:** `User`, `Vehicle`, `Driver`, `Trip`, `MaintenanceLog`, `FuelLog`, `Expense`

**Key relationships:**
- `Trip` → `Vehicle` (many-to-one), `Trip` → `Driver` (many-to-one)
- `MaintenanceLog`, `FuelLog`, `Expense` → `Vehicle` (many-to-one)
- `FuelLog` → `Trip` (optional many-to-one)

**Constraints:**
- `Vehicle.registrationNumber` — unique
- `Driver.licenseNumber` — unique
- Status fields modeled as Prisma enums (`VehicleStatus`, `DriverStatus`, `TripStatus`, `MaintenanceStatus`) for DB-level validation
- Indexes on all `status` fields (heavily filtered by dashboard and dispatch queries)

Full schema: [`backend/prisma/schema.prisma`](backend/prisma/schema.prisma)

---

## Core Modules

1. Authentication (JWT + RBAC)
2. Dashboard (KPIs, filters)
3. Vehicle Registry
4. Driver Management
5. Trip Dispatcher
6. Maintenance
7. Fuel & Expense Management
8. Reports & Analytics
9. Settings & RBAC matrix

---

## Mandatory Business Rules

All enforced server-side in the service layer, not just the UI:

- Vehicle registration number and driver license number must be unique
- Retired or in-shop vehicles are excluded from trip dispatch
- Drivers with expired licenses or suspended status cannot be assigned to trips
- A vehicle or driver already `ON_TRIP` cannot be double-booked
- Cargo weight must not exceed the vehicle's max load capacity (validated client-side live, and re-validated server-side at dispatch)
- Dispatching a trip atomically sets vehicle + driver to `ON_TRIP`
- Completing a trip atomically restores vehicle + driver to `AVAILABLE`, records final odometer and fuel consumed
- Cancelling a dispatched trip restores vehicle + driver to `AVAILABLE`
- Creating an active maintenance record sets vehicle to `IN_SHOP`
- Closing maintenance restores vehicle to `AVAILABLE` (unless retired)
- All multi-table status transitions run inside Prisma `$transaction` blocks — no partial-failure states

---

## API Reference

Base URL (local): `http://localhost:5000/api`
Auth: `Authorization: Bearer <JWT>` header on all routes except `/auth/register` and `/auth/login`
Response shape: `{ success: true, data: {...} }` or `{ success: false, message: "...", errors: [...] }`

```
POST   /auth/register
POST   /auth/login
GET    /auth/me

GET    /vehicles          POST /vehicles          GET/PUT/DELETE /vehicles/:id
GET    /drivers           POST /drivers           GET/PUT /drivers/:id

GET    /trips             POST /trips (DRAFT)
PATCH  /trips/:id/dispatch
PATCH  /trips/:id/complete
PATCH  /trips/:id/cancel

GET    /maintenance       POST /maintenance
PATCH  /maintenance/:id/close

GET    /fuel-logs         POST /fuel-logs
GET    /expenses          POST /expenses

GET    /dashboard/kpis
GET    /analytics/fuel-efficiency
GET    /analytics/utilization
GET    /analytics/cost
GET    /reports/export?format=csv
```

Full contract: [`API_CONTRACT.md`](API_CONTRACT.md)

---

## Local Setup

### Backend

```bash
cd backend
npm install
```

Create `backend/.env`:
```
DATABASE_URL="postgresql://<user>:<password>@<host>/<db>?sslmode=require"
JWT_SECRET="<generate with: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))">"
PORT=5000
FRONTEND_URL=http://localhost:5173
```

```bash
npx prisma generate
npx prisma migrate dev
npm run dev
```

Backend runs at `http://localhost:5000`. Health check: `GET /api/health`.

### Frontend

```bash
cd frontend
npm install
```

Create `frontend/.env`:
```
VITE_API_URL=http://localhost:5000/api
```

```bash
npm run dev
```

Frontend runs at `http://localhost:5173`.

---

## Example Workflow (end-to-end test)

1. Register a vehicle `VAN-05`, max capacity 500 kg, status `Available`
2. Register a driver `Alex` with a valid license
3. Create a trip with cargo weight 450 kg → system validates 450 ≤ 500
4. Dispatch the trip → vehicle and driver flip to `On Trip`
5. Complete the trip with final odometer + fuel consumed → both flip back to `Available`
6. Log a maintenance record → vehicle flips to `In Shop`, hidden from dispatch
7. Reports update operational cost and fuel efficiency based on the latest trip and fuel log

---

## Deployment

- **Frontend:** Vercel — set `VITE_API_URL` to the deployed backend URL
- **Backend:** Render/Railway — build command `npm install && npx prisma generate && npm run build`, start command `npm run start`; set `DATABASE_URL`, `JWT_SECRET`, `FRONTEND_URL` as environment variables; run `npx prisma migrate deploy` against production
- **Database:** Neon PostgreSQL

Live URLs:
- Frontend: `<add once deployed>`
- Backend: `<add once deployed>`

---

## Project Status

- [x] Workspace, database schema, API contract
- [x] Auth + RBAC (JWT, bcrypt, role middleware)
- [x] Vehicle + Driver CRUD
- [x] Trip engine (create/dispatch/complete/cancel, atomic transactions)
- [x] Maintenance workflow
- [x] Fuel logs, expenses, dashboard KPIs, analytics

---

## Repository Structure

```
transitops/
  backend/
    src/
      controllers/
      services/
      routes/
      middlewares/
      utils/
      validators/
    prisma/
      schema.prisma
  frontend/
    src/
      components/
      pages/
      hooks/
      api/
      lib/
      types/
  API_CONTRACT.md
  README.md
```
