# Code Style & Conventions

## 1. General Principles

- Prefer readable, inline-commentable HTML over abstraction — there is no templating engine, so "DRY" is achieved through a documented regeneration workflow (§3), not code-level includes.
- Keep every page's unique content between `<main id="main">` and `</main>`; everything outside that (icon sprite, nav, footer, closing script tag) must stay byte-identical across all 13 pages.
- Reuse existing component classes (`.card`, `.btn`, `.pill`, `.photo-tile`, `.feature-list`, `.meta-row`, `.event-row`, `.person-card`, `.quote-card`, `.accordion-item`) before inventing a new one. Check `assets/css/style.css` first.
- Prefer CSS custom properties (`var(--token)`) over hard-coded hex values in new rules, so a future re-theme (like the violet→teal one already done once) stays a one-file edit.
- Avoid unnecessary JavaScript — if a behavior can be done in CSS (`:hover`, `:focus-within`, `max-height` transitions), prefer that over JS.

## 2. Naming

Components (CSS classes): kebab-case, BEM-ish but not strict (`.card-icon`, `.nav-cta-mobile`, `.dropdown-panel`, `.photo-tile.alt-3`) — modifiers are appended as a second class (`.card.person-card`, `.section.section--tight`), not `__element` BEM syntax.
Functions (JS): camelCase, but the codebase is intentionally small — most logic lives in short, named `forEach` callbacks inside one `DOMContentLoaded` listener in `main.js` rather than many top-level functions.
Variables (CSS custom properties): kebab-case with a color-family prefix, e.g. `--violet-600`, `--ink-800`, `--surface-alt`.
  **Known, deliberate inconsistency:** the custom properties are still named `--violet-*` / `--fuchsia-*` / `--orange-*` even though their actual values are teal/blue/amber (the client re-themed the site from violet/fuchsia/orange to teal/blue after the initial build). They were **not** renamed to `--teal-*`/`--blue-*` when re-themed, on purpose: renaming would have required touching every one of the ~40 `var(--violet-600)`-style references across 14 HTML files and the CSS simultaneously, for a purely cosmetic naming win, with real risk of missing one mid-file and silently breaking a color reference. The trade-off was documented instead (see DESIGN_SYSTEM.md §3) rather than risk-rewritten. **If this is ever revisited, do it as its own isolated commit with a full grep-verification pass — never bundle a variable rename with an unrelated content change.**
Constants: Not applicable — no JS constants module exists; the few "constant-like" values (breakpoints, durations) live directly in the CSS/JS where used.
Files: kebab-case matching the page's URL slug exactly (`success-stories.html`, `get-involved.html`), so nav hrefs and `data-page` attributes are always a 1:1 string match with the filename — this is load-bearing (see §4).
Database fields: N/A today — see DATABASE.md for naming conventions to use **if** a schema is eventually added.
API routes: N/A today — see SECURITY.md §8.

## 3. Folder Structure

```
website/
  *.html          One file per page, flat (no subfolders) — keeps every internal link a simple relative filename with no path math.
  assets/css/     Single stylesheet, no per-page CSS files.
  assets/js/      Single script, no per-page JS files.
  assets/img/     Reserved for future real photography; currently empty by design (see ARCHITECTURE.md §9).
  docs/           This document set.
```

**Regeneration workflow (how the 13-page duplication is kept safe):** When the shared shell (sprite/nav/footer) needs to change across every page — as it did when the nav gained dropdowns — do not hand-edit 13 files one by one. The pattern used throughout this project's history:
1. Make the change once in `index.html` (the canonical source).
2. Extract `HEAD` (everything up to and including `<main id="main">`) and `FOOT` (everything from `</main>` to end of file) from the updated `index.html` with a small throwaway Python script.
3. For every other page, read its current `<title>`, meta description, and its unique body (between `<main id="main">` and `</main>`), then rewrite the file as `HEAD(title, description) + body + FOOT`.
4. Re-run the validation pass in §4 before committing.

This keeps the shell perfectly in sync without a templating engine, at the cost of needing a short script each time — acceptable because shell changes are infrequent, and body content changes (most edits) only ever touch one file directly via normal editing.

## 4. Imports

- No `<script>`/`<link>` imports beyond: Google Fonts stylesheet, `assets/css/style.css`, `assets/js/main.js`. Do not add a new external script/style tag without updating ARCHITECTURE.md §3 and SECURITY.md.
- Internal links are always plain relative filenames (`href="about.html"`, never `href="/about.html"` or `href="/about"`), so the site works correctly from a subdirectory deploy or a host that doesn't support clean URLs.
- `data-page="exact-filename.html"` must match the real filename exactly — it's how `main.js` detects the active nav link and dropdown parent. A mismatch silently breaks active-state highlighting with no visible error.

## 5. Components

Components should:
- Have a single responsibility — e.g., `.event-row` only lays out a date badge + content, it doesn't also style the card around it (that's `.card`).
- Prefer reusable patterns — new page sections should reach for `.card`/`.grid-3`/`.feature-list` before writing bespoke CSS.
- Avoid unnecessary duplication — if a new component looks 90% like an existing one, extend the existing class with a modifier rather than copy-pasting a near-duplicate block into the stylesheet.

## 6. Functions

JavaScript functions (mostly anonymous callbacks inside `main.js`) should:
- Do one logical thing per `querySelectorAll(...).forEach(...)` block (one block wires nav toggle, a separate block wires dropdowns, a separate block wires reveals, etc.) — this is how `main.js` is already organized; keep adding behavior as new, clearly-commented blocks rather than growing an existing one into multiple responsibilities.
- Have clear names where named at all (`make_head`, `crumb`, `faq_item` in the Python generation scripts used during authoring — see §3).
- Avoid unnecessary complexity — this site has no state management, no routing, no component framework; resist the urge to introduce one for a 13-page static site.

## 7. Error Handling

Use: Defensive but minimal — e.g., `document.querySelector('[data-nav-toggle]')` is checked for `null` before use (`if (navToggle) {...}`), since not every page necessarily needs every behavior to fire.
Do not: Add `try/catch` blocks around DOM queries that are expected to always succeed on a given page (e.g., the lightbox wiring only runs `if (lightbox)` exists, rather than wrapping in a try/catch) — null-checks are preferred over exception handling for this kind of "may or may not be on this page" logic.

## 8. Comments

Comments should explain:
- Why something exists when it's not obvious from the code — e.g., the `<noscript>` reveal override exists specifically so content isn't hidden when JS fails, and that reasoning lives as a comment at the point of use, not just in DESIGN_SYSTEM.md.
- Important tradeoffs — e.g., why amber is never blended into the teal/blue gradient (DESIGN_SYSTEM.md §3) should stay documented there and briefly echoed in the CSS if the rule is ever at risk of being silently violated again.
- Non-obvious behavior — e.g., why `--violet-*` variable names don't match their teal values (§2 above).

Avoid comments that simply repeat the code (e.g., do not write `/* button */` above `.btn{...}`).

## 9. Logging

Use: `console.error`/`console.warn` only for genuine unexpected failures; this codebase currently has none, since every DOM interaction is defensively null-checked rather than expected to throw.
Rules:
- Never log anything resembling user-submitted form data to the console in production code (even though forms don't currently send data anywhere — see SECURITY.md, this still applies to avoid leaking a child's info into browser dev tools / error-reporting tools if one is ever added).

## 10. Formatting

Formatter: None configured (no Prettier/build step). Match the existing file's indentation (2 spaces) and attribute-quoting (double quotes) by hand.
Linter: None configured.
Type Checking: N/A (plain JavaScript, no TypeScript/build step — consistent with the zero-build-step architecture decision in ARCHITECTURE.md §9).

## 11. Do

- Reuse existing patterns (component classes, the icon sprite, the `[data-lead-form]`/`[data-reveal]`/`[data-count]`/`[data-i18n]` attribute hooks).
- Keep changes focused — a content edit to one page should touch one `.html` file, not ripple into the shared shell unless the shell itself is genuinely changing.
- Follow project conventions documented here and in DESIGN_SYSTEM.md.
- Remove dead code — if a page section is deleted, also remove any now-unused CSS class or icon symbol it alone depended on (verify with a repo-wide grep first).
- When writing an inline `style="..."` that mixes a literal color with a `var(--ink-*)`/`var(--surface*)` value, check whether that element sits on a background that changes with the site's dark/light theme — if it does, both colors need to be variables (or both literal), never one of each. This exact mismatch shipped once (see DESIGN_SYSTEM.md §16) and silently made CTA button text unreadable in dark mode.
- Run the validation steps in TESTING.md before considering any change done.

## 12. Don't

- Don't create a duplicate utility class when an existing one (even a slightly differently-named one) already does the job — check `style.css` first.
- Don't introduce a build step, bundler, or npm dependency to solve a problem that CSS/vanilla JS can already solve, without first updating ARCHITECTURE.md §9 to record that the zero-build-step decision was revisited and why.
- Don't ignore the shared-shell duplication and hand-edit the nav/footer in just one or two files "for now" — that's exactly how the 13 pages drift out of sync. Use the regeneration workflow (§3).
- Don't change unrelated files — a copy edit on `events.html` should not also touch `faqs.html` unless the task genuinely requires it.
- Don't rename the `--violet-*`/`--fuchsia-*`/`--orange-*` CSS variables as a side effect of an unrelated change (see §2).
