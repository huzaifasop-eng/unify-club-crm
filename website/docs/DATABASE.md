# Database

## 0. Current State: Implemented — website forms write into the CRM's existing Leads module

**Updated.** The client decided the open question this document used to pose: website form submissions (Book a Trial, Contact, Volunteer) are **not** a new, separate database — they create real `Lead` records in the same Postgres database the internal ERP/CRM already uses (`apps/api`, Prisma schema). This happens through a new, deliberately unauthenticated public API surface (`apps/api/src/modules/leads/public-leads.controller.ts` / `public-leads.service.ts`), not by the website talking to the database directly. See ARCHITECTURE.md §6/§9 and SECURITY.md §5/§8 for the full request path and the security reasoning.

The website itself (`website/`) is still a static site with no database of its own and never will have one — it's a client of the CRM's API, nothing more.

## 1. Database Engine

Database: **PostgreSQL** — the same instance/schema the CRM already uses (`apps/api/prisma/schema.prisma`), no new database was created.
Hosting: Whatever hosts the CRM's API today (see the repo root `DEPLOY.md` — Railway Postgres in the documented setup).

## 2. Naming Conventions

Unchanged from the existing schema — `Lead`/`LeadActivity` models, camelCase fields in Prisma mapping to the schema's existing conventions. No new tables or columns were added for this feature (see §3).

## 3. Tables

**No new tables.** Rather than the three proposed `trial_bookings`/`contact_messages`/`volunteer_applications` tables this document used to sketch, website submissions reuse the CRM's existing tables as-is:

### Lead (existing — reused, not modified)
How website submissions map onto it:
- `source` = `WEBSITE` (an existing `LeadSource` enum value — it was already there, unused until now)
- `stage` = `NEW_LEAD` (default)
- `branchId` = looked up by `Branch.code` (env var `PUBLIC_INTAKE_BRANCH_CODE`, defaults to `"NNAZ"` — North Nazimabad, the branch the website's Locations page describes)
- `parentName`, `childName`, `parentEmail` = taken directly from the form
- `parentPhone` = taken from the form, or the literal string `"Not provided"` if empty (the Contact form doesn't collect phone, but the schema's `parentPhone` column is non-nullable)
- `notes` = a formatted summary of whatever the Lead schema has no dedicated column for — which form it came from, preferred program/day/time (Book a Trial), subject/message (Contact), interest area/availability (Volunteer). See `PublicLeadsService.buildNotes()`.
- `createdById` = `null` (no staff user submitted it)

### LeadActivity (existing — reused, not modified)
One row is created per submission: `type: 'created'`, `userId: null`, a note naming which website form it came from (e.g. "Submitted via website — Book a Trial").

## 4. Relationships

**Decided** (this section used to pose this as the open question): website leads attach to a real `Branch` via `branchId`, exactly like staff-created leads — there is no separate "website leads" silo. A lead created from the website is, from the moment it's created, indistinguishable in the CRM's existing Kanban/pipeline views from one a staff member entered by hand, except for `source: WEBSITE` and the `[Website — ...]` prefix in its notes.

## 5. Constraints

Unchanged — no new constraints were added to the schema. `CreatePublicLeadDto` (class-validator) is the application-level validation gate before anything reaches Prisma; see SECURITY.md §5.

## 6. Indexes

Unchanged — no new indexes needed; website-sourced leads are queried through the same existing `Lead`/`LeadActivity` indexes as any other lead.

## 7. Data Validation

**Implemented.** `CreatePublicLeadDto` validates every field server-side (types, max lengths, enum membership for `formType`) before a `Lead` is created — this is real validation now, not the "client-side only, trivially bypassable" state this document used to describe. See `apps/api/src/modules/leads/dto/public-lead.dto.ts` and SECURITY.md §5.

## 8. Soft Delete

Unchanged from however the existing `Lead` model already handles this (no soft-delete column on `Lead` today) — website-sourced leads follow whatever the CRM's existing leads already do; this feature didn't change that policy.

## 9. Auditing

**Implemented via the existing mechanism**: every website submission creates a `LeadActivity` row (see §3), the same auditing mechanism staff-created leads already use. No separate audit log was built.

## 10. Sensitive Data

Now real, not hypothetical: child's name and age, parent's name/phone/email, and free-text notes that may describe a diagnosis are stored the moment someone submits a website form. See SECURITY.md §6 for what is and isn't exposed back to the public (the status-check endpoint is deliberately minimal), and for the still-open retention/deletion policy question.

## 11. Migration Rules

**No migration was needed** — this feature added zero new tables/columns, so it required no Prisma migration. If that ever changes (e.g., a dedicated column is wanted instead of the `notes`-field summary in §3), follow the CRM's existing migration workflow (`apps/api/prisma/migrations`), per the rule already stated in AGENTS.md.

## 12. Seed Data

Unchanged. One new environment variable matters for this feature to work at all: `PUBLIC_INTAKE_BRANCH_CODE` (see `apps/api/.env.example`) must match a real, already-seeded `Branch.code` — the existing seed script already creates one with code `"NNAZ"` (North Nazimabad), which is the default. If a database is ever reseeded without that branch, or the branch is renamed, website submissions will fail loudly with a clear error (not silently drop) until this is reconfigured — see `PublicLeadsService.create()`.
