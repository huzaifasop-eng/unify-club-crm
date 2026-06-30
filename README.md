# Unify Club ERP & CRM

**Leading the Empowerment of Every Ability**

A multi-branch ERP & CRM platform for organizations delivering inclusive sports, fitness,
therapy, daycare, rehabilitation, and education programs to children with disabilities
(Autism, Down Syndrome, ADHD, Cerebral Palsy, and others).

## Tech stack

| Layer | Technology |
| --- | --- |
| Frontend | Next.js 14 (App Router), TypeScript, Tailwind CSS, ShadCN-style UI primitives, Framer Motion, TanStack Query, Recharts, @dnd-kit |
| Backend | NestJS 10, TypeScript, Prisma ORM 5, JWT (access + refresh), bcrypt |
| Database | PostgreSQL 16 |
| Infra | npm workspaces monorepo, Docker / docker-compose, GitHub Actions CI |

## Repository layout

```
apps/
  api/    NestJS backend (REST API, Prisma schema/migrations/seed)
  web/    Next.js frontend
docker-compose.yml
.github/workflows/ci.yml
```

## Prerequisites

- Node.js 20+
- npm 10+
- PostgreSQL 16 (local install or via Docker)
- Docker + Docker Compose (optional, for containerized local dev)

## Environment variables

### `apps/api/.env` (copy from `apps/api/.env.example`)

| Variable | Description |
| --- | --- |
| `DATABASE_URL` | Postgres connection string, e.g. `postgresql://unify:unify_password@localhost:5432/unify_club_crm?schema=public` |
| `JWT_ACCESS_SECRET` / `JWT_REFRESH_SECRET` | Secrets for signing access/refresh tokens |
| `JWT_ACCESS_EXPIRES_IN` / `JWT_REFRESH_EXPIRES_IN` | Token lifetimes (defaults `15m` / `7d`) |
| `NOTIFICATION_EMAIL_PROVIDER` / `NOTIFICATION_WHATSAPP_PROVIDER` / `NOTIFICATION_PUSH_PROVIDER` | Set to `console` for the mock/no-op provider used in this build (no real external API calls are made) |
| `STORAGE_PROVIDER` / `STORAGE_LOCAL_DIR` | Set to `local` to write uploads to a local directory (no real S3/Cloudinary calls are made) |
| `CORS_ORIGIN` | Allowed origin for the frontend (e.g. `http://localhost:3000`) |

### `apps/web/.env.local` (copy from `apps/web/.env.example`)

| Variable | Description |
| --- | --- |
| `NEXT_PUBLIC_API_URL` | Base URL of the API, e.g. `http://localhost:4000/api/v1` |

## Running locally (without Docker)

```bash
# 1. Install dependencies for both apps
npm install

# 2. Start PostgreSQL and create the database/role
#    (adjust to however Postgres is installed on your machine)
createuser unify --pwprompt
createdb unify_club_crm -O unify

# 3. Configure env files
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env.local
# edit DATABASE_URL / JWT secrets / NEXT_PUBLIC_API_URL as needed

# 4. Run migrations and seed demo data
cd apps/api
npx prisma migrate deploy
npm run seed
cd ../..

# 5. Start both dev servers (in separate terminals)
npm run dev:api    # http://localhost:4000  (Swagger docs at /api/docs)
npm run dev:web    # http://localhost:3000
```

## Running locally (with Docker Compose)

```bash
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env.local
docker compose up --build
```

This starts Postgres, runs migrations automatically on API boot (`prisma migrate deploy`), and
serves the API and web app. Seed the database once the containers are healthy:

```bash
docker compose exec api npm run seed
```

## Demo accounts (after seeding)

All demo accounts use the password `Password123!`.

| Email | Role | Scope |
| --- | --- | --- |
| `superadmin@unifyclub.org` | Super Admin | All branches |
| `manager.pechs@unifyclub.org` | Branch Manager | PECHS branch |
| `sales.pechs@unifyclub.org` | Sales Executive | PECHS branch |
| `coach.gulshan@unifyclub.org` | Coach | Gulshan branch |
| `therapist.clifton@unifyclub.org` | Therapist | Clifton branch |
| `parent.demo@unifyclub.org` | Parent | — |

Seeded data includes 5 branches, 22 roles with permission grants, ~60 leads across the full
pipeline, 25 enrolled children with admissions and progress notes, fee invoices/payments, and
attendance/leave records — enough to populate the dashboard and reports with realistic numbers.

## Testing

```bash
npm run test:api      # Jest unit tests (auth flow, lead pipeline transitions, fee calculations)
```

## Module status

| Module | Status |
| --- | --- |
| Auth (JWT login/refresh/logout) | Fully functional |
| RBAC (roles & permissions) | Fully functional |
| Branches & Settings admin | Fully functional |
| Dashboard (KPIs, trends, recent activity) | Fully functional |
| Lead CRM (Kanban pipeline, search/sort/pagination) | Fully functional |
| Admissions | Fully functional |
| Child Profiles | Fully functional |
| Fees & Invoicing | Fully functional |
| Attendance | Fully functional |
| HR basics (staff, leave requests) | Fully functional |
| Reports (revenue, fee collection, admissions trend, lead funnel) | Fully functional |
| Call Management | Placeholder (schema + stub API + "coming soon" UI) |
| Follow-up Manager | Placeholder |
| Trial Management | Placeholder |
| Parent Portal | Placeholder |
| Sports Management | Placeholder |
| Therapy Management | Placeholder |
| Payroll | Placeholder |
| Finance / Ledger | Placeholder |
| Expense Tracker | Placeholder |
| Inventory | Placeholder |
| Marketing CRM | Placeholder |
| Events | Placeholder |
| Notifications center | Placeholder (provider-agnostic console/mock service implemented; no UI) |
| Documents | Placeholder |
| Calendar | Placeholder |

Placeholder modules have a full Prisma schema, a NestJS module/controller stub, and a frontend
nav entry that renders a clean "coming soon" page — there are no dead links.

## Known gaps / follow-ups

- AI features (lead scoring, chatbot, OCR) are explicitly out of scope and not implemented.
- WhatsApp/SMTP/push notification and S3/Cloudinary storage integrations are provider-agnostic
  interfaces with console-log mock implementations only — no real external API calls are made.
  Swapping in a real provider means implementing the corresponding interface and switching the
  `*_PROVIDER` env var.
- The 15 placeholder modules listed above need their own NestJS service/controller logic and
  frontend CRUD UI to become fully functional — the schema and navigation scaffolding are ready.
- End-to-end (Cypress/Playwright) tests are not included; only backend Jest unit tests are
  provided as a credible testing pattern.
