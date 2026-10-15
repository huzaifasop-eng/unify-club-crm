# Security Guidelines

## 0. Current State Summary

**Updated:** the three forms now submit for real. `POST /api/v1/public/leads` (unauthenticated, in `apps/api/src/modules/leads/public-leads.controller.ts`) creates a record in the CRM's existing `Lead` model and returns a status the website renders as a 3-step tracker. The frontend/website itself is still static and account-free (no visitor logs in to anything) — what changed is that it now talks to a real backend instead of pretending locally. See DATABASE.md §0 and ARCHITECTURE.md §6/§9 for the full picture, and Section 8 below for exactly what the public endpoint does and doesn't expose.

## 1. Authentication

Authentication Provider: None — this site has no logins, accounts, or sessions. (Not to be confused with the separate internal ERP/CRM product in this repo, which has its own JWT-based auth — see that product's own documentation, out of scope here.)
Methods: N/A

## 2. Authorization

Roles: N/A — there is no privileged action anywhere on this public site; every page is public.
Permissions: N/A
Authorization must be enforced server-side: N/A today (no server). **This rule becomes mandatory the moment any admin/edit capability is added to this site** (e.g., a future "edit news post" feature) — do not ship client-side-only gating for anything privileged.

## 3. Secrets

- Never hard-code credentials: N/A today — there are no credentials anywhere in `website/`. Keep it that way; this folder should never gain an API key, access token, or password in plain text.
- Never commit production secrets: Applies the moment a backend/email/API integration is added (see Section 8).
- Never expose private secrets to the client: The current Google Maps embed deliberately uses the no-API-key `https://www.google.com/maps?...&output=embed` form specifically so no key needs to exist in client-side HTML. If the map is ever upgraded to a JS API embed requiring a key, that key must be domain-restricted in the Google Cloud Console, not just "kept secret" (a client-side key is always visible in page source regardless).
- Use environment variables / rotate compromised credentials / use appropriate secret storage: N/A today, mandatory once Section 8 is implemented.

## 4. Environment Variables

Public: None currently.
Private: None currently.

## 5. API Security

The client decided (per DATABASE.md §4): submissions route into the existing CRM's Leads module via a new, deliberately separate public surface — `PublicLeadsController`/`PublicLeadsService` in `apps/api/src/modules/leads/`, never the authenticated `LeadsController`. What's actually in place:
- **Server-side validation**: `CreatePublicLeadDto` (`class-validator`) enforces types/lengths on every field; the client-side `required`/`type=` attributes are UX only, not the real validation.
- **Rate limiting**: a minimal in-memory sliding-window limiter (5 submissions / 10 minutes / IP) in `PublicLeadsService`. Deliberately simple — no new dependency — and resets on API restart; acceptable for a low-traffic nonprofit intake form, revisit if abuse is observed.
- **Bot protection**: a honeypot field (`website`) on all three forms, visually hidden via `.hp-field` CSS, not `display:none` (so simple bots that skip hidden fields still fill it). A non-empty value makes the service silently return a fake success rather than erroring, so the bot doesn't learn to adapt.
- **CORS**: `CORS_ORIGIN` in `apps/api/.env` now accepts a comma-separated list (`main.ts`) so both the CRM frontend and the public website's real origin can be allowed once the website has a deployed domain. **Open item:** the website isn't deployed yet, so this still needs the real production origin added before launch — `localhost` alone won't work from a live site.
- **No admin surface is exposed publicly**: `PublicLeadsController` only has `POST /` (create) and `GET /:id/status` (a deliberately narrow status lookup, see §6) — nothing else from the Leads module is reachable without the existing JWT auth.

## 6. Data Protection

Sensitive data now actually collected: child's name and age, parent/guardian name, phone, email, and free-text notes that may describe a child's diagnosis or needs — stored as a real `Lead` row (plus form-specific extras folded into `notes`, see DATABASE.md §3). This is sensitive personal data about a minor:
- **Encryption in transit**: HTTPS depends on wherever the website ends up hosted — not yet deployed, so not yet verified. Confirm explicitly once a real host/domain is chosen.
- **Who can see it**: the same CRM staff who already have `leads:read` permission on the authenticated Leads module — no new audience was created. The public endpoint only ever *writes*; it has no read access to lead data beyond the single caller's own 3-step status (see §8).
- **What the public status lookup deliberately does NOT expose**: `GET /public/leads/:id/status` returns only `{ id, step, stepLabel }` — never the parent's name, child's details, internal `LeadStage` value, or `LOST`/`DUPLICATE`/`JUNK` classifications (those map back to a generic "Submitted" so a parent is never shown something that reads as a rejection). See `public-leads.service.ts`'s `STEP_BY_STAGE` mapping.
- **Enumeration risk**: lead IDs are UUIDs (not sequential), so guessing another family's reference code to probe their status is impractical — acceptable for now given the status endpoint reveals almost nothing anyway.
- Retention / deletion policy: still **not decided** — flag to the client: how long should booking/contact/volunteer records be kept, and does a parent have a way to request their child's information be deleted? This governs the CRM's Leads data generally, not just website-sourced leads, so it's a product decision beyond this document set's scope.

## 7. Logging

There is no server, so there is no server-side logging today. The only "logging" that exists is the browser console, and nothing sensitive is logged to it. If a backend is added:
Never log: passwords (N/A, no auth), API keys/tokens, full form submissions containing a child's personal details (log IDs/status transitions instead, not raw payloads).
Log: submission received (by ID, not full content), status transitions, errors.

## 8. Form / API Handling

| Form | Page | Behavior | Real submission wired up? |
|---|---|---|---|
| Book a Trial | `book.html` | POSTs to `/public/leads`, renders 3-step tracker | **Yes** |
| Contact | `contact.html` | POSTs to `/public/leads`, renders 3-step tracker | **Yes** |
| Volunteer | `get-involved.html` | POSTs to `/public/leads`, renders 3-step tracker | **Yes** |

Endpoints (`apps/api/src/modules/leads/public-leads.controller.ts`, no auth guard by design):
- `POST /api/v1/public/leads` — body validated by `CreatePublicLeadDto`; creates a `Lead` (source `WEBSITE`, stage `NEW_LEAD`) on the branch named by `PUBLIC_INTAKE_BRANCH_CODE` (defaults to `NNAZ`); logs a `LeadActivity` with `userId: null`. Returns `{ id, step, stepLabel }`.
- `GET /api/v1/public/leads/:id/status` — returns the same shape for a returning visitor checking progress (the website's `contact.html` has a "Check your status" widget for this).

**Still open before this is production-safe:**
- The website itself isn't deployed, so `assets/js/config.js`'s `window.UNIFY_API_BASE_URL` is still an empty string — forms correctly show a "not connected yet" error with a phone/email fallback until someone sets this to the real deployed API URL (see ARCHITECTURE.md §3 and `config.js`'s own comment).
- `CORS_ORIGIN` on the API needs the website's real production origin added (see §5) once it has one.
- `PUBLIC_INTAKE_BRANCH_CODE` must match a seeded `Branch.code` in whatever database the API runs against — it fails loudly with a clear error if not, rather than silently dropping the submission, but someone needs to confirm this before launch.

## 9. Security Checklist

- [x] Authentication implemented — N/A, correctly not implemented (no accounts on a public marketing site; the new endpoints are intentionally unauthenticated, see §5)
- [x] Authorization implemented — N/A for the website; the public endpoints correctly cannot reach any authenticated Leads functionality
- [x] Server-side validation — `CreatePublicLeadDto` (class-validator), see §5
- [x] Secrets protected — no API keys/credentials anywhere in `website/`; the API's secrets live in its own `.env`, unchanged
- [ ] Sensitive data protected — retention/deletion policy still undecided, see §6; everything else (encryption in transit, access scope, status-endpoint minimal exposure) is addressed
- [x] Rate limiting considered — simple in-memory limiter, see §5 (flagged there as intentionally basic)
- [x] File uploads validated — N/A, still no file upload feature anywhere
- [x] Errors do not expose sensitive details — the public status endpoint never returns parent/child details or raw internal stage names, see §6
- [x] Dependencies reviewed — the website frontend still has **zero** JS dependencies; the backend change added zero new npm packages (reused `class-validator`, already a dependency)
- [ ] **CORS origin for the live website domain** — not yet added (website isn't deployed), see §5 and §8
