# AI Coding Agent Instructions

## 1. Project Context

Project: Unify Club — Public Marketing Website (`website/` in this repo)
Purpose: A static, 13-page marketing/information site for an inclusive sports-therapy, rehabilitation, and fitness studio in Karachi, Pakistan. See PRD.md for full detail.
Primary Users: Parents/caregivers evaluating the organization, donors/corporate partners, prospective volunteers.

**Scope note:** this repository also contains a completely separate product — an internal ERP/CRM (`apps/web`, `apps/api`) — with its own stack, its own conventions, and no relationship to this website. These instructions, and the rest of `website/docs/`, describe the website only. If you are asked to work on `apps/web` or `apps/api`, these documents do not apply; look for that product's own conventions instead. (Per the blueprint this document set is based on: a root `AGENTS.md`, if one is ever added to this repo, should point here rather than assume these rules apply repo-wide — none exists today, and none should be added as a side effect of website work without being asked.)

## 2. Source of Truth

Before making any non-trivial change to `website/`, read the relevant documentation inside `website/docs/`.
Core documentation:
- PRD.md — what this site is, who it's for, what's in/out of scope, and the open questions that are still unresolved (placeholder names, bank details, no form backend, etc.)
- DESIGN_SYSTEM.md — the real color/type/spacing/component tokens in use, and the specific rule against blending amber into the teal/blue gradient
- ARCHITECTURE.md — why this is a static zero-build-step site kept separate from the CRM, the project structure, and documented failure scenarios
- DATABASE.md — confirms there is no database today, and what a future one would look like if the open question in its §4 is ever resolved
- SECURITY.md — confirms forms do not currently send data anywhere, and what must be true before that changes
- CODE_STYLE.md — naming conventions, the regeneration workflow for the duplicated nav/footer/sprite shell, and the deliberately-not-renamed `--violet-*` CSS variables
- TESTING.md — the structural/visual checks to run and the two real bugs they previously caught

Do not contradict these documents without first identifying the conflict (e.g., if you think a build step should be added, say so and point to ARCHITECTURE.md §9 explicitly rather than silently adding a bundler).

## 3. General Rules

- Understand existing code before modifying it — read the actual `.html`/`.css`/`.js`, not just this doc set, before editing.
- Reuse existing components and utilities (CODE_STYLE.md §1, §5) — check `assets/css/style.css` for an existing class before writing new CSS.
- Follow the design system (DESIGN_SYSTEM.md) — especially the amber/gradient rule in §3; it's there because an earlier version of this exact mistake was caught and fixed.
- Follow the architecture (ARCHITECTURE.md) — do not introduce a build step, framework, or new runtime dependency without flagging it as a decision to revisit, not a silent change.
- Follow database conventions — there is no database; do not invent one or start persisting form data as a "helpful" side effect of an unrelated task (see DATABASE.md §0, SECURITY.md §6 — this is explicitly called out because it would mean collecting children's personal data without an agreed data-handling policy).
- Follow security requirements — in particular, never present a form as "wired up" or "sending to the team" unless it actually is; SECURITY.md §8 exists because overstating this would create a real operational risk for a children's-services organization.
- Do not invent business requirements — placeholder content (board names, bank details, bracketed text) must stay visibly placeholder; do not quietly firm them up into realistic-looking fake specifics.
- Do not expose secrets — N/A today (none exist), stays true going forward (SECURITY.md §3).
- Avoid unnecessary dependencies — this site has zero JS dependencies by design; keep it that way unless the client asks otherwise.
- Avoid unrelated changes — a request to edit one page should not ripple into others unless the shared shell is genuinely what's changing (see §4).

## 4. Planning

Before implementing a non-trivial task:
1. Inspect relevant documentation (§2 above) for the area you're touching.
2. Inspect relevant code — if the task touches the shared shell (nav/footer/icon sprite), read CODE_STYLE.md §3's regeneration workflow before hand-editing multiple files.
3. Identify affected files — remember the shell is duplicated across all 13 pages; a nav/footer change affects all of them, a single page's body content does not.
4. Identify dependencies — does this change require a new icon in the sprite? A new page needing to be added to the nav, footer, AND sitemap.xml?
5. Identify "database"/"API" changes — almost certainly none exist to make (see DATABASE.md, SECURITY.md); if a task seems to require one, stop and flag it per §8 rather than assuming an approach.
6. Identify tests required — see TESTING.md §2; at minimum re-run the structural checks (tag balance, broken links, icon references) and an overflow scan at 360/768/1100/1440px if layout changed.
7. Create a concise implementation plan before writing code for anything touching more than one file.

## 5. Implementation

- Make focused changes — one page's content edit stays in that one file.
- Reuse established patterns — component classes, `[data-reveal]`/`[data-count]`/`[data-demo-form]` attribute hooks, the icon sprite.
- Preserve existing behavior — e.g., don't remove the `<noscript>` reveal-override fallback, the active-nav-link `data-page` matching, or the mobile dropdown tap-to-expand logic as a side effect of an unrelated edit.
- Avoid unnecessary rewrites — if a page's existing structure works, extend it rather than restructuring it wholesale.
- Keep code maintainable — plain, readable HTML/CSS/vanilla JS, consistent with CODE_STYLE.md.

## 6. Validation

After implementation:
1. Run the structural checks described in TESTING.md §2 (tag balance, broken links, icon-sprite completeness) across every page the change could plausibly have affected — if the shared shell changed, that means all 13 pages, not just the one you were focused on.
2. Run an overflow scan (360/768/1100/1440px) if anything layout-related changed, blocking the external font/maps requests during the scan per TESTING.md §2 so the check doesn't stall on this sandbox's network policy.
3. Screenshot and visually review any visually significant change rather than trusting the CSS alone — this is how real bugs (muddy gradient, nav overflow) were actually caught in this project, not by reading code.
4. Review changed files for unintended edits (especially: did a shell-regeneration script accidentally duplicate a tag, as happened once during development and was caught by the tag-balance check?).
5. Check for unintended changes outside the files the task actually required.

## 7. Documentation

Update `website/docs/` when implementation changes:
- Product behavior → PRD.md (new page, new feature, a Non-Goal becoming in-scope, an Open Question getting answered)
- Visual/architecture → DESIGN_SYSTEM.md or ARCHITECTURE.md (new color/component, new third-party request, a build step being introduced)
- "Database"/"API" → DATABASE.md/SECURITY.md (the single most important update to make the moment a real form backend is actually built — flip DATABASE.md §0 and SECURITY.md §8 from "proposed/not wired up" to "implemented," and fill in the real decisions)
- Coding conventions → CODE_STYLE.md (new naming pattern, new regeneration-workflow step)

## 8. Conflict Handling

If a request conflicts with something documented here (e.g., "add a build step," "store form submissions in a new database," "rename the CSS variables") — do not guess silently. Name the conflict explicitly, point to the specific document/section it conflicts with, and get a decision before proceeding. Three examples already anticipated in these docs, so they don't need re-litigating from scratch:
- A real form backend is **expected eventually** (DATABASE.md §4, SECURITY.md §8) — the open question is *where* (new minimal DB vs. the existing CRM's Leads/Trials modules), not *whether*. Surface that specific choice rather than picking one silently.
- Renaming the `--violet-*` CSS variables is a known, deferred cleanup (CODE_STYLE.md §2) — fine to do if asked, but should be its own isolated, fully-verified change, never bundled into an unrelated edit.
- "Make it more like kdsp.org.pk" cannot be verified against the real site from inside this environment (the domain is network-blocked) — confirm with the client whether they can supply screenshots/specifics before assuming a redesign direction; see DESIGN_SYSTEM.md §0 for how this was handled previously.

## 9. Completion Criteria

A task is complete only when:
- Requirements are satisfied (checked against PRD.md, not just the literal chat request)
- The structural and overflow checks in TESTING.md pass across every affected page
- No unintended files changed
- Security rules are respected (SECURITY.md — in particular, nothing now falsely implies a form submission reaches a real person if it doesn't)
- Documentation in `website/docs/` is updated when the implementation changed anything these documents describe
