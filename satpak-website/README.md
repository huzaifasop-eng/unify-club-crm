# SaT PaK — Website (satpak-website/)

A multi-page, "quiet industrial luxury" corporate website for **Shaikh al Tijarat
Pakistan (SaT PaK)**, built from the brief documents supplied (Requirements,
Sitemap & Architecture, Website Copy, Branding & Identity Spec, Technical Launch
Spec, and the Website Master Fix List v1). It is a **static, dependency-free
HTML/CSS/JS site** — no build step, no database, no framework — so it can be
uploaded to any host and be live immediately.

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
   theme with custom post types for products — all copy, structure and visual
   spec are already finalized here, which is most of the work.

## Structure

```
satpak-website/
  index.html                       Home
  ro-plants-services.html          RO Plants & Services
  chemicals-minerals.html          Chemicals & Minerals (catalogue, filters, cart)
  product-klassec.html … product-filters-fittings.html   12 product detail pages
  article.html                     Article — mineralized drinking water + subscribe
  health-wellness.html             Health & Wellness (category-grouped, license-gated)
  home-care.html                   Home Care (category-grouped)
  contact.html                     Segmented enquiry chooser + forms + live map
  our-story.html                   Our Story & Heritage
  privacy.html / terms.html / cookie-policy.html   Legal drafts (have counsel review)
  404.html
  robots.txt / sitemap.xml
  partials/header.html, partials/footer.html   Shared header, footer, cart panel, float cluster
  assets/css/style.css             Full design system
  assets/js/include.js             Loads header/footer partials + reveal-animation safety net
  assets/js/main.js                All site behaviour (menu, forms, cart, counters, animations)
```

Header and footer live once in `partials/` and are injected into every page via
`fetch()` — edit them there instead of in every HTML file. This only works when
served over HTTP(S) (any real host), not by double-clicking the HTML file locally.

## Deploying (upload & go live)

1. Buy and point **satpak.pk** at your hosting/CDN (chosen as the canonical
   domain across the site — every canonical/OG URL already points here).
2. Upload the entire `satpak-website/` folder contents to the web root (e.g. `public_html/`).
3. Enforce HTTPS (most hosts / Netlify / Vercel / Cloudflare do this automatically).
4. Test locally first if you like: `python3 -m http.server 8000` from inside
   `satpak-website/`, then open `http://localhost:8000/index.html`.

## What changed in this pass (Website Master Fix List v1)

- **Canonical domain** locked to `https://satpak.pk` across every page, `sitemap.xml` and `robots.txt`.
- **Product naming finalized**: KLASSeC · CLARO · NEORA · E LYTE 0-4 · MEDIX ·
  PULSER · BIOX · PUREX · Tank Wash · PVC Jointing Solution · PVC
  Surfacer/Cleaner · Filters/Caps & Fittings — replacing Genesys/Klassic/E-Lyte
  R1–R10/Inner Wash/Outer Wash/Anti-Bacterial everywhere, including a full
  product-detail page per item (`product-klassec.html` … `product-filters-fittings.html`).
- **Cart → WhatsApp checkout**: every product card (Chemicals & Minerals,
  Health & Wellness, Home Care) now has a quantity selector, a pack-size
  picker, and "Add to Cart." A cart icon in the header (with live count) opens
  a slide-in panel to review/edit/remove items and "Checkout on WhatsApp" —
  which opens `wa.me` with a prefilled, formatted order message. State
  persists in `localStorage` across pages.
- **Floating WhatsApp + social cluster**: fixed bottom-right on every page,
  scroll-independent, with Instagram and Facebook stacked above a larger
  WhatsApp button; clears the mobile CTA bar with extra bottom offset.
- **SMC/SECP registration** line added to the footer and Our Story.
- **All leaking dev-notes removed** ("photography pending," "embed a real map
  before launch," the founder license-gate note, etc.) — anything still
  outstanding for you to supply is now in an HTML comment, invisible to visitors.
- **Copy rewrite pass**: the specific Home/RO/Chemicals rewrites from the fix
  list applied verbatim, plus a site-wide sweep removing em-dash-heavy
  sentence construction from body prose (structural uses — citations, label:
  value pairs, technical grade options — were left alone).
- **Animated stat counters** on Home (0 → target, eased, ~2s, triggered on
  scroll into view); "KHI" relabeled "Karachi."
- **RO process steps** now animate on scroll: the connecting line draws
  left-to-right, then each numbered step fades/scales in sequentially.
- **Home**: SadaPay-style department card hover (lift + shadow + arrow
  slide, ~220ms), a new "Sectors We Serve" icon band, and a "What Our
  Clients Say" testimonials section (draft quotes, placeholder attribution —
  see "Outstanding items").
- **Article**: new "Our Water" mineral spec panel, a "Lab Reports &
  Certifications" section, a benefit-icons row, and a full Subscribe form
  (name/phone/email/area/address/bottle count/payment + a working
  "Detect My Location" button using the browser's Geolocation API).
- **Health & Wellness / Home Care**: products regrouped into named categories
  (Hydration, Skin Care, Hair Care, Oral Care, Everyday / Hands, Kitchen,
  Floors & Surfaces, Bathroom, Glass, Pest, Laundry), each a full product card
  with cart controls; Health & Wellness gained a short philosophy intro.
- **Contact**: replaced the plain tab bar with an icon-led segmented chooser
  (Consultation · Technical · Builder · Distributor · Product Quote · Ask SaT
  PaK) that shows only the selected form; the Distributor form gained
  Area/City and "do you already have a shop?" qualifying fields; the map is
  now a **live embedded Google Map** (no API key needed — see below); the
  Product Quote form auto-fills from the cart.
- **Our Story**: milestones rewritten to decade-level ranges (no invented
  exact years) using the fix list's supplied copy; SMC/SECP badge added.
- **Forms**: every form now POSTs to [Web3Forms](https://web3forms.com) when
  you add a free access key (see "Forms & integrations"); until then they
  keep confirming submissions locally so nothing looks broken.

## Outstanding items before launch ([NEED FROM YOU] in the fix list)

- **Real logo files (SVG/AI/EPS)** — header/footer still use an original
  abstract mark (globe + leaf, teal/brass) since no vector file was supplied.
  Swap `partials/header.html` / `partials/footer.html`'s inline
  `<svg class="logo-mark">` and every page's favicon `<link rel="icon">` data-URI.
- **Product naming — final packaging check**: BIOX / PUREX / Tank Wash are
  used per the fix list's final catalogue list, replacing the old "Inner
  Wash / Outer Wash / Anti-Bacterial." Confirm these match what's actually
  printed on your bottles before launch.
- **Client logos + testimonials**: `index.html`'s "Trusted By" still uses
  text placeholders (`Client Name`), and the "What Our Clients Say" section
  uses the fix list's draft quotes with placeholder attribution (`Client
  name, sector`) — do not treat these as real, published quotes. Send the
  real client logos and named, permission-cleared testimonials and swap
  them in (search each file for `Client Name` / `Client name, sector`).
- **Founder section** (`our-story.html`) — photo and personal message are
  intentionally left out (see the HTML comment there); no earlier company
  name is referenced anywhere.
- **Exact milestone years** — Our Story's timeline currently shows decade
  ranges (e.g. "1990s – 2000s"). Send exact founding/milestone years if
  you'd like the timeline sharper.
- **Monthly lab report** — Article's "Lab Reports & Certifications" section
  links to `/lab-reports/latest.pdf`, which doesn't exist yet. Add that file
  (and update the link if you'd rather host reports elsewhere) each time a
  new report is published.
- **Health & Wellness** — shown with soft, non-therapeutic language only,
  per the license-gate note. Have this page reviewed by whoever handles your
  regulatory/medical sign-off before it goes live.
- **Photography** — every image slot is an intentional abstract brand-toned
  placeholder (not a broken image). Replace `.media` blocks and product
  thumbnails with real photography (facility shots, plant installs, product
  packaging, archival/founder images) before launch.
- **Company Profile PDF** — buttons link to `/company-profile.pdf`; add that
  file to the site root once ready.

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

For the fuller requirement in the brief (department-routed inbox aliases +
CRM entry + auto-acknowledgement + staff alert), you can either use Web3Forms'
"Auto Response" + "Custom Redirect/Webhook" features, or point the same forms
at a small serverless function later — no HTML changes needed either way.

The **builder form**'s file upload (`#builder input[type=file]`) is included
in the Web3Forms submission automatically once your access key is set — the
free plan has a small attachment size limit, so check web3forms.com's current
limits for large drawing/BOQ files.

**Consultation booking:** the brief recommends Calendly. There's an HTML
comment above the consultation form in `contact.html` marking exactly where
to paste your Calendly embed `<div>`/`<script>` once you have an account —
until then, the form itself handles booking requests.

**Map:** the Contact page embeds a **live Google Map** via a plain iframe
(`https://www.google.com/maps?q=...&output=embed`) — no API key required,
already pointed at G-1 Samana Pride, Gulshan-e-Iqbal, Karachi. Nothing to configure.

**WhatsApp:** fully wired — floating cluster, mobile CTA bar, cart checkout,
and every "WhatsApp" button deep-link to `wa.me/923181112606` (or
`923218718722` for Article), with context-aware prefilled messages.

**Analytics:** GA4, GTM, Meta Pixel and LinkedIn Insight Tag are stubbed as
commented-out blocks in `index.html`'s `<head>` (copy the pattern into every
page) — add your real IDs and uncomment. Conversion events worth wiring once
GTM is live: WhatsApp clicks, phone clicks, quote requests, consultation
bookings, product inquiries, cart checkouts, PDF downloads.

## Design system

Heritage Teal `#0E4D45` / Ivory `#FAF7F1` / Charcoal `#1E1E1E` / Heritage
Dark `#0C2B28` / Brass `#9A7B3F`; Fraunces (display serif, headings/heritage)
+ Inter (body/UI), both loaded from Google Fonts; rounded buttons (teal fill
/ teal outline / brass text-link); rounded cards with a thin border; thin
line-art icons only; subtle fade/rise-on-scroll animation (`[data-reveal]`,
IntersectionObserver-driven, with a 2.5s safety-net timeout in
`assets/js/include.js` so content never stays invisible if a script fails).

## What's functional right now, client-side only

- Sticky, condensing header with cart + search icons; full-screen mobile menu.
- 7-page primary nav + Our Story/legal in the footer (no "Solutions" dropdown).
- Chemicals & Minerals catalogue filtering by category, 12 full product pages.
- Cart with quantities and pack sizes, shared across Chemicals, Health &
  Wellness and Home Care, checking out straight to a prefilled WhatsApp message.
- Animated stat counters and RO process-step animation, both scroll-triggered.
- Segmented, icon-led enquiry chooser on Contact showing one form at a time.
- Article subscribe form with a working geolocation "Detect My Location" button.
- Live Google Map embed on Contact (no API key).
- All forms produce a reference number on submit, and email you directly once
  a Web3Forms key is added (see "Forms & integrations").
- Cookie consent bar (`localStorage`-based, doesn't block the site).
- Mobile-first responsive layout, persistent mobile CTA bar (WhatsApp / Call /
  Consult), tap-to-call links.

## Accessibility & performance

Semantic headings, alt text/captions on every media placeholder, visible
focus states, keyboard-usable menus and forms, large readable base type,
`scroll-margin-top` on every anchor target so in-page links don't land
underneath the sticky header. No external JS framework — total payload is
small; only Google Fonts and the Google Maps embed are network dependencies.
