# apps/platform — Company Management & CRM

The new Next.js 15 + React 19 application described in
[`docs/ARCHITECTURE.md`](../../docs/ARCHITECTURE.md). It replaces `apps/web` + `apps/api` once it
reaches parity; until then all three live side by side.

## Status

**Application shell and navigation — no data layer yet.**

- Every page in the navigation exists and renders its real structure (views, columns, actions,
  business rules), with actions disabled and labelled by the roadmap phase that builds them.
  Nothing shows invented numbers or sample rows.
- Supabase Auth, the database and RLS arrive in Phase 0. Until then
  `src/server/session.ts` grants every permission so the whole navigation can be reviewed — it is
  the single function to replace.

## Run

```bash
npm install                 # from the repo root
npm run dev:platform        # http://localhost:3100
npm run test:platform       # navigation tests
npm run export:html -w apps/platform   # → apps/platform/dist/unify-crm.html
```

`export:html` writes a single self-contained HTML file of the shell (inline CSS, JS and icons)
that opens by double-click, with no server or internet. It is generated from the same config as
the app, so re-run it after changing the navigation or module definitions.

## Where things live

| Path | What |
| --- | --- |
| `src/config/navigation.ts` | The menu — single source for sidebar, mobile drawer, bottom tabs, ⌘K palette, breadcrumbs |
| `src/config/modules.ts` | Per-page definition: views, columns, actions, rules, phase |
| `src/config/kpis.ts`, `src/config/settings.ts` | Dashboard tiles and settings catalog |
| `src/lib/navigation.ts` | Pure helpers (permission filtering, active route, breadcrumbs) + tests |
| `src/lib/permissions.ts` | Permission keys that gate navigation |
| `src/components/shell/` | Sidebar, drawer, top bar, bottom tabs, command palette |
| `src/components/module/` | Shared module page, header, empty state |

## Adding a page

1. Add the link to `src/config/navigation.ts` (with its permission).
2. Add its definition to `src/config/modules.ts`.
3. Create `src/app/(app)/<path>/page.tsx`.

`npm test` fails if any of the three is missing, so there are no dead links.

## Navigation notes

- **Sales → Sales Reports** and **Finance → Reports** are shortcuts to `/reports/sales` and
  `/reports/finance`. Each report has one URL and one home (under Reports); the shortcut highlights
  too when you're on it.
- **Keyboard:** `Ctrl/⌘ K` or `/` opens page search.
- **Layouts:** sidebar at ≥ 1024 px; slide-in drawer below that; bottom tab bar on phones
  (< 768 px) with Dashboard · Leads · Attendance · Tasks · Menu.
