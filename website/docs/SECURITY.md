# Security Guidelines

## 0. Current State Summary

This is a static, unauthenticated, backend-free public website. There are no user accounts, no secrets, no server, and no stored data today — which eliminates most traditional attack surface, but it also means the "security" posture of this product is really about (a) not misleading visitors about what happens to the information they submit, and (b) doing the groundwork now so that whenever a real backend is added, it isn't bolted on carelessly. Read this document together with DATABASE.md §0 and ARCHITECTURE.md §12.

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

There is no API today. Input validation, rate limiting, CORS, authentication, and authorization for Section 8's proposed form-handling backend are all **undesigned and undecided** — do not assume any particular approach (serverless function, third-party form service like Formspree, or routing into the CRM's existing API) until the client decides, per DATABASE.md §4. Whichever is chosen, the minimum bar before going live:
- Server-side validation of every field (the current client-side `required`/`type=` attributes are not validation — see Data Protection below).
- Rate limiting / basic bot protection (honeypot field or similar) on all three forms, since a public, unauthenticated form endpoint is a predictable spam target.
- CORS locked to the site's real deployed origin(s) once a domain is known.

## 6. Data Protection

Sensitive data collected by the site's forms, once (if) a backend exists: child's name and age, parent/guardian name, phone, email, free-text notes which may describe a child's diagnosis or needs. This is sensitive personal data about a minor and should be handled with real care:
- Encryption: data in transit must be HTTPS-only (the deploy targets referenced in ARCHITECTURE.md — Netlify/Vercel/most modern shared hosts — provide this by default; confirm it explicitly for whatever host is actually chosen, since "my hosting" was never specified).
- Retention: not yet decided — flag to the client: how long should booking/contact/volunteer records be kept, and who has access?
- Deletion: not yet decided — flag to the client: does a parent have a way to request their child's information be deleted?

Until these decisions are made, **do not silently build a form backend as a side effect of an unrelated task.** This is explicitly called out because it's the kind of thing an AI coding agent might "helpfully" add without realizing it's collecting data about children without an agreed data-handling policy.

## 7. Logging

There is no server, so there is no server-side logging today. The only "logging" that exists is the browser console, and nothing sensitive is logged to it. If a backend is added:
Never log: passwords (N/A, no auth), API keys/tokens, full form submissions containing a child's personal details (log IDs/status transitions instead, not raw payloads).
Log: submission received (by ID, not full content), status transitions, errors.

## 8. Form / "API" Handling (website-specific, in place of a generic endpoint list)

This section replaces a conventional endpoint-by-endpoint API log, since none exists. The three client-side-only forms and what they currently do:

| Form | Page | Current behavior | Real submission wired up? |
|---|---|---|---|
| Book a Trial | `book.html` | Shows local success message, resets form | **No** |
| Contact | `contact.html` | Shows local success message, resets form | **No** |
| Volunteer | `get-involved.html` | Shows local success message, resets form | **No** |

**This must be communicated to the client plainly, not just buried in docs:** as deployed today, submitting any of these forms does not notify Unify Club staff in any way. If the client believes these forms are "live," that is a real operational risk (a parent books a trial and no one ever sees it). This was flagged in the PRD (§12) and should be resolved — at minimum with a `mailto:` fallback, more robustly with a real backend per DATABASE.md §4 — before the site is promoted as the primary booking channel.

## 9. Security Checklist

- [x] Authentication implemented — N/A, correctly not implemented (no accounts on a public marketing site)
- [x] Authorization implemented — N/A, correctly not implemented
- [ ] Server-side validation — not applicable yet (no server); required before any backend ships
- [x] Secrets protected — none exist in the codebase; verified no API keys are embedded anywhere in `website/`
- [ ] Sensitive data protected — undecided, see Section 6; must be resolved before a form backend collects real children's data
- [ ] Rate limiting considered — not applicable yet; required before any backend ships
- [x] File uploads validated — N/A, this site has no file upload feature anywhere
- [x] Errors do not expose sensitive details — N/A, no server-side errors exist to expose
- [x] Dependencies reviewed — the site has **zero** npm/CDN JS dependencies by design (see ARCHITECTURE.md §3); only third-party requests are Google Fonts and a keyless Google Maps embed, both reviewed above
