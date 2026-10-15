# Architecture

## 1. System Overview

The Unify Club public website is a static, multi-page HTML/CSS/vanilla-JS site with **no build step, no framework, and no backend**. Every page is a standalone `.html` file that shares a common header (icon sprite + nav), footer, and two asset files (`assets/css/style.css`, `assets/js/main.js`). It lives in `website/` at the repo root, fully separate from the internal ERP/CRM product (`apps/web`, `apps/api`) that occupies the rest of this repository.

## 2. Architecture Pattern

Pattern: Static multi-page site (no SSG/SSR framework).
Reason: Three deciding factors, in order:
1. **Deployability constraint** — the client's explicit requirement was "so I can live the website on my hosting," with no stated hosting provider. Plain HTML/CSS/JS deploys unmodified to literally any static host (shared hosting/cPanel via FTP, Netlify, Vercel, GitHub Pages) with zero configuration, build tooling, or Node runtime required on the host.
2. **Isolation from the CRM app** — `apps/web` is a Next.js app whose root route (`app/page.tsx`) already redirects every visitor to `/login` or `/dashboard`; it's an authenticated internal tool. Bolting a public marketing site onto it would mean fighting that redirect, the shared `ThemeProvider`/`QueryProvider`/Tailwind design tokens built for the CRM, and risking breaking the CRM's existing deploy (Vercel + Railway, documented in the repo's root `DEPLOY.md`). Keeping them as two independent folders means a change to one can never break the other.
3. **No server-rendered content needed** — nothing on this site is per-user or dynamic; a framework's main value (routing, data fetching, SSR) buys nothing here.

Trade-off accepted: shared markup (icon sprite, nav, footer) is **duplicated** in all 13 HTML files rather than templated, because there is no build step to assemble includes at request time. See §7 and CODE_STYLE.md for how that's managed safely.

## 3. Technology Stack

Frontend: Plain HTML5, CSS3 (custom properties, Grid, Flexbox), vanilla ES6 JavaScript (no bundler, no npm dependency)
Backend: Not part of this product — but the three lead-capture forms now call the separate CRM's NestJS API (`apps/api`) for real, via a public, unauthenticated endpoint. See §9's "Key Technical Decision" on why this integration exists without collapsing the two products into one.
Database: None of the website's own — form submissions land in the CRM's existing Postgres/Prisma database via its API. See DATABASE.md §0.
Authentication: None (public site, no accounts; the API endpoints it calls are deliberately unauthenticated too — see SECURITY.md §5)
Storage: None (no file uploads)
Hosting: Host-agnostic by design — `netlify.toml` and `vercel.json` are included for one-click deploys to those two, but the output is a plain static folder that also works on any shared host.
Payments: None (donations are bank-transfer instructions only — see PRD.md §12)
Email: None wired up (lead submissions reach staff through the CRM's existing Leads module UI, not email — see SECURITY.md)
Analytics: None installed
Other Services: Google Fonts (`fonts.googleapis.com`, via `<link>`), Google Maps embed (`google.com/maps?...&output=embed` iframe, no API key required) — both are third-party requests made by the **visitor's** browser at runtime, not by any build process.

## 4. System Components

### Shared head/nav shell (every page)
Responsibilities:
- Inline SVG `<symbol>` icon sprite (duplicated per page, not fetched).
- Skip link, sticky glassmorphic `<header class="nav">` with logo, dropdown-capable primary nav, and a "Book a Trial" CTA.
- `<main id="main">` wrapper that each page's unique content lives inside.

### Shared footer (every page)
Responsibilities: Brand blurb, three link columns (Explore / Get Involved / Visit & Contact), newsletter input (non-functional — no backend), social icon links (placeholder `#` hrefs), copyright line with JS-populated year.

### `assets/css/style.css`
Responsibilities: All design tokens (CSS custom properties — see DESIGN_SYSTEM.md) and every component class used across all 13 pages. Single file, no splitting, since there's no build step to code-split or purge unused CSS.

### `assets/js/config.js`
Responsibilities: The single place deployment configures `window.UNIFY_API_BASE_URL`, the CRM API's base URL. Ships empty by default so forms honestly report "not connected yet" rather than silently failing — see SECURITY.md §8.

### `assets/js/i18n.js`
Responsibilities: The English/Urdu dictionary (`window.UNIFY_I18N`) consumed by `main.js`'s language toggle. Coverage today is the shared nav/footer plus the full Home page — see DESIGN_SYSTEM.md §16 and the file's own header comment for how to extend it.

### `assets/js/main.js`
Responsibilities (all vanilla, no dependencies):
- Dark/light theme toggle (`[data-theme-toggle]`) and English/Urdu toggle (`[data-lang-toggle]`), both persisted to `localStorage`; the initial theme is set by a tiny inline script in `<head>` (before CSS loads) to avoid a flash of the wrong theme.
- Mobile nav toggle + dropdown tap-to-expand.
- Active-nav-link detection by comparing `location.pathname` to each link's `data-page`.
- IntersectionObserver-driven scroll reveals (`[data-reveal]`) and animated stat counters (`[data-count]`), with graceful no-op fallback if `IntersectionObserver` is unsupported.
- FAQ accordion expand/collapse.
- Lead form submit handlers (`[data-lead-form]`) — POSTs to the CRM API's public Leads endpoint and renders a 3-step tracker from the real response, or an honest error state on failure. **Does send real data now** (see SECURITY.md §8 — this replaced the old no-op "demo form" behavior).
- Status-lookup widget (`[data-status-form]`) — lets a returning visitor re-check a saved reference code's status.
- Gallery lightbox open/close.
- Simple testimonial slide show/hide.
- Footer year.

### `website/docs/` (this folder)
Responsibilities: The eight planning/reference documents described in this blueprint, scoped specifically to the public website (not the whole repo). See AGENTS.md §2 for why this is scoped here rather than at the repo root.

## 5. Architecture Diagram

```
Visitor's browser
   │
   ├─▶ GET /index.html (or any of the 13 pages) ──▶ static file, served as-is
   │        │
   │        ├─▶ GET /assets/css/style.css
   │        ├─▶ GET /assets/js/{config,i18n,main}.js
   │        ├─▶ GET https://fonts.googleapis.com/... (Google Fonts, third party)
   │        └─▶ GET https://www.google.com/maps?...&output=embed (on Contact/Locations)
   │
   └─▶ Form submit (Contact / Book a Trial / Volunteer)
            └─▶ POST {UNIFY_API_BASE_URL}/public/leads  ──▶  apps/api (NestJS)
                     │                                          │
                     │◀── { id, step, stepLabel } ───────────── PublicLeadsService
                     │                                          │ creates Lead + LeadActivity
                     ▼                                          ▼
            renders a 3-step tracker                     Postgres (same DB the CRM uses)
            (assets/js/main.js renderTracker)

       Returning visitor can also:
       GET {UNIFY_API_BASE_URL}/public/leads/:id/status  ──▶  same tracker, live status
```

**Updated:** the static-site-with-no-backend description below this diagram in earlier revisions of this document is no longer accurate for the three lead-capture forms — see SECURITY.md §5/§8 and DATABASE.md §0 for the full implementation. Everything else about this product (no accounts, no database of its own, no build step) is unchanged: the website is a pure static client of the CRM's API, not a backend itself.

## 6. Data Flow

1. Visitor requests a page → static host returns the `.html` file unmodified.
2. Browser parses HTML, fetches `style.css`, `config.js`, `i18n.js`, `main.js`, Google Fonts, and (on Contact/Locations) the Maps iframe.
3. `main.js` runs on `DOMContentLoaded`: wires up nav, dark/light and EN/UR toggles, reveals, counters, accordions, lightbox, and form handlers.
4. If the visitor submits the Contact, Book a Trial, or Volunteer form, `main.js` POSTs to `${UNIFY_API_BASE_URL}/public/leads` (see `assets/js/config.js` — this must be set to the CRM API's real deployed URL before forms work). On success, the form is hidden and replaced with a 3-step progress tracker reflecting the lead's real stage; the reference ID is saved to `localStorage` so the visitor can check back later via the status-lookup widget on `contact.html`. On any network/API failure, the form stays visible and a clear error message with phone/email fallback is shown — it never silently pretends to succeed. See SECURITY.md §8 for the endpoint contract.

## 7. Project Structure

```
website/
  index.html            Home
  about.html            About / Our Story
  team.html             Team & Board
  programs.html         Programs (3 anchored sections)
  success-stories.html  Success Stories
  get-involved.html     Get Involved (Donate / Volunteer)
  events.html           Events & Activities
  news.html             News & Stories
  gallery.html          Gallery (illustrated tiles + lightbox)
  locations.html        Locations (map embed)
  contact.html          Contact (form + FAQ teaser)
  faqs.html             Full FAQs
  book.html             Book a Trial (primary conversion form)
  404.html              Branded not-found page
  robots.txt            Allow-all + sitemap reference
  sitemap.xml           All 13 public URLs
  netlify.toml          Zero-config Netlify deploy (publish ".", 404 redirect)
  vercel.json            Zero-config Vercel deploy
  docs/                 This document set
  assets/
    css/style.css       All design tokens + components (incl. dark theme)
    js/config.js        Deployment config (CRM API base URL)
    js/i18n.js           English/Urdu dictionary
    js/main.js          All site behavior
    img/                21 real JPEGs from the Pechs branch (hero collage, About, Gallery, Success Stories, Programs, Locations, News, Events — see §9 "Real photography") + 4 video poster frames
    video/              4 short muted looping video clips, .mp4 + .webm each (see DESIGN_SYSTEM.md §20)
```

## 8. Dependency Rules

- No page may reference a file outside `website/` (the site must remain copy-pasteable to any host root as-is).
- No new JavaScript dependency (npm package, CDN library) may be added without updating this document — the zero-dependency property is a deliberate, stated requirement, not an oversight.
- Any new external request (font, map, image CDN, analytics) must be added to ARCHITECTURE.md §3 and SECURITY.md §Third-Party Requests so the client knows what's calling out from their site.
- Shared markup (sprite/nav/footer) must stay byte-identical across all 13 pages. See CODE_STYLE.md §3 for the regeneration workflow that keeps this true without copy-paste drift.

## 9. Key Technical Decisions

Decision: Keep the public website and the internal ERP/CRM as two completely separate codebases-in-one-repo (`website/` vs. `apps/web`+`apps/api`), rather than adding public routes to the Next.js app.
Context: `apps/web`'s root page already hard-redirects every visitor to `/login` or `/dashboard`; it has no public route group, and its design system (Tailwind + shadcn-style tokens) was built for an internal dashboard, not a donor-facing marketing site.
Alternatives: (a) add a `(marketing)` route group to `apps/web`; (b) build the marketing site as its own Next.js app in a new `apps/` folder.
Reason this approach: (a) risked breaking the CRM's existing auth redirect and deploy config for no benefit; (b) added a Node build/runtime requirement the client never asked for and that contradicts "so I can live the website on my hosting" (implying simple static hosting). Plain static HTML in `website/` satisfies the actual requirement with the least risk and the most hosting flexibility.

Decision: Duplicate the nav/footer/icon-sprite shell in every HTML file instead of using includes or a static-site generator.
Context: No build step exists by design (see above). Browser-native includes (`<iframe>`, server-side includes) either don't work for navigation chrome or require server configuration the client's unknown host may not support.
Alternatives: Add a minimal build step (e.g., a tiny Node script or Eleventy) purely for templating.
Reason: Rejected for now to keep the "zero build step, upload as-is" property, which was explicitly valuable to the client. The duplication is made safe by a documented regeneration workflow (CODE_STYLE.md §3) rather than manual per-file editing whenever the shell changes.

Decision (superseded, kept for history): No real images — hero/gallery/success-story visuals were CSS-gradient tiles with an inline SVG icon and caption, not photographs.
Context: At the time, this environment couldn't fetch external images reliably to verify they load (outbound network is blocked for the agent, though not for end users), and no real photography had been supplied by the client.
Alternatives: Hotlink stock photography from an external CDN.
Reason: Rejected — an unverifiable hotlinked image risks shipping a broken `<img>` with no way to catch it before the client sees it live. Illustrated gradient tiles were a deliberate, reliable placeholder, clearly swappable for real photography later.

**Superseded**: the client connected their Google Drive with real photos from the Pechs branch. Those were downloaded (via the Drive MCP connector, not a hotlink — see §9 note below), curated down to the strongest ~20 action/therapy shots, color-graded for a consistent look with ImageMagick, cropped to each `.photo-tile` slot's aspect ratio, and saved locally into `assets/img/` — so every image is a real local file the build can verify exists, same reliability guarantee as the old gradient tiles, now with real content. The `.photo-tile` CSS gradients/icons remain in place as the loading-state background and as the fallback for any tile that doesn't (yet) have a photo (e.g. if a future page adds one before an image is supplied). See DESIGN_SYSTEM.md §18 for the curation/grading approach.

Decision: Ship video as a local static asset (`assets/video/`, two formats per clip) rather than embedding a third-party player (YouTube/Vimeo iframe) or hotlinking.
Context: The client asked for real video clips from the same Drive source as the photos, cut short and used on a few pages (DESIGN_SYSTEM.md §20).
Alternatives: (a) upload the clips to YouTube/Vimeo unlisted and embed via iframe; (b) hotlink a Drive-hosted video URL directly.
Reason: (a) would add a third-party request/cookie surface and an external dependency for content the client already owns outright, plus an iframe embed doesn't integrate with the site's own `prefers-reduced-motion` handling or dark theme as cleanly as a native `<video>` element; (b) Google Drive file URLs aren't a stable, direct-streamable asset host and risk breaking without warning. A downloaded, locally-hosted, re-encoded clip is the same reliability trade-off already made for photography (§9 above) — a verifiable local file, not a hotlink — extended to video. This keeps the zero-third-party-dependency property (ARCHITECTURE.md §8) intact: no new external request was added.

## 10. Performance Considerations

- Zero JS dependencies and a single ~27KB CSS file keep first paint fast on any connection.
- All icons are inline SVG (no icon-font request, no extra round trip).
- Google Fonts is the only render-blocking external request; `rel="preconnect"` hints are set for both font origins to shave connection setup time.
- `assets/img/` now holds 21 real JPEGs (hero collage, About, Gallery, Success Stories, Programs, Locations, News, Events) plus 4 video poster frames, each cropped to one of three fixed aspect ratios (1:1, 16:10, 4:5) per its `.photo-tile` slot and compressed to roughly 150–450KB (quality 82, max 1200px on the long edge) — no single file exceeds ~450KB, so the heaviest page (Gallery, 13 photos + 2 videos) is still a few MB total, reasonable for a static site with no image CDN. `loading="lazy"` is set on every tile image except the hero's first (`loading="eager"`, since it's above the fold). Revisit true next-gen formats (AVIF/WebP with a JPEG fallback) or an actual CDN only if this becomes a measured problem — not done here, to avoid adding a build step for conditional `<picture>` markup.
- `assets/video/` holds 4 short (6–7s), muted, silent (`-an`) clips in two formats each (webm/VP9 + mp4/H.264 fallback), 7.8MB total for all 4 clips × both formats combined — a given browser only ever downloads one format per clip (whichever `<source>` it supports), so actual per-visitor payload is roughly half that, and no single page embeds more than 2 clips. `autoplay muted loop playsinline` with a `poster` frame avoids a layout shift before the video is ready; `prefers-reduced-motion: reduce` hides the `<video>` via a pure CSS media query, falling back to the static poster `<img>` underneath — no JS required to honor the setting. See DESIGN_SYSTEM.md §20.

## 11. Scalability Considerations

- A static site scales trivially — it's just files behind a CDN/host; no app server capacity to plan for.
- The real scaling question is content ops: 13 hand-duplicated HTML files is manageable; if the page count grows much further, revisit the "no build step" decision in §9 (e.g., introduce a lightweight templating step) rather than keep hand-syncing more files.

## 12. Failure Scenarios

What happens if:
- **Google Fonts is blocked/unreachable** (ad blocker, restrictive network, or — as in this dev sandbox — a proxy policy)? Headings/body text fall back to the `ui-sans-serif, system-ui, sans-serif` stack declared in the CSS. Layout does not break.
- **Google Maps iframe is blocked**? The iframe renders empty/blank inside its rounded container; the rest of the Locations/Contact page is unaffected. No JS depends on the map loading.
- **JavaScript fails to load or is disabled**? Scroll-reveal content is forced visible via a `<noscript>` override (see DESIGN_SYSTEM.md §15); nav still works via plain anchor links; forms fall back to native browser submit behavior (which, since there's no `action`/`method` set, will reload the current page — **open item**: decide what should actually happen here once a real backend exists, e.g. a `mailto:` fallback).
- **A visitor submits the Contact, Book a Trial, or Volunteer form**? It POSTs to the CRM's API and creates a real `Lead` (see §6, DATABASE.md §0). If `UNIFY_API_BASE_URL` isn't configured yet, or the API is unreachable, or it returns an error — the form stays visible (never hidden/reset) and a clear error message with a phone/email fallback is shown. The one remaining real gap: the website isn't deployed yet, so `config.js` still ships with an empty `UNIFY_API_BASE_URL` — every submission will show that fallback error until someone sets it. See SECURITY.md §8.
