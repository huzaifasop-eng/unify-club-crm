# Design System

## 0. Context note (why this doesn't literally match kdsp.org.pk)

The client asked for a design "more like kdsp.org.pk." That domain is blocked by this environment's network egress policy — confirmed with both the web-fetch tool and raw `curl`, on two separate occasions — so it could never be loaded, screenshotted, or inspected from this session. The client was told this directly and, when asked how to proceed, said to use best judgment. This design system is therefore an original professional-NGO visual language (clean institutional layout, generous whitespace, card-and-grid structure, a trustworthy teal/blue palette) in the spirit of that request, not a traced copy. If the client can later share screenshots or specific pages of kdsp.org.pk, this document should be revised against them.

## 1. Design Direction

Style: Editorial / Premium nonprofit — generous whitespace, soft glassmorphic nav, confident typography, illustrated (not photographic) hero and gallery tiles.
Mood: Hopeful, calm, professional. Warm enough for a children's therapy brand, restrained enough to read as credible to donors.
Design Principles:
- Therapy-first, not clinical: rounded shapes, soft shadows, no harsh edges.
- One brand gradient (teal → blue), used sparingly so it stays premium, not loud.
- Content-led: every page opens with a one-sentence promise (eyebrow + H1 + lead paragraph) before anything else.

## 2. Brand

Brand Name: Unify Club
Logo: No raster logo file supplied. A heart-in-rounded-square mark is used everywhere (inline SVG `#i-heart` on a `--gradient-brand` tile) plus the wordmark "Unify Club" in Plus Jakarta Sans. Replace with a real logo file if/when supplied; keep the rounded-square silhouette for favicon continuity.
Brand Voice: Warm, concrete, never clinical-sounding. Prefers specific claims ("92% avg. progress reported across families") over vague superlatives.

## 3. Color Palette

These are the live values in `assets/css/style.css`. The CSS custom-property names still say `--violet-*` / `--fuchsia-*` / `--orange-*` for historical reasons (the site started violet/fuchsia/orange and was retheme'd to teal/blue on request) — see CODE_STYLE.md §2 for why the names were intentionally **not** renamed.

| Token (CSS var) | Hex | Role |
|---|---|---|
| `--violet-50` | `#f0fdfa` | Tint backgrounds (`.band-tint`, `.surface-tint`) |
| `--violet-100` | `#ccfbf1` | Light borders/hover fills |
| `--violet-500` | `#14b8a6` | Decorative blob accent |
| `--violet-600` | `#0d9488` | **Primary** — buttons, links, icons, nav active state |
| `--violet-700` | `#0f766e` | Primary hover / darker text accents |
| `--violet-900` | `#134e4a` | Deep gradient stop |
| `--fuchsia-500` | `#0ea5e9` | Secondary blue — decorative blob |
| `--fuchsia-600` | `#0284c7` | **Secondary** — gradient end, dropdown/hero blue |
| `--orange-400` | `#fbbf24` | Accent (light) — amber gallery tile, stars |
| `--orange-500` | `#f59e0b` | **Accent** — eyebrow dot, rating stars, amber tile |
| `--ink-950` | `#0f172a` | Headings, primary text |
| `--ink-800` | `#1e293b` | Body text on light accents |
| `--ink-600` | `#475569` | Secondary/paragraph text |
| `--ink-400` | `#94a3b8` | Muted labels, captions |
| `--surface` | `#ffffff` | Page background, card background |
| `--surface-alt` | `#f8fafc` | Alternate section background, input fill |
| `--border` | `#e2e8f0` | Default borders |
| `--success` / `--success-bg` | `#059669` / `#ecfdf5` | Form success state |

Gradients:
- `--gradient-brand`: `linear-gradient(120deg, teal-600, blue-600 120%)` — primary buttons, icon tiles, nav CTA.
- `--gradient-hero`: `linear-gradient(160deg, #042f2e 0%, #0f766e 48%, #0369a1 100%)` — deep teal → teal → blue, used on every page hero.
- `--gradient-accent`: `linear-gradient(135deg, amber-500, amber-400)` — used **only** as a solid monochrome tile (one gallery/photo-tile variant), never blended with teal/blue in the same gradient.

**Rule — do not blend amber into the teal/blue gradient.** An earlier version mixed all three hues in one gradient (`gradient-brand`/`gradient-hero` had an amber stop) and produced a muddy olive band where teal met amber — confirmed visually via headless-browser screenshot, not just by eye. Amber now only appears as a flat/solid color (dots, stars, one gallery tile) or as its own two-stop monochrome gradient (`--gradient-accent`). Keep it that way.

## 4. Typography

Font Family: System stack fallback `ui-sans-serif, system-ui, sans-serif`
Heading Font: `'Plus Jakarta Sans', 'Inter', sans-serif` — loaded from Google Fonts (weights 500/600/700/800)
Body Font: `'Inter', ui-sans-serif, system-ui, sans-serif` — loaded from Google Fonts (weights 400/500/600/700)
H1: `clamp(2.1rem, 4vw, 3.2rem)` (page hero) / `clamp(2.3rem, 5vw, 3.6rem)` (home hero) / weight 700 / line-height 1.15
H2 (section head): `clamp(1.8rem, 3vw, 2.6rem)` / weight 700 / line-height 1.15
H3 (card heading): `~1.2rem` / weight 700
Body: `1rem` base / line-height 1.6 / color `--ink-600`
Small/eyebrow: `12.5px` / weight 600 / uppercase / letter-spacing `.22em`

Note: Google Fonts is loaded via `<link>` in every page `<head>`. In this sandboxed dev environment that request is blocked, so headings render in a fallback sans-serif during local testing — this is an artifact of the sandbox's network policy, not a site bug. Real visitors' browsers will load the fonts normally.

## 5. Spacing

Base Unit: 4px (implicit — values below are the actual scale used throughout, not strictly multiples, chosen per-component for visual rhythm)
Spacing Scale in practice: 4px / 6px / 8px / 9px / 10px / 12px / 14px / 16px / 18px / 20px / 24px / 28px / 32px / 40px / 48px / 56px / 64px / 76–104px (section padding)
Section padding: `.section` = 104px top/bottom (76px ≤900px); `.section--tight` = 72px (56px ≤900px)
Container: max-width 1240px, 24px side padding (18px ≤640px)

## 6. Border Radius

Small: `.6rem` (≈10px) — tags, small chips
Medium: `1.1rem` (≈18px) — inputs, accordion items
Large: `1.75rem` (≈28px) — cards, photo tiles, stat bar
Pill: `999px` — buttons, pills, nav links, avatars

## 7. Shadows

Small: `0 1px 2px rgba(15,23,42,.06)` — default card resting shadow
Medium: `0 12px 32px -12px rgba(15,118,110,.24)` — card hover, brand-icon tiles (teal-tinted)
Large: `0 24px 64px -20px rgba(15,118,110,.28)` — stat bar, nav brand mark
Glow: `0 20px 60px -18px rgba(2,132,199,.35)` — primary button (blue-tinted glow)

## 8. Buttons

Primary Button: `.btn-primary` — `--gradient-brand` background, white text, pill radius, `--shadow-glow`; lifts 2px + scales 1.015 on hover.
Secondary Button: `.btn-dark` (solid `--ink-950`) for on-light CTAs; `.btn-outline` (translucent white border) for on-dark hero CTAs.
Tertiary/Ghost: `.btn-ghost` — `--violet-50` background, `--violet-700` text; used for "see more" links under grids.
Danger Button: Not currently needed (no destructive actions on this public site).
Disabled: Not implemented — no button on this site currently needs a disabled state (forms are client-side demo only; see SECURITY.md).
Loading: Not implemented — same reason as Disabled. **Open item**: once a real form backend exists, add a loading/disabled state to submit buttons so double-submission isn't possible.

## 9. Inputs

Default: `.field input/select/textarea` — 1px `--border`, 12px radius, `--surface-alt` fill, 13px/15px padding.
Focus: `--violet-500` border + `0 0 0 4px var(--violet-100)` ring, background flips to white.
Error: Not implemented — forms currently rely on native HTML5 `required`/`type` validation only; no custom error styling exists yet. **Open item** if a real backend is added with server-side validation.
Disabled: Not implemented (no form field is ever pre-disabled).
Placeholder: Browser default styling; no custom placeholder color set.

## 10. Cards

`.card`: white background, 1px `--border`, `--radius-lg` (28px), 32px padding, `--shadow-sm` resting / `--shadow-md` + 6px lift on hover, 0.4s ease transform.
`.card-icon`: 54×54px, `--radius-md`-ish (16px), `--gradient-brand` fill, white icon, `--shadow-md`.
`.quote-card`, `.person-card`, `.photo-tile` are card variants with the same radius/shadow language.

## 11. Navigation

Header: Sticky, `78px` tall, `rgba(255,255,255,.78)` with `backdrop-filter: blur(18px)` (glassmorphic), 1px bottom border.
Primary nav items: Home, About (dropdown), Programs, Stories, Get Involved (dropdown), News, Gallery, Locations, Contact (dropdown) — grouped into dropdowns because the full 13-page set no longer fits a flat bar (see ARCHITECTURE.md §9 for the decision history).
Dropdown behavior: hover/focus-within reveal on desktop (≥1081px); tap-to-expand accordion on mobile/tablet (≤1080px), implemented in `assets/js/main.js`.
Mobile Navigation: Full-screen slide-down panel below the sticky header, triggered by a hamburger button; the header's standalone "Book a Trial" button is hidden on mobile and replaced by a `.nav-cta-mobile` link appended inside the slide-out panel (both competing for the same ~360px header width caused a real horizontal-overflow bug — fixed, keep this split).

## 12. States

Loading: Only meaningful state currently is the counted-up stat numbers (`data-count`), which animate via `requestAnimationFrame` once in view.
Empty: Not applicable — no page has a dynamic/empty-able list.
Error: Not implemented (see Inputs §9 — no backend to produce real errors yet).
Success: `.form-success` — green `--success-bg` banner with check-circle icon, shown client-side after any `[data-demo-form]` submit (Contact, Book a Trial, Volunteer). This is a **local-only confirmation** — see SECURITY.md and PRD.md Open Questions; it does not mean the data was sent anywhere yet.
Disabled: Not implemented.

## 13. Icons

Icon Library: None (no external icon font/CDN dependency, by design — see ARCHITECTURE.md §3). A hand-authored inline `<svg><symbol>` sprite (~30 icons: heart, menu, close, arrow-right, chevron-down/right, check, check-circle, star, activity, users, target, calendar, map-pin, phone, mail, shield, smile, trending-up, image, facebook, instagram, youtube, quote, clock, sparkles, award, dumbbell, send, gift, handshake, newspaper, help-circle) is duplicated verbatim at the top of every page's `<body>` and referenced via `<use href="#i-name">`.
Default Size: 16–20px inline, 26–30px inside `.card-icon`/`.tile-icon` circles.
Icon Style: Outline, `stroke-width:1.8`, round caps/joins, `currentColor` — a few (star, quote, sparkles, youtube triangle) are filled instead of stroked where that reads better at small size.

## 14. Responsive Design

Mobile: ≤560–640px — single-column grids, stacked hero, full-width buttons where noted.
Tablet: 641–980px — most `grid-3`/`grid-4` collapse to 2 columns; hero split stacks at ≤900–980px.
Desktop: ≥1081px — full multi-column layout, hover-based nav dropdowns.
Breakpoints actually used in the CSS (several, chosen per-component rather than one rigid global set):
- `560px` — stat-bar/footer-grid collapse to 1 column.
- `640px` — `.grid-2/3/4` collapse to 1 column; container side padding drops to 18px.
- `760px` — stat-bar wraps.
- `900px` — `.split` stacks to 1 column.
- `980px` — `.grid-3/4` collapse to 2 columns; hero-grid stacks.
- `1080px` — **nav breakpoint**: mobile hamburger menu takes over, dropdowns become tap-accordions.
Verification method: every page was checked at 360 / 768 / 1100 / 1440px with a headless-Chromium script asserting zero horizontal overflow (`document.documentElement.scrollWidth`) — see TESTING.md.

## 15. Accessibility

- Semantic HTML: `<header>`, `<nav>`, `<main>`, `<footer>`, proper heading order per page.
- Skip link (`.skip-link`) jumps to `#main`, visible on focus.
- Color contrast: body text uses `--ink-600`/`--ink-800` on white/`--surface-alt`, meeting WCAG AA at normal text sizes; verify any new color combination against AA before shipping.
- Keyboard navigation: nav dropdowns open on `:focus-within` as well as `:hover`, so they're reachable by keyboard, not just mouse.
- Visible focus states: form fields get a 4px ring on focus (`--violet-100`); buttons/links rely on browser default focus ring (not currently custom-styled — **open item** if a stricter a11y pass is requested).
- Labels: every form input has an associated `<label for>`.
- Content is never hidden without a no-JS fallback: scroll-reveal (`[data-reveal]`) defaults to `opacity:0` via CSS but is force-visible inside a `<noscript>` block on every page, so disabling JavaScript never hides real content.
- Does not rely on color alone: form success/error states pair color with an icon and text, not color alone.

## 16. Theme & Language Toggles

Dark mode: `html[data-theme="dark"]` overrides the ink/surface/border custom properties only (`--ink-*`, `--surface*`, `--border`, `--success-bg`) — brand colors (`--violet-*`, `--fuchsia-*`, `--orange-*`) and the hero/CTA gradients stay identical in both themes, since those already sit on fixed-dark backgrounds designed to work regardless of site theme. A tiny inline script in every page's `<head>` (before the stylesheet loads) sets the attribute from `localStorage` or `prefers-color-scheme` to avoid a flash of the wrong theme; `assets/js/main.js` wires up the toggle button and persists changes.
**Known-easy-to-reintroduce bug, now fixed, worth remembering**: any inline `style="background:#fff;color:var(--ink-950)"` pairing a literal color with a theme-flipping variable breaks in dark mode (the variable flips, the literal doesn't). This exact bug shipped once on every page's CTA banner button before being caught — see CODE_STYLE.md's note on checking new inline styles against this pattern.

Language toggle: English/Urdu, via `assets/js/i18n.js`'s dictionary and `data-i18n`/`data-i18n-placeholder` attributes, swapped by `assets/js/main.js`. Coverage today is the shared nav/footer plus the full Home page — not the whole site (see PRD.md Feature 13 and the file's own header comment for how to extend it). Translated elements get `font-family:'Noto Nastaliq Urdu'` and `direction:rtl; text-align:right` individually (`body.lang-ur [data-i18n]` etc.) rather than flipping the whole document to `dir="rtl"`, so untranslated English content and the existing flex/grid layouts don't mirror unexpectedly. A full RTL layout mirror (logical CSS properties throughout, icon mirroring, etc.) is a larger, separate undertaking if ever wanted — this is a pragmatic middle ground, not the end state.
