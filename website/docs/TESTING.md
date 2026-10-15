# Testing

## 1. Testing Goals

Critical functionality:
- Every internal link resolves to a real file (no broken nav/footer/CTA links across all 13 pages).
- No page produces horizontal overflow (content clipped or forcing a scrollbar) at any common viewport width.
- Every icon referenced with `<use href="#i-name">` has a matching `<symbol id="i-name">` in that same page's sprite.
- All HTML tags are balanced (`<div>`/`</div>`, `<section>`/`</section>`, `<main>`/`</main>`) — a mismatch here is how a previous edit silently broke page layout mid-project and had to be caught and fixed.
- Content stays visible with JavaScript disabled (the `<noscript>` reveal-override fallback).

## 2. Test Types

### Automated structural checks (what actually exists today)
Small Python/Node scripts, written ad hoc during development and re-runnable at any time (not currently committed as a standing test suite — see §3 "Tools" for why):
- Tag-balance check: count `<div>` vs `</div>`, `<section>` vs `</section>`, `<main>` vs `</main>` per file.
- Broken-link check: extract every `href="..."` across all `.html` files, confirm every relative target exists as a real file in `website/`.
- Icon-reference check: per file, confirm every `href="#i-..."` used by a `<use>` has a matching `<symbol id="i-...">` defined in that same file's sprite (the sprite is duplicated per page — see ARCHITECTURE.md §4 — so this must be checked per file, not once globally).

### Visual / layout verification
Headless Chromium (the environment's pre-installed browser at `/opt/pw-browsers/chromium-1194`), driven via the `playwright` package already available on the system (`NODE_PATH=/opt/node22/lib/node_modules`):
- Screenshot key pages/states after any visual change and manually review them (this is how the amber-gradient-muddiness bug in DESIGN_SYSTEM.md §3 and the nav-overflow bug below were actually caught — by looking at a real rendered screenshot, not by reading the CSS).
- Overflow scan: for every page × a representative set of widths (this project used 360 / 768 / 1100 / 1440px), load the page and assert `document.documentElement.scrollWidth <= viewportWidth`. Block requests to `fonts.googleapis.com`, `fonts.gstatic.com`, and `www.google.com` during this scan (`page.route(...).abort()`) — otherwise Chromium's `domcontentloaded` event can stall for the full navigation timeout waiting on those blocked-by-sandbox requests, which is a sandbox artifact, not a real-site issue (real visitors' browsers reach those hosts fine).

### End-to-End Testing (manual, since there's no app to automate against)
Critical journeys verified by hand in a real/headless browser after any change that touches them:
- A visitor can reach every one of the 13 pages from the nav and footer.
- The mobile hamburger menu opens, its dropdown items (About, Get Involved, Contact) tap-expand, and a nav-cta link to Book a Trial is reachable without the header ever overflowing its own width (this exact failure happened once — see §6).
- Submitting the Contact, Book a Trial, or Volunteer form shows the local success message (understanding that this is **not** a real submission — see SECURITY.md §8).
- The Gallery lightbox opens on tile click and closes on backdrop/close-button click.
- The FAQ accordion on `faqs.html` and `contact.html` expands/collapses and only one panel per group stays open at a time.

## 3. Testing Tools

Unit: None configured — there is no business logic complex enough to warrant unit tests; the site's "logic" is DOM wiring, verified by the manual/E2E checks above.
Integration: None — there is no API to integration-test (see ARCHITECTURE.md).
E2E: Manual, headless-Chromium-assisted as described in §2. **Open item:** if this site grows a real form backend (DATABASE.md §4, SECURITY.md §8), that backend should get real automated tests; the static frontend's own test needs are adequately covered by the structural + visual checks above without needing a full E2E framework (e.g., Playwright Test) installed as a project dependency, which would contradict the zero-dependency architecture decision (ARCHITECTURE.md §9) unless it's kept dev-only and never shipped.

## 4. Test File Structure

```
No tests/ directory exists in website/ today — all checks described in §2 are
run as throwaway scripts during development (written to the session scratchpad,
not committed to the repo), since there is no standing test runner configured.
```
If this changes (see §3 open item), a `tests/` folder should follow the same shape used elsewhere in this repo (`apps/api` already has Jest tests) for consistency: `tests/unit/`, `tests/integration/`, `tests/e2e/`.

## 5. Critical User Flows

Flow: Book a Free Trial (the site's primary conversion action)
Steps:
1. Visitor lands on `index.html`, clicks "Book a Free Trial" (hero or CTA banner)
2. Lands on `book.html`
3. Fills required fields (child name/age, parent name, phone, email, program, day, time) and submits
Expected result: `.form-success` message appears with the confirmation copy; form resets. (Reminder: no data is actually sent anywhere yet — see SECURITY.md §8. This flow currently verifies UI behavior only, not a real booking.)

Flow: Explore Programs from Home
Steps:
1. Visitor clicks a program card on `index.html` ("Learn more")
2. Lands on `programs.html` scrolled to the correct anchor (`#therapy`, `#fitness`, or `#rehab`)
Expected result: The matching section is visible; anchor scroll accounts for the sticky nav height (`scroll-padding-top` is set on `html` precisely for this).

Flow: Mobile navigation
Steps:
1. On a ≤1080px viewport, tap the hamburger icon
2. Tap "About" (a dropdown parent) — it expands in place rather than navigating
3. Tap "Our Story" inside the now-open dropdown
Expected result: Lands on `about.html`; the mobile menu closes on navigation; at no point does the header overflow its own width (see §6 regression).

## 6. Coverage

Target: Every page reachable, every link valid, zero layout overflow at tested widths, forms usable (with the known caveat in §8 of SECURITY.md) — not formal code-coverage percentage, since there's no application logic to measure coverage of.
Prioritize:
- Nav/footer integrity across all 13 pages (highest blast radius — a shell bug appears everywhere at once).
- No horizontal overflow on mobile widths (this project caught two real overflow bugs this way: an amber-into-teal gradient readability issue, and a nav header that overflowed 390px width because the standalone "Book a Trial" button and hamburger icon didn't fit together — fixed by hiding the standalone button on mobile and moving the CTA into the slide-out menu instead).
- Internal link correctness after any page is added/renamed/removed.
- Icon sprite completeness after any new icon is introduced (must be added to **every** page's duplicated sprite, not just the one page being edited — easy to forget).

## 7. Commands

Test: No `npm test` exists for this site. Use the ad hoc Python/Playwright scripts described in §2, re-created as needed (they are not committed, since they're throwaway verification tools, not a product test suite — see §3 open item if that should change).
Lint: None configured.
Build: None — there is nothing to build (see ARCHITECTURE.md §2).
Type Check: N/A (no TypeScript).

## 8. Definition of Done

- [ ] Tests pass — N/A in the traditional sense; instead: structural checks (§2) re-run clean
- [ ] Build passes — N/A, no build exists
- [ ] Lint passes — N/A, no linter configured
- [ ] Type checking passes — N/A, no TypeScript
- [ ] Critical flow verified — the specific flow touched by the change was manually re-checked (§5)
- [ ] No blocking errors — zero overflow at 360/768/1100/1440px; zero broken links; zero tag-balance mismatches; every icon reference resolves
