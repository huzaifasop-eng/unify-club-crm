/**
 * Exports the app shell as ONE self-contained HTML file (inline CSS, JS and icons) that opens
 * from disk with no server and no internet. It is generated from the same config the Next.js
 * app uses — navigation, module definitions, KPIs, settings — so the two never drift.
 *
 *   npm run export:html -w apps/platform   →   apps/platform/dist/unify-crm.html
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import {
  ArrowUpRight,
  ChevronRight,
  CornerDownRight,
  Filter,
  Inbox,
  Layers,
  Lock,
  Menu,
  Moon,
  Plus,
  Search,
  SendHorizontal,
  ShieldCheck,
  Sun,
  X,
  type LucideIcon,
} from 'lucide-react';
import { APP_NAME, APP_TAGLINE } from '../src/config/app';
import { DASHBOARD_KPIS } from '../src/config/kpis';
import { MODULES, PHASE_LABELS } from '../src/config/modules';
import { MOBILE_TABS, NAVIGATION } from '../src/config/navigation';
import { SETTINGS } from '../src/config/settings';

// Render icons with the React copy lucide-react itself resolves — the workspace hoists lucide next
// to the older app's React, and mixing two React copies breaks rendering.
const fromLucide = createRequire(require.resolve('lucide-react'));
const { createElement } = fromLucide('react') as typeof import('react');
const { renderToStaticMarkup } = fromLucide('react-dom/server') as typeof import('react-dom/server');

const icons = new Map<LucideIcon, string>();
const svgById: Record<string, string> = {};

function iconId(icon: LucideIcon): string {
  let id = icons.get(icon);
  if (!id) {
    id = `i${icons.size}`;
    icons.set(icon, id);
    svgById[id] = renderToStaticMarkup(createElement(icon, { size: 16, 'aria-hidden': true }));
  }
  return id;
}

const UI_ICONS = {
  arrowUpRight: ArrowUpRight,
  chevron: ChevronRight,
  alias: CornerDownRight,
  filter: Filter,
  inbox: Inbox,
  logo: Layers,
  lock: Lock,
  menu: Menu,
  moon: Moon,
  plus: Plus,
  search: Search,
  send: SendHorizontal,
  shield: ShieldCheck,
  sun: Sun,
  close: X,
};

const data = {
  appName: APP_NAME,
  tagline: APP_TAGLINE,
  ui: Object.fromEntries(Object.entries(UI_ICONS).map(([k, v]) => [k, iconId(v)])),
  nav: NAVIGATION.map((s) =>
    s.kind === 'link'
      ? { kind: s.kind, id: s.id, label: s.label, icon: iconId(s.icon), href: s.href, keywords: s.keywords ?? [] }
      : {
          kind: s.kind,
          id: s.id,
          label: s.label,
          icon: iconId(s.icon),
          basePath: s.basePath,
          items: s.items.map((i) => ({
            id: i.id,
            label: i.label,
            href: i.href,
            icon: iconId(i.icon),
            keywords: i.keywords ?? [],
            alias: i.alias ?? false,
          })),
        },
  ),
  mobileTabs: MOBILE_TABS,
  modules: MODULES,
  phases: PHASE_LABELS,
  kpis: DASHBOARD_KPIS,
  settings: SETTINGS,
  svg: svgById,
};

const json = JSON.stringify(data).replace(/</g, '\\u003c');

const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${APP_NAME} · ${APP_TAGLINE}</title>
<style>
:root{--bg:#f8f9fb;--fg:#111827;--card:#fff;--muted:#f1f2f5;--muted-fg:#626b7a;--border:#e2e4e9;--primary:#4f46e5;--primary-fg:#fff;--primary-soft:#eef0fe;--active-fg:#3b33b8;--sidebar:#fff;--ring:#4f46e5;--overlay:rgba(0,0,0,.4);color-scheme:light}
:root[data-theme="dark"]{--bg:#0d1017;--fg:#f2f4f7;--card:#131722;--muted:#1a1f2b;--muted-fg:#9aa3b2;--border:#232a37;--primary:#8b85f5;--primary-fg:#0d1017;--primary-soft:#262452;--active-fg:#d5d3ff;--sidebar:#11151e;--ring:#8b85f5;--overlay:rgba(0,0,0,.6);color-scheme:dark}
@media (prefers-color-scheme:dark){:root:not([data-theme="light"]){--bg:#0d1017;--fg:#f2f4f7;--card:#131722;--muted:#1a1f2b;--muted-fg:#9aa3b2;--border:#232a37;--primary:#8b85f5;--primary-fg:#0d1017;--primary-soft:#262452;--active-fg:#d5d3ff;--sidebar:#11151e;--ring:#8b85f5;--overlay:rgba(0,0,0,.6);color-scheme:dark}}
*{box-sizing:border-box;border-color:var(--border)}
html,body{margin:0}
body{background:var(--bg);color:var(--fg);font:14px/1.5 ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;-webkit-font-smoothing:antialiased}
a{color:inherit;text-decoration:none}
button{font:inherit;color:inherit;background:none;border:0;cursor:pointer;padding:0}
svg{flex-shrink:0;display:block}
:focus-visible{outline:2px solid var(--ring);outline-offset:2px;border-radius:6px}
.app{display:flex;min-height:100dvh}
.sidebar{position:sticky;top:0;height:100dvh;width:256px;flex-shrink:0;display:none;flex-direction:column;background:var(--sidebar);border-right:1px solid var(--border)}
@media (min-width:1024px){.sidebar{display:flex}.only-mobile-lg{display:none!important}}
.brand{display:flex;align-items:center;gap:10px;height:64px;padding:0 20px;border-bottom:1px solid var(--border);flex-shrink:0}
.brand-mark{width:36px;height:36px;border-radius:8px;background:var(--primary);color:var(--primary-fg);display:grid;place-items:center}
.brand-mark svg{width:20px;height:20px}
.brand b{display:block;font-size:14px;line-height:1.2}.brand small{display:block;font-size:11px;color:var(--muted-fg)}
.nav{flex:1;overflow-y:auto;padding:16px 12px}
.nav-link{display:flex;align-items:center;gap:10px;width:100%;padding:8px 10px;border-radius:6px;font-weight:500;color:var(--muted-fg);text-align:left;margin-bottom:2px}
.nav-link:hover{background:var(--muted);color:var(--fg)}
.nav-link.active{background:var(--primary-soft);color:var(--active-fg)}
.nav-link .grow{flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.nav-link .chev{transition:transform .2s}.nav-group.open>.nav-link .chev{transform:rotate(90deg)}
.nav-group.has-active>.nav-link{color:var(--fg)}
.nav-items{display:none;margin:2px 0 4px 17px;padding-left:10px;border-left:1px solid var(--border)}
.nav-group.open .nav-items{display:block}
.nav-items .nav-link{padding:6px 10px}
.main-col{flex:1;min-width:0;display:flex;flex-direction:column}
.topbar{position:sticky;top:0;z-index:20;height:64px;display:flex;align-items:center;gap:8px;padding:0 16px;border-bottom:1px solid var(--border);background:color-mix(in srgb,var(--bg) 90%,transparent);backdrop-filter:blur(8px)}
@media (min-width:768px){.topbar{padding:0 24px}}
.icon-btn{width:40px;height:40px;display:grid;place-items:center;border-radius:6px}
.icon-btn:hover{background:var(--muted)}.icon-btn svg{width:20px;height:20px}
.crumbs{flex:1;min-width:0;display:flex;align-items:center;gap:6px;list-style:none;margin:0;padding:0}
.crumbs li{white-space:nowrap}.crumbs .parent{color:var(--muted-fg);display:none}.crumbs .sep{display:none;color:var(--muted-fg)}
.crumbs .current{font-weight:600;overflow:hidden;text-overflow:ellipsis}
@media (min-width:640px){.crumbs .parent,.crumbs .sep{display:block}}
.search-btn{display:flex;align-items:center;gap:8px;height:36px;padding:0 12px;border:1px solid var(--border);border-radius:6px;background:var(--card);color:var(--muted-fg)}
.search-btn:hover{background:var(--muted)}.search-btn .lbl,.search-btn kbd{display:none}
@media (min-width:768px){.search-btn .lbl,.search-btn kbd{display:inline}}
kbd{font:10px ui-monospace,monospace;border:1px solid var(--border);background:var(--muted);border-radius:4px;padding:1px 5px}
main{flex:1;padding:24px 16px 96px}
@media (min-width:768px){main{padding:24px 24px 40px}}@media (min-width:1024px){main{padding:24px 32px 40px}}
.wrap{max-width:1280px;margin:0 auto}
.stack>*+*{margin-top:24px}
.header{display:flex;flex-direction:column;gap:16px}
@media (min-width:640px){.header{flex-direction:row;align-items:flex-start;justify-content:space-between}}
.header-main{display:flex;gap:12px;min-width:0}
.header-icon{display:none;width:40px;height:40px;border-radius:8px;background:var(--primary-soft);color:var(--primary);place-items:center;flex-shrink:0;margin-top:2px}
.header-icon svg{width:20px;height:20px}
@media (min-width:640px){.header-icon{display:grid}}
h1{font-size:24px;font-weight:700;letter-spacing:-.01em;margin:0}
.title-row{display:flex;flex-wrap:wrap;align-items:center;gap:8px}
.desc{margin:4px 0 0;color:var(--muted-fg)}
.badge{display:inline-flex;align-items:center;border:1px solid var(--border);border-radius:999px;padding:1px 10px;font-size:12px;color:var(--muted-fg);white-space:nowrap}
.actions{display:flex;flex-wrap:wrap;gap:8px;flex-shrink:0}
.btn{display:inline-flex;align-items:center;gap:8px;height:36px;padding:0 12px;border-radius:6px;font-weight:500;white-space:nowrap}
.btn svg{width:16px;height:16px}
.btn-primary{background:var(--primary);color:var(--primary-fg)}.btn-outline{border:1px solid var(--border);background:var(--card)}
.btn[disabled]{opacity:.5;cursor:not-allowed}
.tabs{display:flex;gap:4px;overflow-x:auto;margin-left:-16px;margin-right:-16px;padding:0 16px}
@media (min-width:640px){.tabs{margin-left:0;margin-right:0;padding:0}}
.tab{padding:6px 12px;border-radius:6px;font-weight:500;color:var(--muted-fg);white-space:nowrap}
.tab:hover{background:var(--muted);color:var(--fg)}
.tab.active{background:var(--card);color:var(--fg);box-shadow:0 1px 2px rgba(0,0,0,.06),0 0 0 1px var(--border)}
.card{background:var(--card);border:1px solid var(--border);border-radius:10px;box-shadow:0 1px 2px rgba(0,0,0,.04)}
.toolbar{display:flex;flex-direction:column;gap:8px;padding:12px;border-bottom:1px solid var(--border)}
@media (min-width:640px){.toolbar{flex-direction:row;align-items:center}}
.search-field{position:relative;flex:1}
.search-field svg{position:absolute;left:12px;top:50%;transform:translateY(-50%);color:var(--muted-fg)}
.search-field input{width:100%;height:36px;border:1px solid var(--border);border-radius:6px;background:var(--bg);color:var(--fg);padding:0 12px 0 36px;font:inherit;opacity:.6;cursor:not-allowed}
.table-wrap{display:none;overflow-x:auto}@media (min-width:768px){.table-wrap{display:block}.only-mobile{display:none}}
table{width:100%;border-collapse:collapse}
th{text-align:left;font-weight:500;color:var(--muted-fg);padding:10px 16px;white-space:nowrap;background:color-mix(in srgb,var(--muted) 45%,transparent);border-bottom:1px solid var(--border)}
.empty{display:flex;flex-direction:column;align-items:center;text-align:center;padding:56px 24px}
.empty-icon{width:48px;height:48px;border-radius:999px;background:var(--muted);display:grid;place-items:center;color:var(--muted-fg)}
.empty-icon svg{width:24px;height:24px}
.empty b{margin-top:16px}.empty p{margin:4px 0 0;max-width:28rem;color:var(--muted-fg)}.empty small{margin-top:12px;color:var(--muted-fg);font-size:12px}
.card-pad{padding:20px 24px}
.card h3{margin:0 0 12px;font-size:16px}
.rules{margin:0;padding-left:20px;color:var(--muted-fg)}.rules li{margin:6px 0}.rules li::marker{color:var(--primary)}
.note{border:1px dashed var(--border);background:var(--card);border-radius:10px;padding:12px 16px;color:var(--muted-fg)}
.section-label{margin:0 0 12px;font-size:12px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;color:var(--muted-fg)}
.grid{display:grid;gap:12px;grid-template-columns:repeat(auto-fill,minmax(12.5rem,1fr))}
.grid-3{display:grid;gap:12px;grid-template-columns:1fr}@media (min-width:640px){.grid-3{grid-template-columns:1fr 1fr}}@media (min-width:1280px){.grid-3{grid-template-columns:1fr 1fr 1fr}}
.tile{position:relative;display:flex;flex-direction:column;padding:16px;transition:border-color .15s}
.tile:hover{border-color:color-mix(in srgb,var(--primary) 40%,var(--border))}
.tile-head{display:flex;justify-content:space-between;gap:8px;font-weight:500}.tile-head svg{color:var(--muted-fg)}.tile:hover .tile-head svg{color:var(--primary)}
.tile .value{margin:8px 0 0;font-size:30px;font-weight:700;color:color-mix(in srgb,var(--muted-fg) 60%,transparent)}
.tile .def{margin:8px 0 0;font-size:12px;color:var(--muted-fg)}
.tile .cover{position:absolute;inset:0;border-radius:10px}
.setting{position:relative;display:flex;flex-direction:column;gap:8px;padding:16px}
.setting p{margin:0;flex:1;color:var(--muted-fg)}
.setting .cover{position:absolute;inset:0;border-radius:10px}
.ai{display:grid;gap:24px}@media (min-width:1024px){.ai{grid-template-columns:1fr 320px}}
.chat{display:flex;flex-direction:column;min-height:420px}
.chat-body{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:40px 24px}
.sugg{list-style:none;padding:0;margin:20px 0 0;display:grid;gap:8px;width:100%;max-width:42rem}@media (min-width:640px){.sugg{grid-template-columns:1fr 1fr}}
.sugg li{border:1px solid var(--border);border-radius:8px;background:var(--bg);padding:10px 12px;text-align:left;color:var(--muted-fg)}
.composer{display:flex;gap:8px;align-items:flex-end;padding:12px;border-top:1px solid var(--border)}
.composer textarea{flex:1;min-height:40px;resize:none;border:1px solid var(--border);border-radius:6px;background:var(--bg);color:var(--fg);padding:8px 12px;font:inherit;opacity:.6;cursor:not-allowed}
.guard{list-style:none;margin:0;padding:0;color:var(--muted-fg)}.guard li{display:flex;gap:8px;margin:12px 0}.guard svg{width:14px;height:14px;margin-top:3px}
.tabbar{position:fixed;left:0;right:0;bottom:0;z-index:30;display:flex;border-top:1px solid var(--border);background:color-mix(in srgb,var(--card) 95%,transparent);backdrop-filter:blur(8px);padding-bottom:env(safe-area-inset-bottom)}
@media (min-width:768px){.tabbar{display:none}}
.tabbar a,.tabbar button{flex:1;display:flex;flex-direction:column;align-items:center;gap:4px;padding:8px 0;font-size:11px;font-weight:500;color:var(--muted-fg)}
.tabbar svg{width:20px;height:20px}.tabbar .active{color:var(--primary)}
.overlay{position:fixed;inset:0;z-index:40;background:var(--overlay)}
.drawer{position:fixed;top:0;bottom:0;left:0;z-index:50;width:288px;max-width:85vw;display:flex;flex-direction:column;background:var(--sidebar);box-shadow:0 10px 40px rgba(0,0,0,.25)}
.drawer.enter{animation:slide .2s ease-out}
.drawer .brand{position:relative}.drawer .close{position:absolute;right:12px;top:12px}
@keyframes slide{from{transform:translateX(-100%)}to{transform:none}}
.palette{position:fixed;left:50%;top:12vh;z-index:60;width:calc(100vw - 32px);max-width:32rem;transform:translateX(-50%);background:var(--card);border:1px solid var(--border);border-radius:12px;box-shadow:0 20px 60px rgba(0,0,0,.3);overflow:hidden}
.palette-input{display:flex;align-items:center;gap:8px;padding:0 16px;border-bottom:1px solid var(--border);color:var(--muted-fg)}
.palette-input input{flex:1;height:48px;border:0;outline:0;background:transparent;color:var(--fg);font:inherit}
.palette-list{max-height:min(60vh,420px);overflow-y:auto;padding:8px}
.palette-group{padding:8px 8px 4px;font-size:11px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;color:var(--muted-fg)}
.palette-item{display:flex;align-items:center;gap:12px;width:100%;padding:8px;border-radius:6px;text-align:left}
.palette-item svg{color:var(--muted-fg)}.palette-item .grow{flex:1}.palette-item small{color:var(--muted-fg);font-size:12px}
.palette-item.sel{background:var(--muted)}
.palette-empty{padding:32px 12px;text-align:center;color:var(--muted-fg)}
.nf{min-height:60vh;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;text-align:center}
.nf .code{color:var(--primary);font-weight:600}
.sr-only{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0}
.preview-strip{background:var(--primary-soft);color:var(--active-fg);font-size:12px;text-align:center;padding:6px 12px}
</style>
</head>
<body>
<div id="root"></div>
<script>
(function () {
  'use strict';
  var D = ${json};
  var S = D.svg, UI = D.ui;
  var state = { openGroups: {}, drawer: false, drawerWasOpen: false, palette: false, query: '', sel: 0, route: '' };

  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function icon(id) { return S[id] || ''; }
  function ui(name) { return icon(UI[name]); }
  function isActive(path, href) { return path === href || path.indexOf(href + '/') === 0; }

  // Theme: explicit choice is remembered per browser; otherwise follow the OS.
  var theme = null;
  try { theme = localStorage.getItem('unify-theme'); } catch (e) {}
  function applyTheme() { if (theme) document.documentElement.setAttribute('data-theme', theme); else document.documentElement.removeAttribute('data-theme'); }
  function isDark() { return theme ? theme === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches; }
  applyTheme();

  var flat = [];
  D.nav.forEach(function (s) {
    if (s.kind === 'link') flat.push({ id: s.id, label: s.label, href: s.href, icon: s.icon, keywords: s.keywords, section: null, alias: false });
    else s.items.forEach(function (i) { flat.push({ id: i.id, label: i.label, href: i.href, icon: i.icon, keywords: i.keywords, section: s.label, alias: i.alias }); });
  });
  var canonical = flat.filter(function (e) { return !e.alias; });
  function activeEntry(path) {
    return canonical.filter(function (e) { return isActive(path, e.href); }).sort(function (a, b) { return b.href.length - a.href.length; })[0];
  }

  function currentPath() {
    var p = location.hash.replace(/^#/, '') || '/';
    return p.length > 1 ? p.replace(/\\/$/, '') : p;
  }

  // Redirects mirror the app: / → dashboard, /sales → first page in Sales, etc.
  function resolve(path) {
    if (path === '/') return '/dashboard';
    for (var i = 0; i < D.nav.length; i++) {
      var s = D.nav[i];
      if (s.kind === 'group' && path === s.basePath) {
        var first = s.items.filter(function (it) { return !it.alias; })[0];
        return first.href;
      }
    }
    return null;
  }

  function sidebarHtml(path) {
    return D.nav.map(function (s) {
      if (s.kind === 'link') {
        var a = isActive(path, s.href);
        return '<a href="#' + s.href + '" class="nav-link' + (a ? ' active' : '') + '"' + (a ? ' aria-current="page"' : '') + '>' + icon(s.icon) + '<span class="grow">' + esc(s.label) + '</span></a>';
      }
      var hasActive = s.items.some(function (i) { return isActive(path, i.href); });
      var open = !!state.openGroups[s.id];
      var items = s.items.map(function (i) {
        var a = isActive(path, i.href);
        return '<a href="#' + i.href + '" class="nav-link' + (a ? ' active' : '') + '"' + (a ? ' aria-current="page"' : '') + (i.alias ? ' title="Opens ' + esc(i.href) + '"' : '') + '>' + (i.alias ? ui('alias') : icon(i.icon)) + '<span class="grow">' + esc(i.label) + '</span></a>';
      }).join('');
      return '<div class="nav-group' + (open ? ' open' : '') + (hasActive ? ' has-active' : '') + '">' +
        '<button type="button" class="nav-link' + (hasActive && !open ? ' active' : '') + '" data-group="' + s.id + '" aria-expanded="' + open + '">' + icon(s.icon) + '<span class="grow">' + esc(s.label) + '</span><span class="chev">' + ui('chevron') + '</span></button>' +
        '<div class="nav-items">' + items + '</div></div>';
    }).join('');
  }

  function brandHtml() {
    return '<a href="#/dashboard" class="brand"><span class="brand-mark">' + ui('logo') + '</span><span><b>' + esc(D.appName) + '</b><small>' + esc(D.tagline) + '</small></span></a>';
  }

  function phaseBadge(p) { return '<span class="badge">Phase ' + p + ' · ' + esc(D.phases[p]) + '</span>'; }
  function phaseHint(p) { return 'Available in Phase ' + p + ' (' + D.phases[p] + ')'; }
  function pendingBtn(label, hint, cls, iconHtml) {
    return '<span title="' + esc(hint) + '"><button class="btn ' + cls + '" disabled aria-disabled="true">' + (iconHtml || '') + esc(label) + '<span class="sr-only"> — ' + esc(hint) + '</span></button></span>';
  }
  function header(iconId, title, desc, badge, actions) {
    return '<div class="header"><div class="header-main">' + (iconId ? '<span class="header-icon">' + icon(iconId) + '</span>' : '') +
      '<div><div class="title-row"><h1>' + esc(title) + '</h1>' + (badge || '') + '</div><p class="desc">' + esc(desc) + '</p></div></div>' +
      (actions ? '<div class="actions">' + actions + '</div>' : '') + '</div>';
  }
  function empty(title, body, hint) {
    return '<div class="empty"><span class="empty-icon">' + ui('inbox') + '</span><b>' + esc(title) + '</b><p>' + esc(body) + '</p><small>' + esc(hint) + '.</small></div>';
  }

  function modulePage(href) {
    var m = D.modules[href], e = canonical.filter(function (x) { return x.href === href; })[0];
    var hint = phaseHint(m.phase);
    var actions = (m.secondaryActions || []).map(function (a) { return pendingBtn(a, hint, 'btn-outline'); }).join('') +
      (m.primaryAction ? pendingBtn(m.primaryAction, hint, 'btn-primary', ui('plus')) : '');
    var tabs = '<div class="tabs" role="tablist" aria-label="Views">' + m.views.map(function (v, i) {
      return '<button type="button" role="tab" class="tab' + (i === 0 ? ' active' : '') + '" aria-selected="' + (i === 0) + '" data-tab>' + esc(v) + '</button>';
    }).join('') + '</div>';
    var table = '<div class="card"><div class="toolbar"><label class="search-field">' + ui('search') +
      '<span class="sr-only">Search</span><input type="search" disabled placeholder="Search ' + esc(m.title.toLowerCase()) + '…"></label>' +
      pendingBtn('Filters', hint, 'btn-outline', ui('filter')) + '</div>' +
      '<div class="table-wrap"><table><thead><tr>' + m.columns.map(function (c) { return '<th scope="col">' + esc(c) + '</th>'; }).join('') +
      '</tr></thead><tbody><tr><td colspan="' + m.columns.length + '">' + empty(m.empty.title, m.empty.body, hint) + '</td></tr></tbody></table></div>' +
      '<div class="only-mobile">' + empty(m.empty.title, m.empty.body, hint) + '</div></div>';
    var rules = '<div class="card card-pad"><h3>How ' + esc(m.title.toLowerCase()) + ' works</h3><ul class="rules">' +
      m.rules.map(function (r) { return '<li>' + esc(r) + '</li>'; }).join('') + '</ul></div>';
    return '<div class="stack">' + header(e && e.icon, m.title, m.description, phaseBadge(m.phase), actions) + tabs + table + rules + '</div>';
  }

  function dashboardPage() {
    var dash = flat.filter(function (e) { return e.id === 'dashboard'; })[0];
    var groups = D.kpis.map(function (g) {
      return '<section><h2 class="section-label">' + esc(g.label) + '</h2><div class="grid">' + g.kpis.map(function (k) {
        return '<div class="card tile"><div class="tile-head"><span>' + esc(k.label) + '</span>' + ui('arrowUpRight') + '</div>' +
          '<p class="value" aria-label="No data yet">—</p><p class="def">' + esc(k.definition) + '</p>' +
          '<a class="cover" href="#' + k.href + '"><span class="sr-only">Open ' + esc(k.label) + '</span></a></div>';
      }).join('') + '</div></section>';
    }).join('');
    return '<div class="stack">' + header(dash.icon, 'Dashboard', 'Company-wide KPIs. Each tile says exactly how it is calculated and opens the list behind it.') +
      '<div class="note">No data is connected yet, so tiles show “—” rather than sample numbers. Values appear as each module ships.</div>' + groups + '</div>';
  }

  function settingsPage() {
    var e = flat.filter(function (x) { return x.id === 'settings'; })[0];
    var groups = D.settings.map(function (g) {
      return '<section><h2 class="section-label">' + esc(g.label) + '</h2><div class="grid-3">' + g.entries.map(function (s) {
        return '<div class="card setting"><div class="tile-head"><span>' + esc(s.title) + '</span>' + (s.href ? ui('arrowUpRight') : '') + '</div>' +
          '<p>' + esc(s.description) + '</p><div>' + phaseBadge(s.phase) + '</div>' +
          (s.href ? '<a class="cover" href="#' + s.href + '"><span class="sr-only">Open ' + esc(s.title) + '</span></a>' : '') + '</div>';
      }).join('') + '</div></section>';
    }).join('');
    return '<div class="stack">' + header(e.icon, 'Settings', 'Organization setup, access control, workflows and module configuration.') + groups + '</div>';
  }

  function aiPage() {
    var e = flat.filter(function (x) { return x.id === 'ai-assistant'; })[0];
    var hint = phaseHint(5);
    var sugg = ['How many leads did each branch convert last month?', 'Which deals over 500,000 have had no activity for two weeks?', 'Who is on leave tomorrow in my team?', 'Summarise this quarter’s expenses by category.', 'Draft a follow-up WhatsApp message for my overdue leads.', 'Which items will run out of stock in the next 7 days?'];
    var guards = ['Sees only what you can see — it queries through your own permissions.', 'Never changes data on its own: every create, update or assignment needs your confirmation.', 'Salary, ID and bank details are excluded unless you hold those permissions.', 'Every question and action is logged in the audit trail.'];
    return '<div class="stack">' + header(e.icon, 'AI Assistant', 'Ask questions about your business data, draft messages, and take actions with confirmation.', phaseBadge(5)) +
      '<div class="ai"><div class="card chat"><div class="chat-body"><span class="header-icon" style="display:grid;width:48px;height:48px;border-radius:999px">' + icon(e.icon) + '</span>' +
      '<b style="margin-top:16px">What would you like to know?</b><p class="desc">Examples of what the assistant will answer:</p><ul class="sugg">' +
      sugg.map(function (s) { return '<li>' + esc(s) + '</li>'; }).join('') + '</ul></div>' +
      '<div class="composer"><label style="flex:1;display:flex"><span class="sr-only">Message</span><textarea rows="1" disabled placeholder="' + esc(hint) + '…"></textarea></label>' +
      pendingBtn('', hint, 'btn-primary', ui('send')) + '</div></div>' +
      '<div class="card card-pad"><h3 style="display:flex;gap:8px;align-items:center">' + ui('shield') + 'Guardrails</h3><ul class="guard">' +
      guards.map(function (g) { return '<li>' + ui('lock') + '<span>' + esc(g) + '</span></li>'; }).join('') + '</ul></div></div></div>';
  }

  function notFound() {
    return '<div class="nf"><span class="code">404</span><h1>Page not found</h1><p class="desc">The page doesn’t exist or you don’t have access to it.</p><a class="btn btn-primary" href="#/dashboard">Back to dashboard</a></div>';
  }

  function pageFor(path) {
    if (path === '/dashboard') return dashboardPage();
    if (path === '/settings') return settingsPage();
    if (path === '/ai-assistant') return aiPage();
    if (D.modules[path]) return modulePage(path);
    return notFound();
  }

  function crumbsHtml(path) {
    var e = activeEntry(path);
    if (!e) return '';
    return (e.section ? '<li class="parent">' + esc(e.section) + '</li><li class="sep" aria-hidden="true">' + ui('chevron') + '</li>' : '') +
      '<li class="current" aria-current="page">' + esc(e.label) + '</li>';
  }

  function tabbarHtml(path) {
    return D.mobileTabs.map(function (id) {
      var e = flat.filter(function (x) { return x.id === id; })[0];
      var a = isActive(path, e.href);
      return '<a href="#' + e.href + '"' + (a ? ' class="active" aria-current="page"' : '') + '>' + icon(e.icon) + esc(e.label) + '</a>';
    }).join('') + '<button type="button" data-drawer="open">' + ui('menu') + 'Menu</button>';
  }

  function paletteMatches() {
    var q = state.query.trim().toLowerCase();
    return canonical.filter(function (e) {
      if (!q) return true;
      return (e.label + ' ' + (e.section || '') + ' ' + e.keywords.join(' ')).toLowerCase().indexOf(q) !== -1;
    });
  }

  function paletteListHtml() {
    var list = paletteMatches();
    if (!list.length) return '<div class="palette-empty">No matching page.</div>';
    if (state.sel >= list.length) state.sel = list.length - 1;
    var html = '', last = null;
    list.forEach(function (e, i) {
      var g = e.section || 'Go to';
      if (g !== last) { html += '<div class="palette-group">' + esc(g) + '</div>'; last = g; }
      html += '<button type="button" class="palette-item' + (i === state.sel ? ' sel' : '') + '" data-go="' + e.href + '" data-idx="' + i + '" role="option" aria-selected="' + (i === state.sel) + '">' +
        icon(e.icon) + '<span class="grow">' + esc(e.label) + '</span>' + (e.section ? '<small>' + esc(e.section) + '</small>' : '') + '</button>';
    });
    return html;
  }

  var root = document.getElementById('root');

  function render() {
    var path = currentPath();
    var target = resolve(path);
    if (target) { location.replace('#' + target); return; }
    if (path !== state.route) {
      state.route = path;
      state.drawer = false;
      // Entering a group expands it; nothing auto-collapses.
      D.nav.forEach(function (s) { if (s.kind === 'group' && s.items.some(function (i) { return isActive(path, i.href); })) state.openGroups[s.id] = true; });
      var e = activeEntry(path);
      document.title = (e ? e.label + ' · ' : '') + D.appName;
      window.scrollTo(0, 0);
    }
    // Re-rendering replaces the DOM: remember which control had focus so keyboard users keep their place.
    var active = document.activeElement;
    var focused = active && active.getAttribute && active.getAttribute('data-group');
    var focusedIn = focused && active.closest('.drawer') ? '.drawer' : '.sidebar';
    // Slide the drawer in only when it opens, not on every re-render while open.
    var enter = state.drawer && !state.drawerWasOpen;
    state.drawerWasOpen = state.drawer;
    root.innerHTML =
      '<div class="preview-strip">Offline preview — layout and navigation only; no data is saved.</div>' +
      '<div class="app"><aside class="sidebar">' + brandHtml() + '<nav class="nav" aria-label="Main">' + sidebarHtml(path) + '</nav></aside>' +
      '<div class="main-col"><header class="topbar"><button type="button" class="icon-btn only-mobile-lg" data-drawer="open" aria-label="Open navigation">' + ui('menu') + '</button>' +
      '<nav aria-label="Breadcrumb" style="flex:1;min-width:0"><ol class="crumbs">' + crumbsHtml(path) + '</ol></nav>' +
      '<button type="button" class="search-btn" data-palette="open" aria-label="Search pages">' + ui('search') + '<span class="lbl">Search…</span><kbd>' + (/Mac|iPhone|iPad/.test(navigator.platform) ? '⌘K' : 'Ctrl K') + '</kbd></button>' +
      '<button type="button" class="icon-btn" data-theme-toggle aria-label="Switch to ' + (isDark() ? 'light' : 'dark') + ' theme">' + (isDark() ? ui('moon') : ui('sun')) + '</button></header>' +
      '<main id="main"><div class="wrap">' + pageFor(path) + '</div></main></div>' +
      '<nav class="tabbar" aria-label="Quick navigation">' + tabbarHtml(path) + '</nav></div>' +
      (state.drawer ? '<div class="overlay" data-drawer="close"></div><div class="drawer' + (enter ? ' enter' : '') + '" role="dialog" aria-modal="true" aria-label="Navigation">' + brandHtml() +
        '<button type="button" class="icon-btn close" data-drawer="close" aria-label="Close navigation">' + ui('close') + '</button><nav class="nav">' + sidebarHtml(path) + '</nav></div>' : '') +
      (state.palette ? '<div class="overlay" data-palette="close"></div><div class="palette" role="dialog" aria-modal="true" aria-label="Search pages"><div class="palette-input">' + ui('search') +
        '<input id="pq" placeholder="Jump to a page…" autocomplete="off" value="' + esc(state.query) + '"></div><div class="palette-list" id="pl" role="listbox">' + paletteListHtml() + '</div></div>' : '');
    if (focused) { var f = root.querySelector(focusedIn + ' [data-group="' + focused + '"]'); if (f) f.focus(); }
    if (state.palette) { var q = document.getElementById('pq'); q.focus(); q.setSelectionRange(q.value.length, q.value.length); }
  }

  function openPalette(open) { state.palette = open; state.query = ''; state.sel = 0; render(); }
  function go(href) { state.palette = false; if (currentPath() === href) render(); else location.hash = href; }

  root.addEventListener('click', function (ev) {
    var t = ev.target.closest('[data-group],[data-drawer],[data-palette],[data-theme-toggle],[data-go],[data-tab],a');
    if (!t) return;
    if (t.hasAttribute('data-group')) { var id = t.getAttribute('data-group'); state.openGroups[id] = !state.openGroups[id]; render(); }
    else if (t.hasAttribute('data-drawer')) { state.drawer = t.getAttribute('data-drawer') === 'open'; render(); }
    else if (t.hasAttribute('data-palette')) openPalette(t.getAttribute('data-palette') === 'open');
    else if (t.hasAttribute('data-theme-toggle')) { theme = isDark() ? 'light' : 'dark'; try { localStorage.setItem('unify-theme', theme); } catch (e) {} applyTheme(); render(); }
    else if (t.hasAttribute('data-go')) go(t.getAttribute('data-go'));
    else if (t.hasAttribute('data-tab')) {
      t.parentNode.querySelectorAll('[data-tab]').forEach(function (b) { b.classList.remove('active'); b.setAttribute('aria-selected', 'false'); });
      t.classList.add('active'); t.setAttribute('aria-selected', 'true');
    } else if (t.tagName === 'A' && state.drawer && t.getAttribute('href') === '#' + currentPath()) { state.drawer = false; render(); }
  });

  root.addEventListener('input', function (ev) {
    if (ev.target.id !== 'pq') return;
    state.query = ev.target.value; state.sel = 0;
    document.getElementById('pl').innerHTML = paletteListHtml();
  });

  document.addEventListener('keydown', function (ev) {
    var typing = ev.target.closest && ev.target.closest('input,textarea,select');
    if ((ev.key === 'k' && (ev.metaKey || ev.ctrlKey)) || (ev.key === '/' && !typing)) { ev.preventDefault(); openPalette(!state.palette); return; }
    if (ev.key === 'Escape' && (state.palette || state.drawer)) { state.palette = false; state.drawer = false; render(); return; }
    if (!state.palette) return;
    var list = paletteMatches();
    if (ev.key === 'ArrowDown' || ev.key === 'ArrowUp') {
      ev.preventDefault();
      state.sel = (state.sel + (ev.key === 'ArrowDown' ? 1 : -1) + list.length) % Math.max(list.length, 1);
      document.getElementById('pl').innerHTML = paletteListHtml();
      var sel = document.querySelector('.palette-item.sel'); if (sel) sel.scrollIntoView({ block: 'nearest' });
    } else if (ev.key === 'Enter' && list[state.sel]) { ev.preventDefault(); go(list[state.sel].href); }
  });

  window.addEventListener('hashchange', render);
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function () { if (!theme) render(); });
  render();
})();
</script>
</body>
</html>
`;

const outDir = path.resolve(__dirname, '../dist');
mkdirSync(outDir, { recursive: true });
const outFile = path.join(outDir, 'unify-crm.html');
writeFileSync(outFile, html);
console.log(`Wrote ${path.relative(process.cwd(), outFile)} (${(Buffer.byteLength(html) / 1024).toFixed(0)} KB)`);
