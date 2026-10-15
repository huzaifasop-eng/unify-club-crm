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

### Feature 4 - Team & Board
Purpose: Establish governance credibility for donors/partners and introduce the care team to parents.
User Flow: Hero (breadcrumb: Home > About > Team & Board) → Care Team grid → Board of Directors grid → CTA to Get Involved.
Acceptance Criteria: Every person has a name, role, and (for care team) a one-line specialty.
Open item: all names are currently placeholders — see Section 12.

### Feature 5 - Get Involved (Donate & Volunteer)
Purpose: Convert visitors into donors, volunteers, or corporate partners.
User Flow: Hero → 3 ways-to-help cards → donation tiers + bank transfer details (`#donate`) → volunteer form (`#volunteer`) → CTA.
Acceptance Criteria: Volunteer form captures name, email, phone, interest area, availability, and notes, and shows a success confirmation on submit.
Open item: bank account details are placeholder text, clearly bracketed, pending real banking information. No real payment processor is integrated (see SECURITY.md §API/Forms).

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
Acceptance Criteria: Contact form, address/phone/email (clickable `tel:`/`mailto:`), map embed, and a short FAQ teaser linking to the full FAQs page.

### Feature 11 - Book a Trial
Purpose: The primary conversion action for parents — reserve a free trial session.
Acceptance Criteria: Form captures child name/age, parent name, phone, email, preferred program, preferred day/time, and notes; shows a success confirmation on submit.
Open item: no backend currently receives this submission — see Section 7 and SECURITY.md.

### Feature 12 - FAQs
Purpose: Reduce support load by answering the most common pre-visit questions in one place, grouped by Getting Started / Programs & Sessions / Visiting Us.

## 7. Non-Goals

The following are intentionally NOT part of this version:
- A real payment gateway or online donation checkout (bank transfer only, for now).
- A backend that stores/emails form submissions (contact, booking, volunteer forms currently confirm locally in the browser only — no data is sent anywhere).
- A CMS or admin panel for editing content — all content is hand-edited HTML.
- A blog/news system with individual article pages, comments, or an RSS feed.
- Bilingual (English/Urdu) content and language switching (the original single-page draft had partial Urdu; this rebuild is English-only except a decorative Urdu line in the footer).
- Any integration with the internal ERP/CRM (`apps/web`/`apps/api`) — the two products are deliberately kept separate (see ARCHITECTURE.md §9).

## 8. MVP Scope

Must Have:
- All 13 pages listed in Section 6, reachable from a consistent nav/footer.
- Mobile-first responsive layout with no horizontal overflow at any common width.
- Working `tel:`/`mailto:` links and an embedded map with the real address.
Nice to Have:
- Animated counters and scroll reveals (implemented, degrade gracefully without JS).
- Dropdown nav grouping (implemented, since the full page set no longer fits a flat bar).
Future:
- A real form backend (see Section 7) so Book a Trial, Contact, and Volunteer submissions actually reach staff.
- Real photography to replace illustrated gallery/hero tiles.

## 9. Success Metrics

Primary Metrics:
- Number of completed "Book a Trial" form submissions (once a backend exists to measure this).
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

- The organization's real branch is North Nazimabad, Karachi, Pakistan (as stated by the client); the address block itself is still a placeholder street-level detail.
- The phone number (+92 314 1123 441) and email (Info@unifyclub.org) supplied by the client are correct and monitored.
- The client will supply real board member names, real bank transfer details, and real photography before public launch.
- "Each and every page that KDSP has" was interpreted, per the client's explicit instruction, as "use your best judgment to match the breadth of a typical disability-nonprofit site" rather than a literal page-for-page clone, since the reference site could not be accessed from this environment.

## 12. Open Questions

- What are the real names and roles of the Board of Directors and care team? (Currently placeholder names clearly invented for structure — see team.html.)
- What are the real bank account / IBAN details for donations? (Currently bracketed placeholders on get-involved.html.)
- Should Book a Trial / Contact / Volunteer form submissions go to email, a spreadsheet, a simple serverless function, or eventually into the existing ERP/CRM's Leads module (`apps/api/src/modules/leads`)? No backend is wired up yet.
- Will real photography replace the current illustrated/gradient placeholder tiles (hero collage, Gallery, Success Stories)?
- Is Urdu-language support actually required, or is English-only acceptable long-term?
- What is the organization's legal/registered name for the donation bank transfer instructions (the site currently says "Unify Club Trust" as a placeholder)?
