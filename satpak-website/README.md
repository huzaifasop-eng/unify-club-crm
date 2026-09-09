# SaT PaK — Website (satpak-website/)

A multi-page, "quiet industrial luxury" corporate website for **Shaikh al Tijarat
Pakistan (SaT PaK)**, built from the five brief documents supplied (Requirements,
Sitemap & Architecture, Website Copy, Branding & Identity Spec, Technical Launch
Spec). It is a **static, dependency-free HTML/CSS/JS site** — no build step, no
database, no framework — so it can be uploaded to any host and be live immediately.

> **Note on scope:** this was built inside the `unify-club-crm` repository as a
> self-contained folder (`satpak-website/`), separate from that repo's own
> Next.js/NestJS app — the two projects are unrelated. Treat this folder as an
> independent deliverable; it does not touch or depend on anything else in the repo.

## Why static instead of WordPress

Doc 07 recommends WordPress for staff-editability. Building and hosting a live
WordPress install isn't something this environment can do (it needs real hosting,
a database, and credentials). A static site directly satisfies "ready to upload
and live" — drop the folder onto any host via FTP/cPanel/Netlify/Vercel/S3 and
it works with zero server setup, and it's faster than a typical WordPress+plugin
stack (matches the "expensive but fast" performance directive in the brief).

**Trade-off:** non-technical staff cannot edit content without a developer, unlike
a CMS. Two ways forward:
1. Keep it static — a developer edits the HTML files directly (each page is
   self-contained, well-commented, and the design system lives in one CSS file).
2. Use this site as the design/content reference and rebuild it as a WordPress
   theme with custom post types for products — all copy, structure and visual
   spec are already finalized here, which is most of the work.

## Structure

```
satpak-website/
  index.html                 Home
  ro-plants-services.html    RO Plants & Services
  chemicals-minerals.html    Chemicals & Minerals (catalogue + filters + inquiry basket)
  product-genesys.html       Product-detail page template (replicate per product)
  article.html               Article — mineralized drinking water
  health-wellness.html       Health & Wellness (license-gated, no therapeutic claims)
  home-care.html             Home Care
  contact.html                Consultation / technical / builder / chemicals / Ask SaT PaK forms
  our-story.html              Our Story & Heritage
  privacy.html / terms.html / cookie-policy.html   Legal drafts (have counsel review)
  404.html
  robots.txt / sitemap.xml
  partials/header.html, partials/footer.html   Shared header & footer (fetched into every page)
  assets/css/style.css        Full design system
  assets/js/include.js        Loads header/footer partials
  assets/js/main.js           All site behaviour (menu, forms, filters, basket, reveal animation)
```

Header and footer live once in `partials/` and are injected into every page via
`fetch()` — edit them there instead of in every HTML file. This only works when
served over HTTP(S) (any real host), not by double-clicking the HTML file locally.

## Deploying (upload & go live)

1. Point your domain's DNS at your hosting/CDN.
2. Upload the entire `satpak-website/` folder contents to the web root (e.g. `public_html/`).
3. Enforce HTTPS (most hosts / Netlify / Vercel / Cloudflare do this automatically).
4. Update every `https://www.satpak.com/...` canonical/OG URL in the `<head>` of
   each page (find & replace) once the real domain is confirmed.
5. Test locally first if you like: `python3 -m http.server 8000` from inside
   `satpak-website/`, then open `http://localhost:8000/index.html`.

## Outstanding items before launch (from the brief's [CONFIRM]/[LICENSE-GATE] flags)

- **Domain, hosting, DNS/credential owner** — not yet chosen (Doc 07 §1).
- **Real logo files (SVG/AI/EPS)** — the header/footer currently use an original
  abstract mark (globe + leaf, teal/brass) built from the brand palette, since
  no vector file was provided. Swap `partials/header.html` and
  `partials/footer.html`'s inline `<svg class="logo-mark">` (and the `<link rel="icon">`
  favicon data-URI in every page's `<head>`) for the real vector logo.
- **Product naming** — the brief flagged mismatches across your Data Sheet /
  Company Profile / verbal sources. This build follows **Doc 03 (Website Copy)**
  exactly: Genesys, Claro, Klassic (mineral salts); E-Lyte R1–R10 (membrane
  refresher); Inner Wash, Outer Wash, Anti-Bacterial (washes). Confirm against
  final packaging and find-replace if anything changes.
- **Photography** — every image slot is an intentional abstract brand-toned
  placeholder (not a broken image), each with an HTML comment/caption noting what
  real photo belongs there (facility shots, plant installs, product packaging,
  archival/founder images, client logos). Replace `.media` blocks and the
  `.logo-chip` "Trusted By" placeholders with real assets before launch.
- **Founder section** (`our-story.html`) — photo and message intentionally left
  reserved; no earlier company name is referenced anywhere, per the brief.
- **Health & Wellness** — shown with soft, non-therapeutic language only, per
  the license-gate note. Have this page reviewed by whoever handles your
  regulatory/medical sign-off before it goes live, and tighten wording further
  if needed.
- **Company Profile PDF** — buttons link to `/company-profile.pdf`; add that file
  to the site root once ready.
- **Certifications / lab reports** — not included; add wherever you'd like them
  surfaced (e.g. a credibility strip or Our Story) once supplied.

## Forms & integrations (currently client-side placeholders)

Every form (`data-satpak-form`) validates required fields and shows a success
message with a generated reference number (e.g. `TECH-260909-4821`) — but it does
**not** yet send anywhere. Before launch, wire each `<form>` to a real backend:
- Simplest: a service like Formspree or Netlify Forms (add their `action`/attributes).
- Full requirement per the brief (department-routed inbox aliases + CRM entry +
  auto-acknowledgement email/WhatsApp + staff alert): needs a small backend
  endpoint or automation (e.g. a serverless function, Zapier/Make, or your CRM's
  inbound webhook) that the forms POST to.
- The **builder form**'s file upload (`#builder input[type=file]`) needs a real
  upload target once you pick a backend — file selection works, submission does not
  currently transmit files anywhere.

**Consultation booking:** Doc 07 recommends Calendly. A placeholder note sits
above the consultation form in `contact.html` — replace it with your Calendly
inline embed `<script>`/`<div>` once you have an account.

**WhatsApp:** fully wired — floating button, mobile CTA bar, and every "WhatsApp"
button deep-link to `wa.me/923181112606` (or `923218718722` for Article), with
context-aware prefilled messages, exactly as specified.

**Analytics:** GA4, GTM, Meta Pixel and LinkedIn Insight Tag are stubbed as
commented-out blocks in `index.html`'s `<head>` (copy the pattern into every
page) — add your real IDs and uncomment. Conversion events worth wiring once
GTM is live: WhatsApp clicks, phone clicks, quote requests, consultation
bookings, product inquiries, PDF downloads (the brief's exact list).

## Design system

Implements Doc 05 exactly: Heritage Teal `#0E4D45` / Ivory `#FAF7F1` / Charcoal
`#1E1E1E` / Heritage Dark `#0C2B28` / Brass `#9A7B3F`; Fraunces (display serif,
headings/heritage) + Inter (body/UI), both loaded from Google Fonts; rounded
buttons (teal fill / teal outline / brass text-link); rounded cards with a thin
border; thin line-art icons only; very subtle fade/rise-on-scroll animation
(`[data-reveal]`, IntersectionObserver-driven, degrades gracefully — see
`assets/js/include.js` for the no-JS/slow-network safety fallback).

## What's functional right now, client-side only

- Sticky, condensing header; full-screen mobile menu; header search overlay.
- 7-page primary nav + Our Story/legal in the footer, exactly per Doc 02 (no
  "Solutions" dropdown).
- Chemicals & Minerals catalogue filtering by category (Mineral Salts /
  Treatment Chemicals / Accessories & PVC).
- Multi-product **inquiry basket** (no account needed) — "Add to Inquiry" on
  any product card saves to `localStorage`; the list surfaces on `contact.html`
  and feeds the Chemicals enquiry form.
- All forms produce a reference number on submit (client-side only — see
  "Forms & integrations" above for wiring a real backend).
- Cookie consent bar (`localStorage`-based, doesn't block the site).
- Mobile-first responsive layout, persistent mobile CTA bar (WhatsApp / Call /
  Consult), tap-to-call links.

## Accessibility & performance

Semantic headings, alt text/captions on every media placeholder, visible focus
states, keyboard-usable menus and forms, large readable base type. No external
JS framework — total payload is small; only Google Fonts is a network
dependency (fonts are `display=swap` so text never blocks on them).
