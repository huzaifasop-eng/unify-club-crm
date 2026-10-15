# Product Requirements Document

## 1. Product Overview

Product Name: Unify Club — Public Marketing Website
One-Line Description: A multi-page marketing and information site for Unify Club, an inclusive sports-therapy, rehabilitation, and fitness studio for children with Autism, Down Syndrome, ADHD, Cerebral Palsy, and other abilities.
Product Type: Static public website (not the internal ERP/CRM — that is a separate product in `apps/web` and `apps/api` in this same repository).
Primary Platform: Web (desktop + mobile browsers). No native app.

## 2. Problem

What problem are we solving? Families searching for Unify Club online, or being referred to it, had no public-facing site to learn about programs, see pricing/impact, read success stories, or book a trial session. The only existing web asset was the internal ERP/CRM login screen.
Why does this problem matter? A credible public site is the first trust signal for parents evaluating a therapy provider for their child, and it's the entry point for donations, volunteers, and partnerships that the organization depends on.
How are users solving this today? Word of mouth, phone calls, and in-person visits only.

## 3. Goal

Primary Goal: Give families, donors, volunteers, and partners a professional, trustworthy, easy-to-navigate website that explains what Unify Club does and lets a parent book a free trial session in under two minutes.
Secondary Goals:
- Make it easy to find and support the organization (donate, volunteer, partner).
- Present Unify Club as a well-governed, professional organization (team, board, news) to build credibility with donors and partners.
- Be deployable to any static host with zero build step, so it can go live quickly and be edited by non-developers later with minimal tooling.

## 4. Target Users

### User Type 1
Name: Parent/Caregiver
Description: A parent or guardian of a child with a disability, evaluating Unify Club as a therapy/fitness provider, usually from a phone, often first contact.
Needs:
- Understand what programs exist and whether they fit their child's needs.
- See evidence the organization is credible and safe (team, success stories, real address).
- Book a free trial session with minimal friction.
Pain Points:
- Limited time, often doing this research while also managing their child.
- Wary of organizations that feel clinical, cold, or impersonal.
- May be reading in a second language (English), so clarity matters more than cleverness.

### User Type 2
Name: Donor / Corporate Partner
Description: An individual or company considering a financial contribution, sponsorship, or CSR partnership.
Needs:
- Proof of legitimate governance (named board, named staff).
- Clear, concrete ways to give (bank transfer, sponsorship tiers) and what the money funds.
- A way to reach a real person to discuss a partnership.
Pain Points:
- Skepticism about where donations actually go.
- No way currently to verify the organization has a board or audited structure.

### User Type 3
Name: Prospective Volunteer / Staff
Description: Someone interested in volunteering time or skills, or exploring working at Unify Club.
Needs:
- Understand what roles exist and how to apply.
- See the team they'd be joining.

## 5. User Stories

As a parent, I want to see the programs offered so that I can decide if Unify Club fits my child's needs.
As a parent, I want to book a free trial session so that I can try the program before committing.
As a parent, I want to read other families' success stories so that I can trust the organization with my child.
As a donor, I want to see sponsorship tiers and bank details so that I can make a direct contribution.
As a volunteer, I want to submit my interest and availability so that the team can follow up with me.
As any visitor, I want to find the studio's address, phone, and hours so that I can visit or call.
As any visitor, I want answers to common questions (ages, diagnosis requirements, what to bring) so that I don't have to call to get basic information.

## 6. Core Features

### Feature 1 - Home
Purpose: Orient a first-time visitor in seconds and drive them toward Book a Trial or Explore Programs.
User Flow: Land on hero → see mission + impact stats → scan program highlights → see a success-story preview and testimonials → hit a CTA banner.
Inputs: None (no forms on this page besides nav/footer newsletter field).
Outputs: Navigation to every other page.
Acceptance Criteria:
- Hero communicates the mission in one sentence within the first screen on both desktop and mobile.
- Impact stats are visible and animate in on scroll (counts up) using `data-count`.
- All primary CTAs ("Book a Free Trial", "Explore Programs") are reachable without scrolling on common desktop widths.
Edge Cases:
- JavaScript disabled or blocked: content must still be fully visible (handled via the `<noscript>` reveal-opacity override — see DESIGN_SYSTEM.md and AGENTS.md).
- Narrow viewports (≤360px): no element may force horizontal scroll.

### Feature 2 - Programs
Purpose: Explain the three program tracks (Therapy-Led Sessions, Physical Fitness, Rehabilitation) in enough depth that a parent can self-select, plus the enrollment process.
User Flow: Hero → one detailed section per program (anchors `#therapy`, `#fitness`, `#rehab`) → 4-step "how it works" timeline → CTA.
Acceptance Criteria:
- Each program section lists concrete features/benefits, not just a label.
- Anchors are linked from Home's program cards and the footer, and resolve correctly.

### Feature 3 - Success Stories
Purpose: Build trust through specific, named (first-name only) progress narratives and parent testimonials.
User Flow: Hero → 3 child progress cards with a visual progress bar → testimonial grid → CTA.
Acceptance Criteria: Each profile shows at least one measurable-sounding outcome, not generic praise.

### Feature 4 - Leadership
Purpose: Introduce Unify Club's actual leadership to build credibility with parents, donors, and partners.
User Flow: Hero (breadcrumb: Home > About > Leadership) → Leadership team grid → CTA to Get Involved.
Acceptance Criteria: Every person has a real name and role.
**Resolved** (was an open item): the client specified the real leadership — Huzaifa (CEO), Ali (Co-Founder), Haani (Manager). The page no longer invents a larger care team or board; it shows exactly these three. If the organization later has additional staff or a formal board to add, extend this page rather than reintroducing placeholder names.

### Feature 5 - Get Involved (Donate & Volunteer)
Purpose: Convert visitors into donors, volunteers, or corporate partners.
User Flow: Hero → 3 ways-to-help cards → donation tiers + bank transfer details (`#donate`) → volunteer form (`#volunteer`, now wired to the CRM, see Feature 11a) → CTA.
Acceptance Criteria: Volunteer form captures name, email, phone, interest area, availability, and notes, creates a real Lead, and shows the 3-step tracker on submit (see Feature 11a).
Open item: the account title now correctly reads "Unify Club" (the client confirmed the organization's own name rather than an invented trust name), but the **bank name, account number, and IBAN are still bracketed placeholders** — these cannot be filled in without the client's real banking details; see Section 12. No real payment processor is integrated (see SECURITY.md §API Security).

### Feature 6 - Events
Purpose: List recurring/upcoming events (workshops, sports day, assessment week) and funnel interest to Contact.
Acceptance Criteria: Each event shows a date, time, location, and one-line description.

### Feature 7 - News
Purpose: Give the organization a place to post updates, building freshness and credibility signals for repeat visitors/donors.
Acceptance Criteria: Each post is self-contained on the listing page (title, date, category, 2–3 sentence body) — there is intentionally no per-article detail page yet (see Section 7, Non-Goals).

### Feature 8 - Gallery
Purpose: Convey the feel of the studio and sessions visually.
Acceptance Criteria: Grid of labeled tiles; clicking a tile opens a lightbox with the caption.
Open item: tiles are illustrated/gradient placeholders, not real photography — see Section 12.

### Feature 9 - Locations
Purpose: Give a real, verifiable address, hours, and an embedded map; present planned future branches.
Acceptance Criteria: Google Maps iframe embed resolves to the correct address; facilities list is accurate to the real branch.

### Feature 10 - Contact
Purpose: Catch-all for questions not resolved by other pages; collects general inquiries.
Acceptance Criteria: Contact form (now wired to the CRM, see Feature 11a), address/phone/email (clickable `tel:`/`mailto:`), map embed, a "check your status" lookup widget, and a short FAQ teaser linking to the full FAQs page.

### Feature 11 - Book a Trial
Purpose: The primary conversion action for parents — reserve a free trial session.
Acceptance Criteria: Form captures child name/age, parent name, phone, email, preferred program, preferred day/time, and notes; creates a real Lead and shows the 3-step tracker on submit (see Feature 11a).

### Feature 11a - Lead capture & 3-step progress tracker (cross-cutting, Book a Trial / Contact / Volunteer)
Purpose: Replace the old static "thank you" message with something that actually reaches staff and gives the family a sense of where their request stands.
User Flow: Submit any of the three forms → POST to the CRM API's public Leads endpoint → form hides, replaced by a 3-step tracker (Submitted → Our team reviews → Confirmed & scheduled) with the current step highlighted and a saved reference code → the same reference code can be re-checked later via the status widget on Contact.
Acceptance Criteria:
- A successful submission creates a real `Lead` in the CRM (source `WEBSITE`), reachable by staff through the CRM's existing Leads module — no new admin UI was built for this (see ARCHITECTURE.md §9/DATABASE.md §0).
- A failed submission (API unreachable, not yet configured, validation error) never shows a false success — the form stays filled in and visible, and a clear error with a phone/email fallback is shown instead.
- The public tracker never reveals internal stage names or negative classifications (`LOST`/`DUPLICATE`/`JUNK`) — only a generic 3-step view (see SECURITY.md §6).
**Resolved** (was an open item in Section 12): submissions go into the existing CRM's Leads module, not a new database.
Open item: the website isn't deployed yet, so `assets/js/config.js`'s API URL is still empty — every submission currently shows the "not connected" error state until that's set to the real deployed API URL.

### Feature 12 - FAQs
Purpose: Reduce support load by answering the most common pre-visit questions in one place, grouped by Getting Started / Programs & Sessions / Visiting Us.

### Feature 13 - Dark/light and English/Urdu toggles (site-wide)
Purpose: Accessibility and reach — let visitors read in their preferred theme and, where supported, their preferred language.
Acceptance Criteria:
- A theme toggle in the nav switches the whole site between light and dark, persists via `localStorage`, and respects the OS preference (`prefers-color-scheme`) on first visit; no flash of the wrong theme on load.
- A language toggle switches translated elements to Urdu (Noto Nastaliq Urdu, right-aligned) and back; persists via `localStorage`.
Open item: Urdu coverage is **partial** — the shared nav/footer and the full Home page are translated; deeper pages (Programs, Success Stories, etc.) still render in English when Urdu is selected. The dictionary (`assets/js/i18n.js`) and toggle mechanism are built to extend page-by-page without new infrastructure — this is a scoping decision made to ship the toggle now rather than block it on translating all 13 pages' full body copy, not a technical limitation.

## 7. Non-Goals

The following are intentionally NOT part of this version:
- A real payment gateway or online donation checkout (bank transfer only, for now).
- A CMS or admin panel for editing content — all content is hand-edited HTML. (Lead submissions are the one exception that now has a real "backend" — they're triaged through the CRM's existing Leads module UI, not a new admin panel built for the website.)
- A blog/news system with individual article pages, comments, or an RSS feed.
- Full bilingual (English/Urdu) coverage of every page's body content — the toggle and infrastructure exist site-wide, but translated coverage today is the shared chrome plus the Home page only; see Feature 13.
- A full RTL (right-to-left) layout mirror — Urdu text renders right-aligned where translated, but the page's overall layout direction stays LTR; see DESIGN_SYSTEM.md §16.
- Any *architectural merge* of the website and the internal ERP/CRM — they remain two separate codebases (see ARCHITECTURE.md §9). The website now *calls* the CRM's API for lead capture, which is a deliberate, narrow integration, not a merge: the website still has no accounts, no CRM UI, and cannot read any CRM data beyond a single lead's own 3-step status.

## 8. MVP Scope

Must Have:
- All 13 pages listed in Section 6, reachable from a consistent nav/footer.
- Mobile-first responsive layout with no horizontal overflow at any common width.
- Working `tel:`/`mailto:` links and an embedded map with the real address.
Nice to Have:
- Animated counters and scroll reveals (implemented, degrade gracefully without JS).
- Dropdown nav grouping (implemented, since the full page set no longer fits a flat bar).
- Dark/light and English/Urdu toggles (implemented site-wide; Urdu content coverage is partial, see Feature 13).
Done (moved out of Future since the last revision):
- A real form backend — Book a Trial, Contact, and Volunteer now create real Leads in the CRM (see Feature 11a). What's left is deployment configuration (API URL, CORS origin), not more building.
Future:
- Real photography to replace illustrated gallery/hero tiles.
- Extend Urdu translation coverage beyond Home + chrome to the remaining pages.

## 9. Success Metrics

Primary Metrics:
- Number of completed "Book a Trial" form submissions — now measurable directly via the CRM's Leads module (filter by `source: WEBSITE`) once the site is deployed and connected (see Section 12).
- Click-through rate from Home to Programs/Book a Trial.
Secondary Metrics:
- Donation/volunteer form submissions from Get Involved.
- Time-to-first-CTA-click (proxy for how quickly the hero communicates value).

## 10. Constraints

Technical: Must run as a static site with zero build step, deployable to any generic static host (shared hosting/cPanel, Netlify, Vercel, GitHub Pages) — see ARCHITECTURE.md §2 for why.
Business: No budget confirmed yet for a backend service, CMS, or payment gateway; the site must work and look complete without them.
Design: Must retain the "teal/blue" brand direction requested by the client, inspired by (but not a literal clone of) kdsp.org.pk, which this environment's network policy blocks from being fetched directly — see DESIGN_SYSTEM.md §0.
Timeline: No fixed launch date communicated; treated as "ready to deploy now, refined iteratively."

## 11. Assumptions

- The organization's real branch is North Nazimabad, Karachi, Pakistan (as stated by the client); the street-level address block itself is still a placeholder detail.
- The phone number (+92 314 1123 441) and email (Info@unifyclub.org) supplied by the client are correct and monitored.
- The client confirmed the real leadership (Feature 4) and the donation account title ("Unify Club"); the client will still supply the real bank name/account number/IBAN and real photography/video before public launch.
- "Each and every page that KDSP has" was interpreted, per the client's explicit instruction, as "use your best judgment to match the breadth of a typical disability-nonprofit site" rather than a literal page-for-page clone, since the reference site could not be accessed from this environment.
- The three reference sites named for a visual/animation redesign (dogstudio.co, theyearofgreta.com, sadapay.pk) are also unreachable from this environment (DNS resolution fails under the sandbox's network policy — confirmed, not assumed). Any redesign in that direction is working from general/training knowledge of those sites' genre (motion-forward agency and fintech sites), not a direct inspection — flagged as lower-confidence than the rest of this document for that reason.

## 12. Open Questions

- ~~What are the real names and roles of the Board of Directors and care team?~~ **Resolved** — Huzaifa (CEO), Ali (Co-Founder), Haani (Manager); see Feature 4.
- What are the real bank name / account number / IBAN for donations? (Account title is now correct; the rest are still bracketed placeholders on get-involved.html — cannot be filled without the client's real banking details.)
- ~~Should form submissions go to email, a spreadsheet, or the CRM's Leads module?~~ **Resolved** — the CRM's existing Leads module; see Feature 11a, DATABASE.md §0.
- When will the website actually be deployed, and to what URL? This is now a real blocker for Feature 11a working end-to-end (see `assets/js/config.js` and SECURITY.md §8) — not a documentation gap, a deployment task.
- Will real photography/video replace the current illustrated/gradient placeholder tiles (hero collage, Gallery, Success Stories)? The client confirmed they'll provide real media; it hasn't been supplied to this session yet, so the illustrated placeholders are still in place.
- Should Urdu translation coverage be extended beyond Home + the shared chrome to the remaining 11 pages?
- What should the visual/animation redesign referencing dogstudio.co / theyearofgreta.com / sadapay.pk actually change — just motion/interaction polish on the existing layout, or a structural redesign? Given these sites couldn't be inspected directly (see Section 11), confirming specific liked elements (or sharing screenshots) would sharpen this significantly before a full 13-page redesign is attempted.
