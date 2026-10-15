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

Language toggle: English/Urdu, via `assets/js/i18n.js`'s dictionary and `data-i18n`/`data-i18n-placeholder`/`data-i18n-alt`/`data-i18n-aria` attributes, swapped by `assets/js/main.js`'s `applyLanguage()`. **Coverage is now complete across all 14 pages** (511 keys — every heading, paragraph, card, form, FAQ, testimonial, image alt text, icon-button aria-label, and the dynamically-rendered lead-tracker/status-widget text; see PRD.md Feature 13). `data-i18n-alt` swaps `<img alt="">` and `data-i18n-aria` swaps an icon-only button's `aria-label` — both added in this pass alongside the existing text/placeholder swap, since alt text and aria-labels are real accessibility content, not decoration. JS-rendered strings (the lead tracker's step labels, the "couldn't submit"/"not connected"/"couldn't find that reference" states) go through a small `t(key, fallback)` dictionary lookup in `main.js` instead of being hardcoded English, so they track the current language exactly like markup does; the one exception is a Lead's `stepLabel`, which comes from the CRM's Leads API response itself and stays English regardless of site language, since translating API-sourced data is outside this change's scope. Translated elements get `font-family:'Noto Nastaliq Urdu'` always, and `direction:rtl; text-align:right` on a broadened set of element types (`h1`–`h4`, `p`, `li`, `strong`, `blockquote`, accordion panels, pull-quotes, hook-stats, tile captions — extended in this pass to cover what the §19 redesign introduced) rather than flipping the whole document to `dir="rtl"`, so the nav/grid/flex layouts don't mirror unexpectedly. A full RTL layout mirror (logical CSS properties throughout, icon mirroring, etc.) is a larger, separate undertaking if ever wanted — this is a pragmatic middle ground, not the end state. **Strict language exclusivity** (zero English visible in Urdu mode, zero Urdu visible in English mode) was explicitly requested and verified: an automated scan renders every page in both languages and checks the rendered text for stray script leaks, which caught and fixed two real pre-existing bugs — the footer's "ہر صلاحیت کے لیے حرکت" tagline and the shared shell's "Skip to content"/"Movement Studio"/footer address text were static and showed in both languages regardless of the toggle; about.html's `<h1>` literally mixed English and Urdu in one hardcoded string. The brand name "Unify Club" itself is the one intentional exception, kept untranslated in both languages as a wordmark (the same convention as a product name like "YouTube" staying "YouTube" across languages) — it is not a leak.

**Fixed (previously flagged, now resolved)**: `.footer{ background:var(--ink-950); }` (style.css) assumed `--ink-950` always stays a fixed dark color, but dark mode intentionally flips `--ink-950` to a *light* value (`#f1f5f9`, for text-on-light-surface use elsewhere) — so in dark mode the footer's background went light while its text (`rgba(255,255,255,.68)`) stayed white, making the footer nearly unreadable. The footer is a fixed dark navy band by design in light mode already (same visual role as the hero/CTA gradients), so the fix follows the exact same "stays fixed regardless of theme" pattern as `--gradient-hero`: a new, deliberately non-flipping custom property, `--footer-bg:#0f172a` (defined once in `:root`, absent from the `html[data-theme="dark"]` override block on purpose), replaces the `var(--ink-950)` reference on `.footer` alone. Everything else inside the footer (`.footer h4`, `.footer-links`, `.social-row`, `.footer-bottom`, etc.) was already using literal `#fff`/`rgba(255,255,255,…)` values, not theme-flipping variables, so no other footer rule needed to change — confirmed by re-screenshotting the footer on `index.html`, `about.html`, and `gallery.html` in both themes. Since `style.css` is the single shared stylesheet referenced by all 14 pages, this was a one-file fix with no shell regeneration needed (CODE_STYLE.md §3 doesn't apply — no HTML markup changed, only a CSS custom property).

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

**Where each one is used**: Home hero collage (3), Home About snapshot (3, one since replaced by a video — see §20) + full About page (3), Home Success Stories preview (3) + full Success Stories page (same 3, for narrative consistency between the teaser and the full story), Gallery (13 photos + 2 videos, the main showcase — two photos and one video are shown "big," see below), Programs (3, one per program section, added in the §19 redesign pass — previously these three slots were generic icon tiles, not real photography), Locations (1, added in the §19 redesign pass to the open-branch card — previously this page had no photo slots at all), News (1, the featured/most-recent article), Events (1, the featured next-upcoming event).

**Bold "statement" photo treatment** (`.photo-tile.statement` in style.css) — a second, deliberately bigger presentation style added alongside the uniform small-tile grid, per an explicit client reference to sadapay.pk's large-format photo/video treatment (PRD.md §11/§12): a punchier `box-shadow`, a thin inset brand-colored frame standing in for sadapay's color-blocking (full CSS "color blocking" around a photo — a solid brand-colored mat/border — was considered but skipped for now as a larger CSS layout change; the inset frame achieves a similar punchy, intentional feel without it), and a slightly larger hover lift. Used on the Home hero's first (tallest) collage tile and two Gallery tiles that are also given `grid-column:span 2; grid-row:span 2` so they render roughly 2×2 cells — genuinely large-format, not just visually emphasized within a same-size tile. Reserved for a handful of images per page, not applied broadly, so it keeps reading as a deliberate accent.

## 19. Structural Redesign of the 12 Non-Home Pages

Per the client's explicit follow-up instruction ("make it more scannable... make it hooks attractive so it stays eyes a little more, like those websites"), the other 12 content pages (About, Team, Programs, Success Stories, Get Involved, Events, News, Gallery, Locations, Contact, FAQs, Book — not Home, which already carried this bar from the previous pass, and not 404, which is intentionally minimal) got a genuine structural pass, not just motion polish. Two new reusable components were added to `style.css` for this (reused, not one-off inline styles — see CODE_STYLE.md §5):

- **`.hook-stat`** — a bold number/short-phrase pair (`<strong>` + `<span>`) in a tinted rounded panel, used to *open* a section with a real, concrete fact instead of a paragraph. Every number in a `.hook-stat` across the site is pulled from content that already existed elsewhere (the Home stat bar's "9 years," a literal count of items on that page — "3" programs, "13 + 2" gallery items, "10" FAQs, "1 + 3" locations — or an existing per-profile stat like a Success Story's progress percentage). None are invented; see PRD.md §12 and AGENTS.md §3's "do not invent business requirements" rule, which this pattern was built to respect while still giving each page a concrete opening hook.
- **`.pull-quote`** — an oversized, quote-icon-led callout for a single testimonial line, used as a mid-page "breather" (e.g. About's values section) by reusing one of the three real testimonial quotes that already exist in the dictionary (`stories.q1/q2/q3.quote`) rather than writing new ones.

Beyond those two components, the redesign pass applied the same handful of moves consistently across all 12 pages: split a dense opening paragraph into a short lead sentence (often inside a `.hook-stat`) plus one or two shorter paragraphs; swap a generic icon-tile placeholder for a real photo or video from the curated library wherever a page had one (Programs' three sections, Locations' open-branch card); feature the single most relevant item in a list larger and separately rather than giving every item identical weight (Events' next-upcoming entry, News' most recent article); and make sure every section that gained new markup also got `[data-reveal]`/`[data-reveal-group]` coverage, matching the rest of the site rather than introducing a new motion pattern. Team.html, previously a single thin section, also now surfaces the same four values cards from About (reused content, not new copy) so it doesn't read as an afterthought next to the other 11 pages.

i18n coverage (§16, Feature 13) was built into each page's redesigned markup as it was written, not retrofitted afterward — every new `data-i18n` key landed in `assets/js/i18n.js` in the same pass as the HTML that references it.

## 20. Video

**Source**: the same `unify club pechs branch` Google Drive folder as the photography (§18), plus — unlike the previous pass, which didn't sample them — the dated event folders (`24/04/25`, `19/04/2025` and similar), which hold Pixel/phone `VID_*`/`PXL_*` clips from real sessions. The same "the tool's response exceeds its token budget but still saves the full JSON to disk" technique used for photos (§18) works for video too; the saved file is larger (video is bigger than a photo) but decodes fine with the same `base64.b64decode` approach in Python, run against the file directly rather than through the chat context.

**Curation**: roughly a dozen clips were downloaded and screened via labeled contact-sheet montages (the same review technique used for photo curation) extracted with `ffmpeg -vf select=...`. Four were selected on the same bar as the photos — genuine mid-activity coaching, a real mix of different kids and drills, no posed-for-camera moments, in focus, well-composed: a coached basketball passing drill, a cone/ladder/hoop agility circuit, a tire-flip fitness drill, and a crawl-and-jump agility drill with a coach spotting the child. One candidate clip (a held assisted stretch) was reviewed and *not* used — it was mostly a static held pose rather than movement, which didn't fit the "genuine action" bar the brief set, the same curation standard already applied to photos.

**Cutting & encoding** (ffmpeg, local authoring step, not a runtime dependency — same category as the ImageMagick photo pipeline in §18): each clip was trimmed to a 6–7 second segment showing continuous action (never the full 7–27 second source clip), with audio removed (`-an` — these are silent background-style clips, never autoplaying with sound) and re-encoded at a web-appropriate size (max 960px wide for the one landscape source, 540px wide for the three portrait phone sources — scaled down, never up) and bitrate (`crf 26`/`crf 32`). **Two formats are shipped per clip** — `.webm` (VP9, listed first in markup) and `.mp4` (H.264, fallback) — because this environment's own headless validation browser turned out to be a Chromium build without H.264 support (`canPlayType('video/mp4; codecs="avc1.42E01E"')` returns empty), which is also good real-world practice regardless (Safari needs the H.264 fallback; everything else prefers the smaller VP9 file). All 4 clips in both formats total **7.8MB** (`website/assets/video/`), and no single page loads more than one or two clips, so per-page video payload stays small for a static site with no CDN.

**Markup pattern** (`.photo-tile.video-tile` — extends the existing `.photo-tile` component, see §18, rather than inventing a parallel one): a `<video autoplay muted loop playsinline poster="...">` with `<source>` elements (webm, then mp4) sits over a plain `<img class="video-fallback-poster">` of that same poster frame. `prefers-reduced-motion: reduce` hides the `<video>` with a pure CSS media query (`style.css`, no JS required, and it re-evaluates live if the OS setting changes mid-session) so the static poster shows instead — this needed no change to `main.js`, since CSS alone fully satisfies the requirement and keeps the site's "prefer CSS over JS" convention (CODE_STYLE.md §1). A small `.video-badge` (a play-triangle icon, new sprite symbol `i-play`, added to the shared shell across all 14 pages via the CODE_STYLE.md §3 regeneration workflow) sits in the tile's corner so a muted, already-playing clip still visibly reads as a video rather than a slightly-odd-looking photo.

**Where each one is used**: Home About snapshot (1, replacing what was previously a static photo there — the three hero-collage photos and two About-page square photos were left untouched), Gallery (2, added as new tiles alongside the existing 13 photos — one shown "big" via `.statement`), Programs (1, in the Physical Fitness section, replacing what was previously a static photo there). The Home hero collage itself was deliberately left unchanged — it already carries the site's most elaborate choreography (§17), and adding autoplaying video to it was judged a real risk to that carefully-tuned entrance sequence for a benefit (one more video) that the About-snapshot placement, one scroll-length further down the same page, delivers with far less risk.

**File naming** (see CODE_STYLE.md §2): `assets/video/video-<content>.{mp4,webm}` (e.g. `video-tire-flip-drill.mp4`), poster frames at `assets/img/video-<content>-poster.jpg` — kebab-case, descriptive of content, matching the photo convention exactly with a `video-` prefix so the two asset types sort together and are easy to tell apart at a glance.
