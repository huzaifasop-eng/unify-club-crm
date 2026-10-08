# SaT PaK — Website (satpak-website/)

A multi-page, "quiet industrial luxury" corporate website for **Shaikh al Tijarat
Pakistan (SaT PaK)**, built from the full brief (Requirements, Sitemap &
Architecture, Website Copy, Branding & Identity Spec, Technical Launch Spec,
the Website Master Fix List, and the Pictures & Icons Manifest). It is a
**static, dependency-free HTML/CSS/JS site** — no build step, no database, no
framework — so it can be uploaded to any host and be live immediately.

> **Note on scope:** this was built inside the `unify-club-crm` repository as a
> self-contained folder (`satpak-website/`), separate from that repo's own
> Next.js/NestJS app — the two projects are unrelated. Treat this folder as an
> independent deliverable; it does not touch or depend on anything else in the repo.

## Why static instead of WordPress

The original brief recommends WordPress for staff-editability. Building and
hosting a live WordPress install isn't something this environment can do (it
needs real hosting, a database, and credentials). A static site directly
satisfies "ready to upload and live" — drop the folder onto any host via
FTP/cPanel/Netlify/Vercel/S3 and it works with zero server setup, and it's
faster than a typical WordPress+plugin stack.

**Trade-off:** non-technical staff cannot edit content without a developer,
unlike a CMS. Two ways forward:
1. Keep it static — a developer edits the HTML files directly (each page is
   self-contained, well-commented, and the design system lives in one CSS file).
2. Use this site as the design/content reference and rebuild it as a WordPress
   theme with custom post types for products — all copy, structure, pricing
   and visual spec are already finalized here, which is most of the work.

## Structure

```
satpak-website/
  index.html                       Home — cinematic scroll-driven film hero
  ro-plants-services.html          RO Plants & Services
  chemicals-minerals.html          Chemicals & Minerals (catalogue, pricing, cart)
  product-klassec.html … product-filters-fittings.html   12 priced product detail pages
  article.html                     Article — pricing, real lab report data, bill calculator, subscribe
  health-wellness.html             Health & Wellness (category-grouped, license-gated)
  home-care.html                   Home Care (category-grouped)
  contact.html                     Segmented enquiry chooser + forms + live map
  our-story.html                   Our Story & Heritage, founder's message, milestones
  privacy.html / terms.html / cookie-policy.html   Legal drafts (have counsel review)
  404.html
  robots.txt / sitemap.xml
  partials/header.html, partials/footer.html   Shared header, footer, cart panel, contact FAB
  assets/css/style.css             Core design system
  assets/css/cinematic.css         Scroll-choreography layer (film heroes, parallax, pipeline, marquee…)
  assets/js/include.js             Loads header/footer partials + reveal-animation safety net
  assets/js/main.js                Site behaviour (menu, forms, cart + live pricing, contact FAB, etc.)
  assets/js/motion.js              Scroll choreography engine (reveals, parallax, pinned scenes, counters)
  assets/img/brand/                Real SaT PaK logo files (satpak-mark.png, satpak-logo.png)
  assets/img/clients/              Real client logo images (11 files)
  assets/img/plant/                Real RO plant photography (5 files)
  assets/video/                    Hero/RO/chemicals/article footage + poster frames (8 mp4 + 4 webp)
```

Header and footer live once in `partials/` and are injected into every page via
`fetch()` — edit them there instead of in every HTML file. This only works when
served over HTTP(S) (any real host), not by double-clicking the HTML file locally.

## Deploying (upload & go live)

1. Point **satpak.pk** at your hosting/CDN (every canonical/OG URL already points here).
2. Upload the entire `satpak-website/` folder contents to the web root (e.g. `public_html/`).
3. Enforce HTTPS (most hosts / Netlify / Vercel / Cloudflare do this automatically).
4. Test locally first if you like: `python3 -m http.server 8000` from inside
   `satpak-website/`, then open `http://localhost:8000/index.html`.

## The SaT PaK Pipeline (CRM)

A working lead-tracking board, built as a separate tool (not part of the
static site — it needs a live backend the static files can't provide):

**https://claude.ai/code/artifact/86434be0-bee3-49e1-93cf-b286ecb3fffb**

Open it, enter a name and one of these passcodes:
- **Owner passcode:** `SATPAK-OWNER` — sees every lead, can delete leads.
- **Team passcode:** `SATPAK-TEAM` — sees only leads assigned to them, plus
  unassigned ones.

It's a Kanban board (New → Contacted → Quoted → Won → Lost) with notes,
assignment, search, and reference numbers, backed by a real shared database
(everyone who opens it sees the same live board). Two seeded sample leads
show what a populated board looks like — delete them once your team starts
adding real ones.

**Be honest about what this is and isn't:**
- **It is not connected to the live website's forms.** A static website has
  no way to write into this board directly — there's no server in between.
  When a Web3Forms email comes in, someone clicks "+ Add Lead" and logs it
  (takes seconds; the reference number format matches what the visitor saw).
  Real auto-sync needs a small backend service that both emails you *and*
  writes to a real database — exactly what the fix list itself flagged as
  needing "hosting + keys," which this environment doesn't have. If you want
  that built later, it's a well-scoped follow-up (a serverless function
  triggered by Web3Forms, writing to Supabase or similar).
- **The owner/team passcodes are a lightweight access gate, not real
  authentication.** They're hardcoded in the page (search `OWNER_PIN` /
  `MANAGER_PIN` in the artifact's source if you ever need to change them) —
  fine for a small trusted team, not a substitute for individual logins.
  The brief asked for 6 named users (3 owners, 3 management); rather than
  hardcode names nobody gave me, each person just types their own name once
  (remembered on their device) and uses whichever passcode matches their role.
- Only people signed in to Claude can open it — it's private to your
  account/workspace, not publicly indexed.

## What changed in the "cinematic" pass

A second asset/design pack ("cinematic edits") was supplied and merged into
the FINAL-pass content below — not swapped in wholesale, since its HTML was
based on an earlier draft and would have regressed pricing, lab data and the
founder's message if copied as-is. What's new:

- **Real brand and photography assets, finally.** `satpak-mark.png` /
  `satpak-logo.png` (the real logo, replacing the abstract placeholder mark
  in header/footer/favicon), 11 real client logo images, 5 real RO-plant
  photographs, and 8 short hero/RO/chemicals/article video clips with poster
  frames. These were missing in every earlier pass; this is the first time
  real imagery exists on the site instead of abstract line-art placeholders.
- **A scroll-driven cinematic layer** (`assets/css/cinematic.css` +
  `assets/js/motion.js`): full-bleed video heroes that settle into a framed
  window as you scroll, word-by-word statement reveals, a horizontal
  scroll-pinned "water line" process strip with an animated flow path, a
  cursor-following department preview panel, parallax plant photography, an
  auto-scrolling client logo marquee, and a testimonial carousel. Degrades
  cleanly: without JavaScript or with `prefers-reduced-motion`, every section
  renders fully readable in its end state.
- **A new contact FAB** (floating action button) replacing the old
  always-visible stacked WhatsApp/Instagram/Facebook icons — one tap-to-open
  button expanding into WhatsApp, Call, Instagram and Facebook, now including
  tap-to-call as a floating option on every page.
- **A real Google Maps place embed** on Contact, pointed at the actual SaT
  PaK RO Plant Manufacturer & Maintenance business listing, with a "Get
  directions" link.
- **Article gets a live bill estimator** — a bottles-per-week slider that
  computes your monthly bill and refundable deposit in real time, using the
  real Rs 110/refill and Rs 1,100/deposit figures.
- **Reconciled during the merge, not just copied through:**
  - The cinematic pack's testimonials used invented company names ("Pure Aqua
    Lime", "Purifa Water", "Paragon", "Al Matir") not found in any brief
    document. These were not real client names, so I kept the new carousel
    design but put back honest `Client name, sector` placeholder attribution
    — same as every earlier pass. Don't publish named quotes until you've
    approved and sourced them for real.
  - The client marquee and its body copy asserted "100+ RO plant operators"
    as a specific client count with no source. I removed the number, keeping
    "RO plant operators" as an unquantified category alongside the named
    clients.
  - Every price, pack size and lab figure in Chemicals & Minerals, the 12
    product pages and Article was re-applied on top of the new layout — the
    pack's own base HTML had no pricing at all (it predates that work) and
    used generic placeholder pack sizes (e.g. "2.5 L / 5 L / 10 L / 25 L" for
    every product) that didn't match what's actually on your price list.
  - The founder's message (Our Story) was restored in full — the pack's
    version had only a single placeholder line waiting for a message to be
    supplied. The new monogram treatment (M·A·Z) is kept as a tasteful stand-in
    for the still-missing founder photo, replacing the old plain media box.

## What changed in the FINAL Master Fix List + Pictures & Icons Manifest pass

- **Real pricing added throughout Chemicals & Minerals** — every catalogue
  card and every one of the 12 product pages now shows real PKR pricing by
  pack size (e.g. KLASSeC: 1.2L PET Rs 200, 5L PE Rs 950, 5L PET Rs 900), live
  total that updates as you change quantity/pack. `Filters / Caps & Fittings`
  has no given price, so it shows "Price on inquiry."
- **Article: real pricing, real lab data, real delivery areas.** Rs 110 per
  19L refill, a one-time Rs 1,100 refundable bottle deposit, weekly delivery —
  shown as a clear pricing panel with a worked example. The "Lab Reports &
  Certifications" section now shows your actual Reverse Osmosis Plant
  Association test results (Total Colony Count, Coliforms, TDS, pH, Chief
  Chemist) instead of a placeholder image, with honest wording that PSQCA
  registration is in process (not "certified," since the license hasn't
  issued yet). The area dropdown uses your real delivery list.
- **Our Story: your actual founder's message**, in full, replacing the
  placeholder line. Founder photo is still a monogram placeholder — see
  "What I did not do" below for why.
- **Real client names** on Home's client marquee and Our Story — see
  "cinematic pass" above for the real logo images added since, and "What I
  did not do" for the two that are still text-only.
- **The SaT PaK Pipeline CRM** — see above.
- Reconfirmed everything from the prior pass still holds: canonical domain,
  final product naming, the cart → WhatsApp checkout, the floating contact
  button, SMC/SECP lines, zero visitor-facing dev-notes
  (including two more I found and fixed on Privacy/Terms), and the em-dash /
  AI-feel copy cleanup — plus the exact Trusted-By and Home Care line swaps
  from this final doc.
- Fixed a real bug: on the Chemicals catalogue page specifically, "Add to
  Cart" buttons were markup-nested outside the controls the cart JS looks
  inside, so clicking them silently did nothing. Verified fixed with an
  automated cart test.
- Fixed anchor links landing with their heading hidden behind the sticky
  header site-wide (`scroll-margin-top`).

## What I did not do, and why

- **Still no photo of Muhammad Ali Bin Zaki.** Real plant photography and
  real client logos have since been supplied and are now live (see
  "cinematic pass" above), but no founder photo has been provided. Generating
  a fake AI face and presenting it as a real, named person would be a
  fabricated photo of someone real — I don't do that regardless of how the
  placeholder is labeled. His actual message is in full on the site; the
  photo slot uses a tasteful monogram (M·A·Z) stand-in until a real photo
  is sent.
- **Client logos are now real images where supplied, honest wordmarks where
  not.** 11 real client logo files arrived with the cinematic pack and are
  live in Home's client marquee. Two entries (Pakistan Armed Forces, MAP)
  still have no logo file, so they remain plain text tiles rather than
  invented marks — same principle as before, just resolved for everyone a
  real file exists for.
- **No fully automated form → CRM → team-notification pipeline.** That
  needs a real backend with hosting and API keys (Section D of the fix list
  says this explicitly). What's live: forms → Web3Forms (once you add a
  free key) for real email delivery, plus the CRM as a separate tool for
  tracking what happens next. Bridging the two automatically is a scoped,
  buildable follow-up, not something I can stand up here.

## Outstanding items before launch

- **Real logo files** — resolved. `satpak-mark.png` / `satpak-logo.png` are
  now wired into header, footer and every page's favicon.
- **Real plant/client photography** — resolved. See "cinematic pass" above.
- **Product naming — final packaging check**: BIOX / PUREX / Tank Wash and
  all pricing are per the fix list's final catalogue and price table.
  Confirm both match what's actually printed on your bottles before launch.
- **Testimonials**: the "What Our Clients Say" section on Home still uses
  the fix list's draft quotes with placeholder attribution (`Client name,
  sector`) — explicitly marked in the doc as drafts to approve/edit first.
  Don't publish as-is; swap in named, permission-cleared quotes.
- **Exact milestone years** — Our Story's timeline shows decade ranges
  (e.g. "1990s – 2000s") since no exact years were given. Send them if
  you'd like the timeline sharper.
- **Health & Wellness** — shown with soft, non-therapeutic language only,
  per the license-gate note. Have this page reviewed by whoever handles your
  regulatory/medical sign-off before it goes live.
- **Company Profile PDF** — buttons link to `/company-profile.pdf`; add that
  file to the site root once ready.
- **Real photography** — see "What I did not do" above.

## Forms & integrations

Every form (`data-satpak-form`) validates required fields, shows a success
message with a generated reference number (e.g. `TECH-260909-4821`), and
**now POSTs to [Web3Forms](https://web3forms.com)** — a free service that
delivers submissions straight to your inbox with built-in spam protection and
needs no server of your own. To turn it on:

1. Get a free access key at web3forms.com (takes under a minute, no card).
2. Open `assets/js/main.js`, find `WEB3FORMS_ACCESS_KEY = "YOUR-WEB3FORMS-ACCESS-KEY"`
   near the top of the form-handling block, and paste your real key in.
3. That's it — every form on every page starts delivering by email
   immediately, tagged with which department it came from and its reference
   number. Until you do this, forms still show a normal success message
   locally (nothing looks broken to a visitor), they just don't email anyone yet.
4. When a Web3Forms email arrives, log it in the SaT PaK Pipeline CRM
   (link above) with "+ Add Lead" so your team can track it through the
   sales stages.

The **builder form**'s file upload (`#builder input[type=file]`) is included
in the Web3Forms submission automatically once your access key is set — the
free plan has a small attachment size limit, so check web3forms.com's current
limits for large drawing/BOQ files.

**Consultation booking:** the brief recommends Calendly. There's an HTML
comment above the consultation form in `contact.html` marking exactly where
to paste your Calendly embed `<div>`/`<script>` once you have an account —
until then, the form itself handles booking requests.

**Map:** the Contact page embeds a **live Google Map** via a plain iframe,
pointed at the real "SaT PaK RO Plant Manufacturer & Maintenance" Google
Maps place listing (G-1 Samana Pride, Gulshan-e-Iqbal, Karachi), with a "Get
directions" link. No API key required, nothing to configure.

**WhatsApp:** fully wired — the contact FAB, mobile CTA bar, cart checkout,
and every "WhatsApp" button deep-link to `wa.me/923181112606` (or
`923218718722` for Article), with context-aware prefilled messages.

**Analytics:** no GA4/GTM/Meta Pixel snippet is included. Add your real
tracking snippet to each page's `<head>` (or better, inject it from
`partials/header.html` once, like the rest of the shared markup) once you
have real IDs. Conversion events worth wiring once GTM is live: WhatsApp
clicks, phone clicks, quote requests, consultation bookings, product
inquiries, cart checkouts, PDF downloads.

## Design system

Heritage Teal `#0E4D45` / Ivory `#FAF7F1` / Charcoal `#1E1E1E` / Heritage
Dark `#0C2B28` / Brass `#9A7B3F`; Fraunces (display serif, headings/heritage)
+ Inter (body/UI), both loaded from Google Fonts; rounded buttons (teal fill
/ teal outline / brass text-link); rounded cards with a thin border; thin
line-art icons only; a scroll-choreography layer (`assets/js/motion.js` +
`assets/css/cinematic.css`) drives reveals, parallax, pinned film heroes and
the horizontal "water line" process strip, with a 2.5s safety-net timeout in
`assets/js/include.js` so content never stays invisible if a script fails,
and a full static fallback (incl. `prefers-reduced-motion`) so nothing
depends on JavaScript to be readable.
The CRM (SaT PaK Pipeline) reuses the same palette and type pair, plus five
stage colors (slate/amber/violet/green/terracotta) kept separate from the
brand accent so lead status reads at a glance.

## What's functional right now, client-side only

- Sticky, condensing header with cart + search icons; full-screen mobile menu.
- 7-page primary nav + Our Story/legal in the footer (no "Solutions" dropdown).
- Chemicals & Minerals catalogue with real pricing, filtering, 12 full product pages.
- Cart with quantities, pack sizes and live pricing, shared across Chemicals,
  Health & Wellness and Home Care, checking out straight to a prefilled WhatsApp message.
- Animated stat counters and a horizontal, scroll-pinned "water line" process
  strip with an animated flow path, both scroll-triggered.
- Full-bleed video heroes with parallax plant photography, a cursor-following
  department preview panel, and an auto-scrolling client logo marquee.
- Article's live bill estimator (bottles/week slider → monthly bill + deposit).
- Segmented, icon-led enquiry chooser on Contact showing one form at a time.
- Article subscribe form with real pricing, a working geolocation "Detect My
  Location" button, and real lab-report data.
- Live Google Map embed on Contact (no API key).
- All forms produce a reference number on submit, and email you directly once
  a Web3Forms key is added (see "Forms & integrations").
- A live, shared CRM board (separate artifact — see above) for tracking leads
  through stages with notes and assignment.
- Cookie consent bar (`localStorage`-based, doesn't block the site).
- Mobile-first responsive layout, a collapsible contact FAB (WhatsApp / Call /
  Instagram / Facebook) on every page, tap-to-call links.

## Accessibility & performance

Semantic headings, alt text/captions on every media placeholder, visible
focus states, keyboard-usable menus and forms, large readable base type,
`scroll-margin-top` on every anchor target so in-page links don't land
underneath the sticky header. No external JS framework — total payload is
small; only Google Fonts and the Google Maps embed are network dependencies.
