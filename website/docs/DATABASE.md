# Database

## 0. Current State: There is no database

The public website (`website/`) is a static site with no backend and no persistence layer. The three forms on the site — Contact (`contact.html`), Book a Trial (`book.html`), and Volunteer (`get-involved.html#volunteer`) — are intercepted entirely client-side by `assets/js/main.js`, which shows a success message and resets the form. **No submission is stored anywhere today.** This is a deliberate, documented gap (see PRD.md §12, ARCHITECTURE.md §12), not an oversight — treat the rest of this document as a proposal for if/when that changes, not a description of something that exists.

Note: this repository also contains a separate, fully-built product — the internal ERP/CRM (`apps/api`, Prisma schema, Postgres) — which **does** have a real database with 24+ modules including a Leads module. That product is out of scope for this document set; it is not connected to the public website in any way today (see ARCHITECTURE.md §9 for why they're kept separate). It's mentioned here only because it's the most likely integration target if the website's forms are ever wired up — see Section 4 below.

## 1. Database Engine

Database: None currently. **Proposal, pending a decision (see Section 4):** if a lightweight backend is added just for this site's three forms, a managed PostgreSQL instance (e.g., the same Railway Postgres already used by the CRM, or a separate small instance) is the natural default given the rest of this repo already standardizes on Postgres + Prisma.
Hosting: N/A today.

## 2. Naming Conventions

N/A — no schema exists yet. If one is built, follow the same conventions already established in `apps/api/prisma/schema.prisma` for consistency across the repo (snake_case columns, plural table names, `id`/`created_at`/`updated_at` on every table).

## 3. Tables

None exist. If the website's forms get a real backend, the minimum viable schema would be three simple submission tables — **not** a shared "users" system, since this public site has no accounts:

### trial_bookings (proposed)
Purpose: Captures Book a Trial form submissions (book.html).
Columns (proposed): id, child_name, child_age, parent_name, phone, email, preferred_program, preferred_day, preferred_time, notes, created_at, status (new / contacted / scheduled / closed)

### contact_messages (proposed)
Purpose: Captures Contact form submissions (contact.html).
Columns (proposed): id, name, email, subject, message, created_at, status (new / replied / closed)

### volunteer_applications (proposed)
Purpose: Captures Volunteer interest submissions (get-involved.html).
Columns (proposed): id, name, email, phone, interest_area, availability, notes, created_at, status (new / contacted / onboarded / declined)

## 4. Relationships

None today. **Open question, not yet decided:** should these proposed tables live in a brand-new, minimal database dedicated to the website, or should form submissions instead be inserted directly into the existing CRM's `leads`/`trials`/`admissions` modules (`apps/api/src/modules/leads`, `.../trials`, `.../admissions`) so staff triage everything in one place? This is a real architectural fork and should be decided with the client before any backend code is written — it is **not** assumed or implemented anywhere yet.

## 5. Constraints

N/A — no schema exists. If/when built, at minimum: `email` and `phone` should be validated server-side before insert (client-side `required`/`type="email"` validation on the current forms is not a substitute — see SECURITY.md §API Security), and every table needs `created_at` for triage ordering.

## 6. Indexes

N/A — no schema exists.

## 7. Data Validation

Today: only native HTML5 validation (`required`, `type="email"`, `type="tel"`, `type="date"`) runs in the browser, and it is trivially bypassable (disable JS, or just edit the DOM). This is acceptable **only** because nothing is currently persisted or acted upon — it must not be treated as real validation once a backend exists. See SECURITY.md §5.

## 8. Soft Delete

N/A — no schema exists. If built: no strong opinion yet; given the small expected volume (a nonprofit's inbound form traffic), hard delete with an audit log is likely sufficient rather than building soft-delete infrastructure — revisit if volume proves otherwise.

## 9. Auditing

N/A — no schema exists. If built: at minimum log `created_at` and `status` transitions (new → contacted → …) per record, so staff can see response times.

## 10. Sensitive Data

Today: no data is ever stored, so there is nothing to protect server-side. The sensitive fields that **would** exist the moment a backend is added are: child's name and age, parent's name/phone/email. These are exactly the kind of data a children's-services nonprofit must be careful with — see SECURITY.md §Data Protection for the handling rules that must be in place *before*, not after, any backend goes live.

## 11. Migration Rules

N/A — no schema exists yet. If a database is introduced, follow the same rule already stated in SECURITY.md/AGENTS.md generally: schema changes must be documented, migrated (not hand-edited against production), tested, and must not break existing data. If the decision in Section 4 is to extend the existing CRM's Prisma schema rather than create a new database, follow that schema's existing migration workflow (`apps/api/prisma/migrations`) rather than inventing a parallel one.

## 12. Seed Data

N/A — no schema exists, so there is no seed data for the website. (The separate CRM product does have its own seed script — see the repo root `README.md` — which is unrelated to this document.)
