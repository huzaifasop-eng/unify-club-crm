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

**Newly noticed, not fixed here (out of scope for this change — flagged per AGENTS.md §8 rather than silently patched)**: `.footer{ background:var(--ink-950); }` (style.css) assumed `--ink-950` always stays a fixed dark color, but dark mode intentionally flips `--ink-950` to a *light* value (`#f1f5f9`, for text-on-light-surface use elsewhere) — so in dark mode the footer's background goes light while its text (`rgba(255,255,255,.68)`) stays white, making the footer nearly unreadable. Caught visually while screenshotting the pages this change touched (dark-mode Gallery/Success Stories), confirmed on every page via the shared footer, and confirmed pre-existing (unrelated to this change's own edits — this task didn't touch `.footer` or `--ink-950`). The fix is straightforward (give `.footer` its own fixed-dark token, the same pattern already used for the hero/CTA gradients above, rather than reusing a variable that flips) but is its own isolated, verified change per the same reasoning as the `--violet-*` rename note in CODE_STYLE.md §2 — not bundled into this one.

## 17. Motion & Easing

Default easing: `--ease: cubic-bezier(.22,1,.36,1)` — used for essentially everything site-wide (button/card hover and press, nav dropdowns, the mobile menu, the accordion, the lightbox, `[data-reveal]`/`[data-reveal-group]` scroll reveals). It was already in place before this change; nothing about it needed fixing — see CODE_STYLE.md's note on reusing existing tokens before inventing new ones.

New token — `--ease-expo: cubic-bezier(.16,1,.3,1)`: a steeper, more dramatic curve reserved for the Home hero's bigger entrance choreography (below), so that one moment reads as more considered/confident than the site's everyday hovers and reveals, without changing how any of those everyday interactions feel.

**Site-wide polish applied in this change** (CODE_STYLE.md §12 — a content/behavior change, not a rename, so this was in scope without a separate isolated commit):
- `.btn:active{ transform:scale(.975) }` — a quick press state on every button site-wide (previously only hover/focus states existed).
- `[data-reveal-group]`'s cascade stagger was extended from 4 explicit `nth-child` delays to 13 (the Gallery grid's full tile count), so a 13-item grid cascades in smoothly instead of the 5th+ items all appearing at once with no delay.
- The lightbox (`gallery.html`) now scales in/out (`scale(.94)→scale(1)`) instead of a plain opacity fade, and its backdrop fade uses `--ease` instead of the browser default linear timing.
- `.photo-tile img` gets a slow `scale(1.045)` zoom on hover/focus (see §18) — the one micro-interaction on an otherwise static photo tile.
- All new/changed motion respects `prefers-reduced-motion: reduce` (animations/transitions are disabled, end states shown immediately) — see the corresponding `@media` blocks in style.css next to each new rule.

**Home hero entrance choreography** (`index.html` only — deliberately bigger and more ambitious than the rest of the site, per an explicit client request referencing dogstudio.co / theyearofgreta.com / sadapay.pk's genre; see PRD.md §11/§12 for why those couldn't be inspected directly):
- **Line-reveal headline**: the H1's text sits inside a `overflow:hidden` mask (`.reveal-mask`) and slides up from `translateY(115%)` on page load (`@keyframes hero-line-in`, pure CSS, no JS). The mask wraps only the inner `<span data-i18n>` text node, not the H1 itself, so the English/Urdu toggle (`main.js` `applyLanguage`, which replaces that node's `textContent`) keeps working without touching the mask markup.
- **Staggered block cascade**: the eyebrow pill → headline → lead paragraph → CTA row → trust row each carry `[data-hero-reveal="1..5"]` and rise in (`@keyframes hero-rise`) with increasing `animation-delay`, so the hero reads top-to-bottom as a deliberate sequence rather than appearing all at once. Pure CSS (`animation-fill-mode:both`) — no JS class toggle, so there's no `<noscript>` fallback needed (contrast with `[data-reveal]` elsewhere, which does need JS to ever add `.in`, and is covered by a `<noscript>` override in every page's shared shell).
- **Scroll-linked parallax**: `main.js` sets `--parallax-y` (on the hero photo collage, `[data-parallax]`) and `--blob-y` (on the two decorative `.blob` elements) from a `requestAnimationFrame`-throttled `scroll` listener, moving them a small amount as the hero scrolls toward/past the top of the viewport. Skipped entirely under `prefers-reduced-motion: reduce`. If `main.js` doesn't run, these custom properties simply stay unset and the elements sit still — a fine fallback, not a broken one.
- **Magnetic CTA hover**: the two hero buttons (`[data-magnetic]`) drift a few px toward the cursor on `mousemove` within their own bounds and ease back on `mouseleave`, via `main.js`. Gated behind `window.matchMedia('(hover: hover) and (pointer: fine)')` so touch devices never get a dangling `mousemove`-only effect, and behind the same reduced-motion check as the parallax.

## 18. Real Photography

**Source**: the client's Google Drive, specifically the `unify club pechs branch` folder (60+ photos/videos from the actual studio). Downloaded via the Google Drive MCP connector in this session — `download_file_content` exceeds the tool's response budget for a real photo (~300–500KB base64-encoded), but still saves the full response to a local file on that "failure," which was then decoded with a short Python script. Two other Drive folders were evaluated and intentionally not used: `UNFY CLUB GULSHAN BRANCH` (CR2 raw photos + `.mov` — no raw converter installed in this environment, and not worth adding one for this pass) and the dated event folders (Pixel-phone `PXL_*` shots — not sampled, the Pechs branch folder alone had more than enough strong material).

**Curation**: an initial small sample skewed toward posed, camera-aware, thumbs-up-style shots, which the client explicitly flagged as not representative of the folder (which is mostly genuine mid-activity/therapy content) — see PRD.md §11. The working set was re-sampled much more broadly (50+ photos reviewed via labeled contact-sheet montages) and re-curated to favor kids mid-activity — running, a coached kicking/swing drill, balance-board coordination work, group field sessions — with posed portrait-style shots kept to a clear minority. ~20 final images were selected: in focus, good composition, a genuine mix of different kids, activities, and settings, no blurry/awkward frames, and — because these are real children with disabilities — chosen and captioned to read as dignified and energetic, never pitying.

**Color grading** (ImageMagick, local authoring step — not a runtime dependency, same category as the Python shell-regeneration scripts in CODE_STYLE.md §3): every image gets the same `-modulate 103,112,100 -brightness-contrast 2x6` pass (a slight, consistent lift in brightness/saturation/contrast) before cropping, so the set reads as one shoot despite coming from a phone camera across different moments/lighting rather than a single studio session. This leans warm/punchy rather than flat, in keeping with the teal/blue/amber brand mood (DESIGN_SYSTEM.md §3) — amber shows up naturally in the turf/skin tones rather than being added separately, so the "don't blend amber into the brand gradient" rule (§3 above) isn't implicated.

**Crop & file convention**: each source photo is cropped (ImageMagick `-resize ^ -gravity -extent`) to whichever of the three aspect ratios its `.photo-tile` slot needs — `1x1` (most Gallery/About tiles, 1200×1200), `16x10` (the `.wide` Success Story cards, 1280×800), or `4x5` (the Home hero collage's default `.photo-tile` ratio, 960×1200) — then compressed to JPEG quality 82 with EXIF stripped. The same source photo sometimes produces two differently-cropped files for two different slots (e.g. a Success Story photo used both as a `1x1` Gallery tile and a `16x10` profile card) — each crop is its own file, named for what it shows, not for its crop ratio or source filename (see CODE_STYLE.md §2 for the naming convention this introduced).

**Where each one is used**: Home hero collage (3), Home About snapshot (3) + full About page (3), Home Success Stories preview (3) + full Success Stories page (same 3, for narrative consistency between the teaser and the full story), Gallery (13, the main showcase — two of these are shown "big," see below). Locations has no photo slots in its current layout, so nothing there changed.

**Bold "statement" photo treatment** (`.photo-tile.statement` in style.css) — a second, deliberately bigger presentation style added alongside the uniform small-tile grid, per an explicit client reference to sadapay.pk's large-format photo/video treatment (PRD.md §11/§12): a punchier `box-shadow`, a thin inset brand-colored frame standing in for sadapay's color-blocking (full CSS "color blocking" around a photo — a solid brand-colored mat/border — was considered but skipped for now as a larger CSS layout change; the inset frame achieves a similar punchy, intentional feel without it), and a slightly larger hover lift. Used on the Home hero's first (tallest) collage tile and two Gallery tiles that are also given `grid-column:span 2; grid-row:span 2` so they render roughly 2×2 cells — genuinely large-format, not just visually emphasized within a same-size tile. Reserved for a handful of images per page, not applied broadly, so it keeps reading as a deliberate accent.
