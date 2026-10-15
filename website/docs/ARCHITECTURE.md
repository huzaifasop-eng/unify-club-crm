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
Backend: None
Database: None
Authentication: None (public site, no accounts)
Storage: None (no file uploads)
Hosting: Host-agnostic by design — `netlify.toml` and `vercel.json` are included for one-click deploys to those two, but the output is a plain static folder that also works on any shared host.
Payments: None (donations are bank-transfer instructions only — see PRD.md §12)
Email: None wired up (forms do not send email — see SECURITY.md)
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

### `assets/js/main.js`
Responsibilities (all vanilla, no dependencies):
- Mobile nav toggle + dropdown tap-to-expand.
- Active-nav-link detection by comparing `location.pathname` to each link's `data-page`.
- IntersectionObserver-driven scroll reveals (`[data-reveal]`) and animated stat counters (`[data-count]`), with graceful no-op fallback if `IntersectionObserver` is unsupported.
- FAQ accordion expand/collapse.
- Demo form submit handlers (`[data-demo-form]`) — prevents default, shows `.form-success`, resets the form. **Does not send data anywhere** (see SECURITY.md).
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
   │        ├─▶ GET /assets/js/main.js
   │        ├─▶ GET https://fonts.googleapis.com/... (Google Fonts, third party)
   │        └─▶ GET https://www.google.com/maps?...&output=embed (on Contact/Locations)
   │
   └─▶ Form submit (Contact / Book a Trial / Volunteer)
            └─▶ handled entirely client-side by main.js — no network request is made
```

There is no application server, no API, and no database in this product's request path. Every "backend" word in this document set (SECURITY.md, DATABASE.md) describes what would need to be **added** if a real form pipeline is built — it does not describe anything that exists today.

## 6. Data Flow

1. Visitor requests a page → static host returns the `.html` file unmodified.
2. Browser parses HTML, fetches `style.css`, `main.js`, Google Fonts, and (on Contact/Locations) the Maps iframe.
3. `main.js` runs on `DOMContentLoaded`: wires up nav, reveals, counters, accordions, lightbox, and form handlers.
4. If the visitor submits a form, `main.js` intercepts the submit event, shows a local success message, and resets the form. No request leaves the browser. (This is the single biggest functional gap in the product — tracked in PRD.md §12 and SECURITY.md.)

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
    css/style.css       All design tokens + components
    js/main.js          All site behavior
    img/                (currently empty — no raster assets are used; all visuals are CSS gradients + inline SVG)
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

Decision: No real images — hero/gallery/success-story visuals are CSS-gradient tiles with an inline SVG icon and caption, not photographs.
Context: This environment cannot fetch external images reliably to verify they load (outbound network is blocked for the agent, though not for end users), and no real photography was supplied by the client.
Alternatives: Hotlink stock photography from an external CDN.
Reason: Rejected — an unverifiable hotlinked image risks shipping a broken `<img>` with no way to catch it before the client sees it live. Illustrated gradient tiles are a deliberate, reliable placeholder, clearly swappable for real photography later (see PRD.md Open Questions).

## 10. Performance Considerations

- Zero JS dependencies and a single ~27KB CSS file keep first paint fast on any connection.
- All icons are inline SVG (no icon-font request, no extra round trip).
- Google Fonts is the only render-blocking external request; `rel="preconnect"` hints are set for both font origins to shave connection setup time.
- No images are loaded today, so there are currently no image-optimization concerns — revisit this once real photography is added (use modern formats + explicit width/height to avoid layout shift).

## 11. Scalability Considerations

- A static site scales trivially — it's just files behind a CDN/host; no app server capacity to plan for.
- The real scaling question is content ops: 13 hand-duplicated HTML files is manageable; if the page count grows much further, revisit the "no build step" decision in §9 (e.g., introduce a lightweight templating step) rather than keep hand-syncing more files.

## 12. Failure Scenarios

What happens if:
- **Google Fonts is blocked/unreachable** (ad blocker, restrictive network, or — as in this dev sandbox — a proxy policy)? Headings/body text fall back to the `ui-sans-serif, system-ui, sans-serif` stack declared in the CSS. Layout does not break.
- **Google Maps iframe is blocked**? The iframe renders empty/blank inside its rounded container; the rest of the Locations/Contact page is unaffected. No JS depends on the map loading.
- **JavaScript fails to load or is disabled**? Scroll-reveal content is forced visible via a `<noscript>` override (see DESIGN_SYSTEM.md §15); nav still works via plain anchor links; forms fall back to native browser submit behavior (which, since there's no `action`/`method` set, will reload the current page — **open item**: decide what should actually happen here once a real backend exists, e.g. a `mailto:` fallback).
- **A visitor submits the Contact, Book a Trial, or Volunteer form**? Nothing is sent anywhere. A success message appears locally and the form resets. This is a known, documented gap (see PRD.md §12, SECURITY.md) — the client should be made aware before relying on any of these forms operationally.
