/* BINT E SAFIA — storefront app (vanilla JS, no build step). */
(() => {
  'use strict';

  const D = window.BES_DATA;
  const { PRODUCTS, CATEGORIES, COLORS, SIZES, SHIPPING } = D;
  const byId = Object.fromEntries(PRODUCTS.map((p) => [p.id, p]));
  const catName = Object.fromEntries(CATEGORIES.map((c) => [c.slug, c.name]));

  /* ---------- helpers ---------- */
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
  const money = (n) => 'PKR ' + Math.round(n).toLocaleString('en-US');
  const unitPrice = (p) => p.sale || p.price;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const store = {
    get(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* storage unavailable */ } }
  };
  const hash = (s) => { let h = 0; for (const c of s) h = (h * 31 + c.charCodeAt(0)) >>> 0; return h; };
  const isStitched = (p) => p.cat === 'ready-to-wear' || p.cat === 'festive';
  const kindOf = (p) => (p.cat === 'unstitched' ? 'fabric' : p.cat === 'accessories' ? 'drape' : 'kurta');
  // A deterministic "sold out" size for some products so the size picker shows real states.
  const soldOut = (p) => (isStitched(p) && hash(p.id) % 3 === 0 ? [SIZES[hash(p.id) % SIZES.length]] : []);

  const state = {
    cart: store.get('bes_cart', []),
    wish: store.get('bes_wish', []),
    promo: store.get('bes_promo', null),
    lastOrder: store.get('bes_last_order', null),
    path: null
  };
  const saveCart = () => { store.set('bes_cart', state.cart); store.set('bes_promo', state.promo); updateCounts(); };
  const saveWish = () => { store.set('bes_wish', state.wish); updateCounts(); };

  /* ---------- icons ---------- */
  const I = {
    search: '<path d="M10.5 3a7.5 7.5 0 1 1 0 15 7.5 7.5 0 0 1 0-15Zm0 0M16 16l5 5"/>',
    heart: '<path d="M12 20s-7.5-4.6-9-9.3C2 7.6 4 4.5 7.2 4.5c2 0 3.6 1.2 4.8 3 1.2-1.8 2.8-3 4.8-3C20 4.5 22 7.6 21 10.7 19.5 15.4 12 20 12 20Z"/>',
    bag: '<path d="M5 8h14l-1 13H6L5 8Z"/><path d="M9 8V6.5a3 3 0 0 1 6 0V8"/>',
    menu: '<path d="M3 7h18M3 12h18M3 17h18"/>',
    close: '<path d="M6 6l12 12M18 6 6 18"/>',
    left: '<path d="M15 5l-7 7 7 7"/>',
    right: '<path d="M9 5l7 7-7 7"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    minus: '<path d="M5 12h14"/>',
    filter: '<path d="M4 6h16M7 12h10M10 18h4"/>',
    truck: '<path d="M2 6h11v10H2zM13 10h4l4 3v3h-8z"/><circle cx="6" cy="17.5" r="1.8"/><circle cx="17" cy="17.5" r="1.8"/>',
    cash: '<rect x="2.5" y="6" width="19" height="12" rx="1.5"/><circle cx="12" cy="12" r="2.6"/>',
    swap: '<path d="M4 8h14l-3-3M20 16H6l3 3"/>',
    pin: '<path d="M12 21s-6.5-6.2-6.5-11a6.5 6.5 0 0 1 13 0c0 4.8-6.5 11-6.5 11Z"/><circle cx="12" cy="10" r="2.3"/>',
    instagram: '<rect x="3.5" y="3.5" width="17" height="17" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.2" cy="6.8" r=".6"/>',
    facebook: '<path d="M14 8.5h2.5V5H14c-2.2 0-3.5 1.5-3.5 3.6V11H8v3.4h2.5V21H14v-6.6h2.5l.5-3.4h-3V9.3c0-.5.3-.8 1-.8Z"/>',
    tiktok: '<path d="M14 3v11.5a3.5 3.5 0 1 1-3.5-3.5M14 3c.4 2.6 2.2 4.3 5 4.5"/>',
    check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
    grid2: '<rect x="4" y="4" width="7" height="16"/><rect x="13" y="4" width="7" height="16"/>',
    grid3: '<rect x="3" y="4" width="5" height="16"/><rect x="9.5" y="4" width="5" height="16"/><rect x="16" y="4" width="5" height="16"/>'
  };
  const icon = (n, cls = '') => `<svg class="ico ${cls}" viewBox="0 0 24 24" aria-hidden="true" focusable="false">${I[n] || ''}</svg>`;

  /* ---------- artwork: garments drawn from each product's colours and motif ---------- */
  let uid = 0;
  const mix = (a, b, t) => {
    const pa = parseInt(a.slice(1), 16), pb = parseInt(b.slice(1), 16);
    const ch = (s) => Math.round((((pa >> s) & 255) * (1 - t)) + (((pb >> s) & 255) * t));
    return '#' + ((1 << 24) + (ch(16) << 16) + (ch(8) << 8) + ch(0)).toString(16).slice(1);
  };
  const flower = (x, y, ink, base) => `<g fill="${ink}"><circle cx="${x}" cy="${y - 3.6}" r="2.4"/><circle cx="${x}" cy="${y + 3.6}" r="2.4"/><circle cx="${x - 3.6}" cy="${y}" r="2.4"/><circle cx="${x + 3.6}" cy="${y}" r="2.4"/></g><circle cx="${x}" cy="${y}" r="1.5" fill="${base}"/>`;
  function motif(m, base, ink) {
    switch (m) {
      case 'buti': return flower(10, 10, ink, base) + flower(30, 30, ink, base);
      case 'floral': return `<g transform="translate(20 20)" fill="${ink}">${[0, 60, 120, 180, 240, 300].map((a) => `<ellipse cx="0" cy="-7.5" rx="3" ry="6" transform="rotate(${a})"/>`).join('')}<circle r="2.8" fill="${base}"/></g><g fill="${ink}" opacity=".75"><circle cx="0" cy="0" r="1.6"/><circle cx="40" cy="0" r="1.6"/><circle cx="0" cy="40" r="1.6"/><circle cx="40" cy="40" r="1.6"/></g>`;
      case 'ajrak': return `<rect x=".75" y=".75" width="38.5" height="38.5" fill="none" stroke="${ink}" stroke-width="1.5"/><path d="M20 6 L34 20 L20 34 L6 20Z" fill="${ink}"/><path d="M20 13 L27 20 L20 27 L13 20Z" fill="${base}"/><circle cx="20" cy="20" r="2.2" fill="${ink}"/>`;
      case 'jaal': return `<g fill="none" stroke="${ink}" stroke-width="1.4"><circle cx="0" cy="0" r="20"/><circle cx="40" cy="0" r="20"/><circle cx="0" cy="40" r="20"/><circle cx="40" cy="40" r="20"/><circle cx="20" cy="20" r="20"/></g><circle cx="20" cy="20" r="2" fill="${ink}"/>`;
      case 'chevron': return `<g fill="none" stroke="${ink}" stroke-width="2.4" stroke-linejoin="miter"><polyline points="0,15 10,6 20,15 30,6 40,15"/><polyline points="0,34 10,25 20,34 30,25 40,34"/></g>`;
      case 'stripe': return `<path d="M-5 5 L5 -5 M0 40 L40 0 M35 45 L45 35" stroke="${ink}" stroke-width="4"/><path d="M-5 25 L25 -5 M15 45 L45 15" stroke="${ink}" stroke-width="1.2"/>`;
      default: return `<g fill="${ink}" opacity=".25"><circle cx="5" cy="5" r=".8"/><circle cx="25" cy="25" r=".8"/></g>`;
    }
  }
  const patternDef = (id, p, scale = 1, base = p.base, ink = p.ink) =>
    `<pattern id="${id}" patternUnits="userSpaceOnUse" width="${40 * scale}" height="${40 * scale}"><g transform="scale(${scale})"><rect width="40" height="40" fill="${base}"/>${motif(p.motif, base, ink)}</g></pattern>`;
  const foldGradient = (id, dir = 'x') =>
    `<linearGradient id="${id}" ${dir === 'x' ? 'x1="0" x2="1" y1="0" y2="0"' : 'x1="0" x2="0" y1="0" y2="1"'}><stop offset="0" stop-color="#000" stop-opacity=".22"/><stop offset=".28" stop-color="#fff" stop-opacity=".10"/><stop offset=".5" stop-color="#000" stop-opacity=".02"/><stop offset=".72" stop-color="#fff" stop-opacity=".12"/><stop offset="1" stop-color="#000" stop-opacity=".24"/></linearGradient>`;

  const KURTA = 'M122 38 Q150 58 178 38 L214 50 L258 160 L236 170 L208 98 L220 330 L80 330 L92 98 L64 170 L42 160 L86 50 Z';

  function art(p, view = 'front', opts = {}) {
    if (p.images && p.images.length) {
      const src = view === 'detail' && p.images[1] ? p.images[1] : p.images[0];
      return `<img src="${esc(src)}" alt="${esc(p.name)}" loading="lazy">`;
    }
    const id = 'a' + (++uid);
    const bg = opts.bg || mix(p.base, '#F4F1EC', 0.87);
    const label = opts.decorative ? 'aria-hidden="true"' : `role="img" aria-label="${esc(p.name)}${view === 'detail' ? ', fabric close-up' : ''}"`;
    const open = `<svg class="art" viewBox="0 0 300 400" preserveAspectRatio="xMidYMid slice" ${label}>`;
    const kind = view === 'front' ? kindOf(p) : view;

    if (kind === 'detail') {
      return `${open}<defs>${patternDef(id + 'p', p, 2.6)}${foldGradient(id + 'g')}</defs>
        <rect width="300" height="400" fill="url(#${id}p)"/>
        <rect y="318" width="300" height="46" fill="${p.accent}"/>
        <path d="M0 330 H300 M0 352 H300" stroke="${p.ink}" stroke-width="2" stroke-dasharray="2 6" stroke-linecap="round"/>
        <rect width="300" height="400" fill="url(#${id}g)"/></svg>`;
    }

    if (kind === 'fabric') {
      const pieces = Math.max(p.pieces, 2);
      const layers = [];
      const top = 200 - pieces * 28;
      for (let i = pieces - 1; i >= 0; i--) {
        const y = top + i * 60;
        const fill = i === 0 ? `url(#${id}p)` : i === 1 && pieces === 3 ? `url(#${id}d)` : mix(p.accent, p.base, 0.25);
        layers.push(`<g><rect x="52" y="${y + 6}" width="196" height="64" rx="4" fill="#000" opacity=".08"/>
          <rect x="48" y="${y}" width="196" height="64" rx="4" fill="${fill}"/>
          <rect x="222" y="${y}" width="22" height="64" rx="3" fill="#000" opacity=".14"/>
          <path d="M48 ${y + 2} H244" stroke="#fff" stroke-opacity=".35" stroke-width="2"/></g>`);
      }
      return `${open}<defs>${patternDef(id + 'p', p, 0.9)}${patternDef(id + 'd', p, 0.6, mix(p.base, '#ffffff', 0.55), p.ink)}</defs>
        <rect width="300" height="400" fill="${bg}"/>${layers.join('')}
        <g transform="translate(196 ${top - 14})"><rect width="58" height="26" rx="2" fill="#FBFAF7"/><text x="29" y="17.5" text-anchor="middle" font-family="Jost, sans-serif" font-size="12" letter-spacing="1.5" fill="#1C1A1B">${pieces} PC</text></g>
        <path d="M180 ${top + 36} l6 -24" stroke="#1C1A1B" stroke-width="1"/></svg>`;
    }

    if (kind === 'drape') {
      const fringe = 'M80 64 L220 64 L228 352 L212 366 L196 352 L180 368 L164 352 L148 370 L132 352 L116 368 L100 352 L86 366 L72 352 Z';
      return `${open}<defs>${patternDef(id + 'p', p, 1)}${foldGradient(id + 'g')}<clipPath id="${id}c"><path d="${fringe}"/></clipPath></defs>
        <rect width="300" height="400" fill="${bg}"/>
        <rect x="56" y="58" width="188" height="6" rx="3" fill="#2a2627"/>
        <g clip-path="url(#${id}c)"><rect width="300" height="400" fill="url(#${id}p)"/>
          <rect x="0" y="300" width="300" height="26" fill="${p.accent}"/><rect x="0" y="64" width="300" height="12" fill="${p.accent}"/>
          <path d="M115 64 V370 M150 64 V370 M185 64 V370" stroke="#000" stroke-opacity=".08" stroke-width="10"/>
          <rect width="300" height="400" fill="url(#${id}g)"/></g></svg>`;
    }

    // kurta (front)
    const trouser = mix(p.accent, '#000000', 0.1);
    const legs = p.pieces >= 2 ? `<path d="M102 318 L146 318 L143 392 L106 392Z M154 318 L198 318 L194 392 L157 392Z" fill="${trouser}"/>` : '';
    const dupatta = p.pieces >= 3 ? `<g><path d="M84 50 L112 42 L232 300 L206 322 Z" fill="url(#${id}d)" opacity=".95"/><path d="M84 50 L206 322 M112 42 L232 300" stroke="${p.accent}" stroke-width="5"/></g>` : '';
    return `${open}<defs>${patternDef(id + 'p', p, 1)}${p.pieces >= 3 ? patternDef(id + 'd', p, 0.55, mix(p.base, '#ffffff', 0.5), p.ink) : ''}${foldGradient(id + 'g')}<clipPath id="${id}c"><path d="${KURTA}"/></clipPath></defs>
      <rect width="300" height="400" fill="${bg}"/>
      <ellipse cx="150" cy="394" rx="96" ry="6" fill="#000" opacity=".07"/>
      <path d="M150 40 V27 q0 -8 7 -8 q7 0 7 7" fill="none" stroke="#6b6567" stroke-width="2.2" stroke-linecap="round"/>
      ${legs}
      <g clip-path="url(#${id}c)"><rect width="300" height="400" fill="url(#${id}p)"/>
        <rect x="0" y="310" width="300" height="20" fill="${p.accent}"/>
        <path d="M262 158 L232 172 M38 158 L68 172" stroke="${p.accent}" stroke-width="18"/>
        <rect width="300" height="400" fill="url(#${id}g)"/></g>
      <path d="M122 38 Q150 58 178 38" fill="none" stroke="${p.accent}" stroke-width="5"/>
      <path d="M150 50 V104" stroke="${p.accent}" stroke-width="3" stroke-dasharray="1 6" stroke-linecap="round"/>
      ${dupatta}</svg>`;
  }

  const tileURL = (o) => `url("data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40"><rect width="40" height="40" fill="${o.base}"/>${motif(o.motif, o.base, o.ink)}</svg>`)}")`;

  const swatch = (o, cls = '') => {
    const id = 'a' + (++uid);
    return `<svg class="${cls}" viewBox="0 0 80 80" aria-hidden="true"><defs>${patternDef(id, o, 0.75)}</defs><rect width="80" height="80" fill="url(#${id})"/></svg>`;
  };

  /* ---------- reusable fragments ---------- */
  const priceHTML = (p) => p.sale
    ? `<span class="price"><s aria-label="Was ${money(p.price)}">${money(p.price)}</s> <ins>${money(p.sale)}</ins> <span class="pct">−${Math.round((1 - p.sale / p.price) * 100)}%</span></span>`
    : `<span class="price">${money(p.price)}</span>`;

  const badges = (p) => {
    const b = [];
    if (p.isNew) b.push('<span class="badge">New</span>');
    if (p.sale) b.push('<span class="badge badge--sale">Sale</span>');
    return b.length ? `<div class="badges">${b.join('')}</div>` : '';
  };

  const wishBtn = (p) => {
    const on = state.wish.includes(p.id);
    return `<button class="wish ${on ? 'is-on' : ''}" data-action="toggle-wish" data-id="${p.id}" aria-pressed="${on}" aria-label="${on ? 'Remove from' : 'Add to'} wishlist: ${esc(p.name)}">${icon('heart')}</button>`;
  };

  const card = (p) => `
    <article class="card">
      <div class="card-media">
        <a href="#/product/${p.id}" class="card-link" tabindex="-1" aria-hidden="true">
          <span class="card-img">${art(p, 'front', { decorative: true })}</span>
          <span class="card-img card-img--alt">${art(p, 'detail', { decorative: true })}</span>
        </a>
        ${badges(p)}${wishBtn(p)}
        <button class="quick" data-action="quick-view" data-id="${p.id}">Quick view</button>
      </div>
      <div class="card-body">
        <p class="eyebrow">${esc(p.sub)} · ${esc(p.fabric)}</p>
        <h3 class="card-title"><a href="#/product/${p.id}">${esc(p.name)}</a></h3>
        ${priceHTML(p)}
      </div>
    </article>`;

  const crumbs = (items) => `<nav class="crumbs" aria-label="Breadcrumb"><ol>${items.map((it, i) => i < items.length - 1 ? `<li><a href="${it[1]}">${esc(it[0])}</a></li>` : `<li aria-current="page">${esc(it[0])}</li>`).join('')}</ol></nav>`;

  /* ---------- header: nav + mobile menu ---------- */
  const NAV = [
    { label: 'New In', href: '#/shop/new' },
    ...CATEGORIES.map((c) => ({ label: c.name, href: '#/shop/' + c.slug, cat: c })),
    { label: 'Sale', href: '#/shop/sale', sale: true }
  ];

  function buildNav() {
    const unique = (arr) => [...new Set(arr)];
    const mega = (c) => {
      const items = PRODUCTS.filter((p) => p.cat === c.slug);
      const feature = items.find((p) => p.isNew) || items[0];
      return `<div class="mega"><div class="wrap mega-inner">
        <div class="mega-col"><h3>By type</h3><ul>${unique(items.map((p) => p.sub)).map((s) => `<li><a href="#/shop/${c.slug}?sub=${encodeURIComponent(s)}">${esc(s)}</a></li>`).join('')}<li><a href="#/shop/${c.slug}">View all</a></li></ul></div>
        <div class="mega-col"><h3>By fabric</h3><ul>${unique(items.map((p) => p.fabric)).map((f) => `<li><a href="#/shop/${c.slug}?fabric=${encodeURIComponent(f)}">${esc(f)}</a></li>`).join('')}</ul></div>
        <p class="mega-blurb">${esc(c.blurb)}</p>
        <a class="mega-feature" href="#/product/${feature.id}"><span class="mega-art">${art(feature, 'front', { decorative: true })}</span><span class="eyebrow">Just in</span><span>${esc(feature.name)}</span></a>
      </div></div>`;
    };
    $('#nav').innerHTML = `<ul class="nav-list">${NAV.map((n) => `<li class="nav-item${n.cat ? ' has-mega' : ''}"><a href="${n.href}" class="nav-link${n.sale ? ' is-sale' : ''}">${esc(n.label)}</a>${n.cat ? mega(n.cat) : ''}</li>`).join('')}</ul>`;

    $('#menu-body').innerHTML = `<ul class="m-nav">${NAV.map((n) => n.cat
      ? `<li><details><summary>${esc(n.label)}${icon('plus')}</summary><ul>${[...new Set(PRODUCTS.filter((p) => p.cat === n.cat.slug).map((p) => p.sub))].map((s) => `<li><a href="#/shop/${n.cat.slug}?sub=${encodeURIComponent(s)}">${esc(s)}</a></li>`).join('')}<li><a href="${n.href}">View all ${esc(n.label)}</a></li></ul></details></li>`
      : `<li><a href="${n.href}" class="${n.sale ? 'is-sale' : ''}">${esc(n.label)}</a></li>`).join('')}</ul>
      <ul class="m-links"><li><a href="#/wishlist">${icon('heart')} Wishlist</a></li><li><a href="#/page/stores">${icon('pin')} Store locator</a></li><li><a href="#/page/contact">Contact us</a></li></ul>`;
  }

  function updateCounts() {
    const cartN = state.cart.reduce((n, l) => n + l.qty, 0);
    $$('[data-count="cart"]').forEach((el) => { el.textContent = cartN; el.hidden = !cartN; });
    $$('[data-count="wish"]').forEach((el) => { el.textContent = state.wish.length; el.hidden = !state.wish.length; });
  }

  /* ---------- layers (drawers, modal, search) ---------- */
  let lastFocus = null;
  function openLayer(id) {
    closeLayers(true);
    const el = document.getElementById(id);
    const scrim = $('#scrim');
    lastFocus = document.activeElement;
    el.hidden = false; scrim.hidden = id === 'search';
    void el.offsetWidth;
    el.classList.add('is-open'); scrim.classList.add('is-open');
    document.body.classList.add('lock');
    const f = el.querySelector('input, [data-autofocus], button, a[href]');
    if (f) f.focus({ preventScroll: true });
  }
  function closeLayers(silent) {
    const open = $$('.layer.is-open');
    if (!open.length) return;
    open.forEach((el) => {
      el.classList.remove('is-open');
      if (el.dataset.layer === 'hide') setTimeout(() => { if (!el.classList.contains('is-open')) el.hidden = true; }, 280);
    });
    const scrim = $('#scrim');
    scrim.classList.remove('is-open');
    setTimeout(() => { if (!scrim.classList.contains('is-open')) scrim.hidden = true; }, 280);
    document.body.classList.remove('lock');
    if (!silent && lastFocus && document.contains(lastFocus)) lastFocus.focus({ preventScroll: true });
  }

  let toastTimer;
  function toast(msg) {
    const t = $('#toast');
    t.innerHTML = msg;
    t.classList.add('is-on');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove('is-on'), 2600);
  }

  /* ---------- cart ---------- */
  function addToCart(id, size, qty = 1) {
    const p = byId[id];
    if (!p) return;
    const key = id + '|' + (size || '');
    const line = state.cart.find((l) => l.key === key);
    if (line) line.qty = Math.min(10, line.qty + qty);
    else state.cart.push({ key, id, size: size || null, qty });
    saveCart();
    renderCart();
    openLayer('cart');
  }
  function cartTotals(method = 'standard') {
    const subtotal = state.cart.reduce((s, l) => s + unitPrice(byId[l.id]) * l.qty, 0);
    const discount = state.promo ? Math.round(subtotal * SHIPPING.promo.pct / 100) : 0;
    const shipping = !subtotal ? 0 : method === 'express' ? SHIPPING.express : subtotal >= SHIPPING.freeOver ? 0 : SHIPPING.standard;
    return { subtotal, discount, shipping, total: subtotal - discount + shipping };
  }
  function renderCart() {
    const n = state.cart.reduce((a, l) => a + l.qty, 0);
    $('#cart-count-label').textContent = n ? `(${n})` : '';
    if (!state.cart.length) {
      $('#cart-body').innerHTML = `<div class="empty"><p class="empty-title">Your bag is empty</p><p>Pieces you add will show up here.</p><a class="btn btn--dark" href="#/shop/new">Shop new arrivals</a></div>`;
      $('#cart-foot').innerHTML = '';
      return;
    }
    const t = cartTotals();
    const left = SHIPPING.freeOver - t.subtotal;
    const pct = Math.min(100, (t.subtotal / SHIPPING.freeOver) * 100);
    $('#cart-body').innerHTML = `
      <div class="ship-meter"><p>${left > 0 ? `Add <b>${money(left)}</b> more for free delivery` : 'You’ve unlocked <b>free delivery</b>'}</p><div class="meter"><span style="width:${pct}%"></span></div></div>
      <ul class="lines">${state.cart.map(lineHTML).join('')}</ul>`;
    $('#cart-foot').innerHTML = `
      <div class="sum-row"><span>Subtotal</span><b>${money(t.subtotal)}</b></div>
      ${t.discount ? `<div class="sum-row"><span>${SHIPPING.promo.code}</span><span>−${money(t.discount)}</span></div>` : ''}
      <p class="muted small">Delivery and any discount codes are applied at checkout.</p>
      <a class="btn btn--dark btn--block" href="#/checkout">Checkout · ${money(t.subtotal - t.discount)}</a>
      <button class="btn btn--ghost btn--block" data-action="close">Continue shopping</button>`;
  }
  const lineHTML = (l) => {
    const p = byId[l.id];
    return `<li class="line">
      <a class="line-img" href="#/product/${p.id}">${art(p, 'front', { decorative: true })}</a>
      <div class="line-info">
        <a class="line-name" href="#/product/${p.id}">${esc(p.name)}</a>
        <p class="muted small">${esc(p.color)}${l.size ? ' · Size ' + l.size : ' · ' + esc(p.sub)}</p>
        <div class="line-row">
          <div class="stepper" aria-label="Quantity">
            <button data-action="qty" data-key="${l.key}" data-d="-1" aria-label="Decrease quantity">${icon('minus')}</button>
            <span aria-live="polite">${l.qty}</span>
            <button data-action="qty" data-key="${l.key}" data-d="1" aria-label="Increase quantity">${icon('plus')}</button>
          </div>
          <span class="line-price">${money(unitPrice(p) * l.qty)}</span>
        </div>
        <button class="linklike small" data-action="remove" data-key="${l.key}">Remove</button>
      </div></li>`;
  };

  /* ---------- views ---------- */
  let heroTimer = null;

  function viewHome() {
    const slides = [
      { eyebrow: "Winter Khaddar '26", title: 'Warm weaves,<br><em>printed by hand</em>', text: 'Block-printed khaddar and karandi in madder, indigo and old gold. Ready to wear or unstitched.', cta: ['Shop Ready to Wear', '#/shop/ready-to-wear'], cta2: ['Shop Unstitched', '#/shop/unstitched'], items: ['bs-108', 'bs-101'], bg: '#3B1420', ink: '#E8C27A', motif: 'ajrak' },
      { eyebrow: 'The Festive Edit', title: 'Dressed for<br><em>the shaadi season</em>', text: 'Organza, chiffon and velvet with tilla and zari work for mehndi, baraat and walima.', cta: ['Shop Festive', '#/shop/festive'], cta2: ['View new arrivals', '#/shop/new'], items: ['bs-302', 'bs-301'], bg: '#13262A', ink: '#D4AF6A', motif: 'floral' },
      { eyebrow: 'Unstitched', title: 'Three pieces,<br><em>your tailor’s cut</em>', text: 'Shirt, trousers and dupatta fabric from PKR 3,990. Cut to your own measurements.', cta: ['Shop Unstitched', '#/shop/unstitched'], cta2: ['See the size guide', '#size-guide'], items: ['bs-202', 'bs-201'], bg: '#2E2F1A', ink: '#E4D3A3', motif: 'jaal' }
    ];
    const tiles = [
      { label: 'New In', href: '#/shop/new', o: { motif: 'floral', base: '#EFE6D6', ink: '#7A2E3A' } },
      ...CATEGORIES.map((c) => ({ label: c.name, href: '#/shop/' + c.slug, o: c })),
      { label: 'Sale', href: '#/shop/sale', o: { motif: 'stripe', base: '#B3261E', ink: '#F4E3D7' } }
    ];
    const fabrics = ['Khaddar', 'Karandi', 'Cambric', 'Lawn', 'Linen', 'Velvet', 'Chiffon', 'Organza'];
    const fabricSample = (f) => PRODUCTS.find((p) => p.fabric === f);
    const best = PRODUCTS.filter((p) => p.best).slice(0, 8);

    return `
    <section class="hero" aria-roledescription="carousel" aria-label="Featured collections">
      <div class="hero-track">
        ${slides.map((s, i) => `
        <div class="slide ${i === 0 ? 'is-active' : ''}" role="group" aria-roledescription="slide" aria-label="${i + 1} of ${slides.length}" style="--slide-bg:${s.bg};--slide-ink:${s.ink}" ${i ? 'aria-hidden="true"' : ''}>
          <div class="slide-pattern" aria-hidden="true" style="background-image:${esc(tileURL({ motif: s.motif, base: s.bg, ink: mix(s.bg, s.ink, 0.2) }))}"></div>
          <div class="wrap slide-inner">
            <div class="slide-copy">
              <p class="eyebrow">${s.eyebrow}</p>
              <h1 class="display">${s.title}</h1>
              <p class="slide-text">${s.text}</p>
              <div class="btn-row">
                <a class="btn btn--light" href="${s.cta[1]}" ${i ? 'tabindex="-1"' : ''}>${s.cta[0]}</a>
                ${s.cta2[1] === '#size-guide' ? `<button class="btn btn--outline-light" data-action="size-guide" ${i ? 'tabindex="-1"' : ''}>${s.cta2[0]}</button>` : `<a class="btn btn--outline-light" href="${s.cta2[1]}" ${i ? 'tabindex="-1"' : ''}>${s.cta2[0]}</a>`}
              </div>
            </div>
            <div class="slide-figs">
              ${s.items.map((id, k) => `<a class="slide-fig slide-fig--${k}" href="#/product/${id}" tabindex="-1" aria-hidden="true">${art(byId[id], 'front', { decorative: true, bg: mix(byId[id].base, '#F4F1EC', 0.8) })}</a>`).join('')}
            </div>
          </div>
        </div>`).join('')}
      </div>
      <div class="wrap hero-controls">
        <div class="dots" role="tablist" aria-label="Choose slide">${slides.map((s, i) => `<button role="tab" class="dot ${i === 0 ? 'is-active' : ''}" data-action="slide" data-i="${i}" aria-selected="${i === 0}" aria-label="Show slide ${i + 1}: ${s.eyebrow}"></button>`).join('')}</div>
        <div class="hero-arrows">
          <button class="icon-btn" data-action="slide-step" data-d="-1" aria-label="Previous slide">${icon('left')}</button>
          <button class="icon-btn" data-action="hero-pause" aria-label="Pause slideshow" aria-pressed="false"><span class="pause-ico" aria-hidden="true"></span></button>
          <button class="icon-btn" data-action="slide-step" data-d="1" aria-label="Next slide">${icon('right')}</button>
        </div>
      </div>
    </section>

    <section class="section wrap" aria-labelledby="cats-h">
      <h2 id="cats-h" class="sr">Shop by category</h2>
      <ul class="cat-row">${tiles.map((t) => `<li><a class="cat" href="${t.href}"><span class="cat-swatch">${swatch(t.o)}</span><span>${esc(t.label)}</span></a></li>`).join('')}</ul>
    </section>

    <section class="section wrap" aria-labelledby="new-h">
      <div class="section-head">
        <div><p class="eyebrow">Just landed</p><h2 id="new-h" class="h2">New arrivals</h2></div>
        <div class="tabs" role="tablist" aria-label="Filter new arrivals">
          ${[['all', 'All'], ['ready-to-wear', 'Ready to Wear'], ['unstitched', 'Unstitched'], ['festive', 'Festive'], ['accessories', 'Accessories']].map(([k, l], i) => `<button role="tab" class="tab ${i === 0 ? 'is-active' : ''}" aria-selected="${i === 0}" data-action="new-tab" data-tab="${k}">${l}</button>`).join('')}
        </div>
      </div>
      <div class="rail">
        <button class="icon-btn rail-btn rail-btn--prev" data-action="rail" data-d="-1" aria-label="Scroll left">${icon('left')}</button>
        <div class="rail-track" id="new-track">${newArrivals('all')}</div>
        <button class="icon-btn rail-btn rail-btn--next" data-action="rail" data-d="1" aria-label="Scroll right">${icon('right')}</button>
      </div>
    </section>

    <section class="section wrap promo-split">
      ${[
        { p: byId['bs-204'], eyebrow: 'Unstitched · 3 Piece', title: 'Ajrak, as it should be', text: 'Madder red and indigo blocks on soft khaddar, with a full ajrak dupatta.', href: '#/shop/unstitched?fabric=Khaddar', cta: 'Shop khaddar sets', view: 'detail' },
        { p: byId['bs-303'], eyebrow: 'Festive Edit', title: 'Velvet after dark', text: 'Midnight and black velvet with gold jaal work, for the cold-weather weddings.', href: '#/shop/festive?fabric=Velvet', cta: 'Shop velvet', view: 'front' }
      ].map((b) => `
        <a class="promo" href="${b.href}">
          <span class="promo-art">${art(b.p, b.view, { decorative: true })}</span>
          <span class="promo-copy"><span class="eyebrow">${b.eyebrow}</span><span class="h3">${b.title}</span><span>${b.text}</span><span class="link-arrow">${b.cta} ${icon('right')}</span></span>
        </a>`).join('')}
    </section>

    <section class="section wrap" aria-labelledby="fab-h">
      <div class="section-head"><div><p class="eyebrow">Know your cloth</p><h2 id="fab-h" class="h2">Shop by fabric</h2></div></div>
      <ul class="fabric-row">${fabrics.map((f) => { const s = fabricSample(f); return `<li><a class="fabric" href="#/shop/all?fabric=${encodeURIComponent(f)}"><span class="fabric-sw">${swatch(s)}</span><span class="fabric-name">${f}</span><span class="fabric-note">${esc(D.FABRIC_NOTES[f].split('.')[0])}</span></a></li>`; }).join('')}</ul>
    </section>

    <section class="section wrap" aria-labelledby="best-h">
      <div class="section-head"><div><p class="eyebrow">Most loved</p><h2 id="best-h" class="h2">Bestsellers</h2></div><a class="link-arrow" href="#/shop/all?sort=best">View all ${icon('right')}</a></div>
      <div class="grid grid--4">${best.map(card).join('')}</div>
    </section>

    <section class="story">
      <div class="wrap story-inner">
        <div class="story-art" aria-hidden="true" style="background-image:${esc(tileURL({ motif: 'ajrak', base: '#5C1A1F', ink: '#1A1A2E' }))}"></div>
        <div class="story-copy">
          <p class="eyebrow">Our story</p>
          <h2 class="display display--md">Bint e Safia means <em>daughter of Safia</em>.</h2>
          <p>The label began with one woman’s wardrobe: hand-printed kurtas, a trunk of dupattas and a tailor who knew every measurement by heart. We make clothes in that spirit, in fabrics that feel good on day one and better on day one hundred.</p>
          <a class="btn btn--outline" href="#/page/about">Read our story</a>
        </div>
      </div>
    </section>

    <section class="wrap perks" aria-label="Why shop with us">
      ${[['truck', 'Nationwide delivery', '2–5 working days. Free over PKR 5,000.'], ['cash', 'Cash on delivery', 'Pay when your parcel arrives.'], ['swap', '30-day exchange', 'Size or colour, swapped in store or by courier.'], ['pin', 'Visit a store', 'Lahore, Karachi and Islamabad.']].map(([i, t, d]) => `<div class="perk">${icon(i)}<div><p class="perk-t">${t}</p><p class="muted small">${d}</p></div></div>`).join('')}
    </section>`;
  }

  const newArrivals = (tab) => {
    const list = PRODUCTS.filter((p) => p.isNew && (tab === 'all' || p.cat === tab));
    const fill = list.length >= 4 ? list : [...list, ...PRODUCTS.filter((p) => !p.isNew && (tab === 'all' || p.cat === tab))].slice(0, 6);
    return fill.map(card).join('');
  };

  function initHero() {
    clearInterval(heroTimer);
    const slides = $$('.slide');
    if (!slides.length) return;
    let i = 0, paused = reduceMotion;
    const go = (n) => {
      i = (n + slides.length) % slides.length;
      slides.forEach((s, k) => {
        s.classList.toggle('is-active', k === i);
        s.setAttribute('aria-hidden', k !== i);
        $$('a.btn, button.btn', s).forEach((a) => (k === i ? a.removeAttribute('tabindex') : a.setAttribute('tabindex', '-1')));
      });
      $$('.dot').forEach((d, k) => { d.classList.toggle('is-active', k === i); d.setAttribute('aria-selected', k === i); });
    };
    const start = () => { clearInterval(heroTimer); if (!paused) heroTimer = setInterval(() => go(i + 1), 6500); };
    const pauseBtn = $('[data-action="hero-pause"]');
    const setPaused = (v) => { paused = v; pauseBtn.setAttribute('aria-pressed', v); pauseBtn.setAttribute('aria-label', v ? 'Play slideshow' : 'Pause slideshow'); pauseBtn.classList.toggle('is-paused', v); start(); };
    setPaused(paused);
    hero.go = (n) => { go(n); start(); };
    hero.step = (d) => { go(i + d); start(); };
    hero.toggle = () => setPaused(!paused);
    // swipe
    let x0 = null;
    const track = $('.hero-track');
    track.addEventListener('touchstart', (e) => { x0 = e.touches[0].clientX; }, { passive: true });
    track.addEventListener('touchend', (e) => { if (x0 === null) return; const dx = e.changedTouches[0].clientX - x0; if (Math.abs(dx) > 40) hero.step(dx < 0 ? 1 : -1); x0 = null; });
  }
  const hero = { go() {}, step() {}, toggle() {} };

  /* shop */
  const SORTS = [['featured', 'Featured'], ['new', 'Newest'], ['best', 'Bestsellers'], ['price-asc', 'Price: low to high'], ['price-desc', 'Price: high to low']];
  let shop = null;

  function shopBase(slug) {
    if (slug === 'new') return { title: 'New In', blurb: 'The latest pieces, added every week.', list: PRODUCTS.filter((p) => p.isNew) };
    if (slug === 'sale') return { title: 'Sale', blurb: 'Last pieces at up to 30% off. Exchange only on sale items.', list: PRODUCTS.filter((p) => p.sale) };
    const c = CATEGORIES.find((x) => x.slug === slug);
    if (c) return { title: c.name, blurb: c.blurb, list: PRODUCTS.filter((p) => p.cat === slug) };
    return { title: 'All products', blurb: 'Everything from Bint e Safia, in one place.', list: PRODUCTS.slice() };
  }

  function viewShop(slug, params) {
    const base = shopBase(slug);
    const f = {
      sub: params.getAll('sub'), fabric: params.getAll('fabric'), size: params.getAll('size'), color: params.getAll('color'),
      max: Number(params.get('max')) || null, sale: params.get('sale') === '1', q: params.get('q') || '', sort: params.get('sort') || 'featured'
    };
    shop = { slug, base, f, shown: 12, cols: Number(store.get('bes_cols', 3)) };
    const uniq = (k) => [...new Set(base.list.map((p) => p[k]))];
    const maxPrice = Math.max(...base.list.map(unitPrice), 1000);
    const priceCap = Math.ceil(maxPrice / 1000) * 1000;
    const stitched = base.list.some(isStitched);
    const group = (title, body, open = true) => `<details class="fgroup" ${open ? 'open' : ''}><summary>${title}${icon('plus')}</summary><div class="fgroup-body">${body}</div></details>`;
    const checks = (name, values) => values.map((v) => `<label class="check"><input type="checkbox" name="${name}" value="${esc(v)}" ${f[name].includes(v) ? 'checked' : ''}><span>${esc(v)}</span><span class="muted">${base.list.filter((p) => p[name] === v).length}</span></label>`).join('');

    return `
    <section class="wrap shop">
      ${crumbs([['Home', '#/'], [f.q ? `Search: “${f.q}”` : base.title, '#']])}
      <header class="shop-head">
        <h1 class="h1">${f.q ? `Results for “${esc(f.q)}”` : esc(base.title)}</h1>
        <p class="muted">${esc(base.blurb)}</p>
      </header>
      <div class="toolbar">
        <button class="btn btn--ghost btn--sm filter-toggle" data-action="open-filters" aria-controls="filters">${icon('filter')} Filters <span class="fcount" id="fcount"></span></button>
        <p class="muted" id="result-count" aria-live="polite"></p>
        <div class="toolbar-right">
          <label class="sort"><span class="sr">Sort by</span><select id="sort">${SORTS.map(([k, l]) => `<option value="${k}" ${f.sort === k ? 'selected' : ''}>${l}</option>`).join('')}</select></label>
          <div class="cols hide-sm" role="group" aria-label="Grid density">
            <button class="icon-btn ${shop.cols === 2 ? 'is-on' : ''}" data-action="cols" data-n="2" aria-label="Two per row" aria-pressed="${shop.cols === 2}">${icon('grid2')}</button>
            <button class="icon-btn ${shop.cols !== 2 ? 'is-on' : ''}" data-action="cols" data-n="3" aria-label="Three per row" aria-pressed="${shop.cols !== 2}">${icon('grid3')}</button>
          </div>
        </div>
      </div>
      <div class="shop-layout">
        <aside class="filters layer" id="filters" aria-label="Filters">
          <div class="drawer-head filters-head"><span class="drawer-title">Filters</span><button class="icon-btn" data-action="close" aria-label="Close filters">${icon('close')}</button></div>
          <form id="filter-form" class="filters-body">
            ${uniq('sub').length > 1 ? group('Type', checks('sub', uniq('sub'))) : ''}
            ${group('Fabric', checks('fabric', uniq('fabric').sort()))}
            ${stitched ? group('Size', `<div class="chips">${SIZES.map((s) => `<label class="chip"><input type="checkbox" name="size" value="${s}" ${f.size.includes(s) ? 'checked' : ''}><span>${s}</span></label>`).join('')}</div><p class="muted small">Size filters show stitched pieces only.</p>`) : ''}
            ${group('Colour', `<div class="colors">${uniq('color').map((c) => `<label class="color" title="${c}"><input type="checkbox" name="color" value="${c}" ${f.color.includes(c) ? 'checked' : ''}><span class="color-dot" style="--c:${COLORS[c]}"></span><span class="color-name">${c}</span></label>`).join('')}</div>`)}
            ${group('Price', `<label class="range"><span>Up to <b id="max-out">${money(f.max || priceCap)}</b></span><input type="range" id="max" name="max" min="1000" max="${priceCap}" step="500" value="${f.max || priceCap}" aria-label="Maximum price"></label><label class="check"><input type="checkbox" name="sale" value="1" ${f.sale ? 'checked' : ''}><span>On sale only</span></label>`)}
          </form>
          <div class="filters-foot"><button class="btn btn--ghost" data-action="clear-filters">Clear all</button><button class="btn btn--dark" data-action="close" id="apply-filters">Show results</button></div>
        </aside>
        <div class="shop-main">
          <div class="active-chips" id="active-chips"></div>
          <div class="grid grid--${shop.cols}" id="shop-grid"></div>
          <div class="more" id="more"></div>
        </div>
      </div>
    </section>`;
  }

  function filteredList() {
    const { base, f } = shop;
    const q = f.q.toLowerCase().trim();
    let list = base.list.filter((p) =>
      (!f.sub.length || f.sub.includes(p.sub)) &&
      (!f.fabric.length || f.fabric.includes(p.fabric)) &&
      (!f.color.length || f.color.includes(p.color)) &&
      (!f.size.length || (isStitched(p) && f.size.some((s) => !soldOut(p).includes(s)))) &&
      (!f.max || unitPrice(p) <= f.max) &&
      (!f.sale || p.sale) &&
      (!q || [p.name, p.fabric, p.color, p.sub, catName[p.cat], p.collection].join(' ').toLowerCase().includes(q))
    );
    const s = f.sort;
    if (s === 'price-asc') list.sort((a, b) => unitPrice(a) - unitPrice(b));
    if (s === 'price-desc') list.sort((a, b) => unitPrice(b) - unitPrice(a));
    if (s === 'new') list.sort((a, b) => b.isNew - a.isNew);
    if (s === 'best') list.sort((a, b) => b.best - a.best);
    return list;
  }

  function renderShopGrid() {
    const list = filteredList();
    const { f } = shop;
    const grid = $('#shop-grid');
    grid.className = `grid grid--${shop.cols}`;
    grid.innerHTML = list.length
      ? list.slice(0, shop.shown).map(card).join('')
      : `<div class="empty"><p class="empty-title">No pieces match these filters</p><p>Try removing a filter or widening the price range.</p><button class="btn btn--dark" data-action="clear-filters">Clear filters</button></div>`;
    $('#result-count').textContent = `${list.length} ${list.length === 1 ? 'piece' : 'pieces'}`;
    $('#more').innerHTML = list.length > shop.shown ? `<p class="muted small">Showing ${shop.shown} of ${list.length}</p><button class="btn btn--outline" data-action="load-more">Load more</button>` : '';
    const chips = [
      ...['sub', 'fabric', 'size', 'color'].flatMap((k) => f[k].map((v) => [k, v, v])),
      ...(f.max ? [['max', '', 'Up to ' + money(f.max)]] : []),
      ...(f.sale ? [['sale', '', 'On sale']] : []),
      ...(f.q ? [['q', '', `“${f.q}”`]] : [])
    ];
    $('#active-chips').innerHTML = chips.length ? chips.map(([k, v, l]) => `<button class="achip" data-action="rm-filter" data-k="${k}" data-v="${esc(v)}" aria-label="Remove filter ${esc(l)}">${esc(l)} ${icon('close')}</button>`).join('') + '<button class="linklike small" data-action="clear-filters">Clear all</button>' : '';
    const n = chips.filter((c) => c[0] !== 'q').length;
    $('#fcount').textContent = n ? `(${n})` : '';
    // keep URL shareable without re-rendering the page
    const qs = new URLSearchParams();
    ['sub', 'fabric', 'size', 'color'].forEach((k) => f[k].forEach((v) => qs.append(k, v)));
    if (f.max) qs.set('max', f.max);
    if (f.sale) qs.set('sale', '1');
    if (f.q) qs.set('q', f.q);
    if (f.sort !== 'featured') qs.set('sort', f.sort);
    const h = `#/shop/${shop.slug}${qs.toString() ? '?' + qs : ''}`;
    try { history.replaceState(null, '', h); } catch (e) { /* sandboxed */ }
  }

  function readFilterForm() {
    const form = $('#filter-form');
    const fd = new FormData(form);
    const f = shop.f;
    ['sub', 'fabric', 'size', 'color'].forEach((k) => { f[k] = fd.getAll(k); });
    const max = Number($('#max').value);
    f.max = max < Number($('#max').max) ? max : null;
    f.sale = fd.get('sale') === '1';
    shop.shown = 12;
    renderShopGrid();
  }

  /* product */
  function viewProduct(id) {
    const p = byId[id];
    if (!p) return viewNotFound();
    const views = kindOf(p) === 'kurta' ? ['front', 'detail', 'fabric'] : [kindOf(p), 'detail'];
    const out = soldOut(p);
    const related = PRODUCTS.filter((x) => x.id !== p.id && (x.cat === p.cat || x.fabric === p.fabric)).sort((a, b) => (b.cat === p.cat) - (a.cat === p.cat)).slice(0, 4);
    const care = ['Velvet', 'Organza', 'Chiffon', 'Raw Silk'].includes(p.fabric) ? D.CARE.delicate : D.CARE.default;
    return `
    <section class="wrap pdp-wrap">
      ${crumbs([['Home', '#/'], [catName[p.cat], '#/shop/' + p.cat], [p.name, '#']])}
      <div class="pdp">
        <div class="gallery">
          <div class="thumbs" role="tablist" aria-label="Product images">${views.map((v, i) => `<button role="tab" class="thumb ${i === 0 ? 'is-active' : ''}" aria-selected="${i === 0}" data-action="gallery" data-i="${i}" aria-label="Image ${i + 1}">${art(p, v, { decorative: true })}</button>`).join('')}</div>
          <div class="stage" id="stage">${views.map((v, i) => `<div class="stage-img ${i === 0 ? 'is-active' : ''}" data-zoom>${art(p, v)}</div>`).join('')}${badges(p)}</div>
        </div>
        <div class="pdp-info">
          <p class="eyebrow">${esc(p.collection)}</p>
          <h1 class="h1 pdp-title">${esc(p.name)}</h1>
          <p class="muted small">SKU ${p.id.toUpperCase()} · ${esc(p.sub)} · ${esc(p.fabric)}</p>
          <div class="pdp-price">${priceHTML(p)}</div>
          <p class="muted small">Inclusive of all taxes.</p>
          <div class="pdp-colour"><span class="color-dot" style="--c:${COLORS[p.color]}"></span> Colour: <b>${esc(p.color)}</b></div>
          ${isStitched(p) ? `
          <fieldset class="sizes" id="sizes">
            <legend><span>Size</span><button type="button" class="linklike small" data-action="size-guide">Size guide</button></legend>
            <div class="chips">${SIZES.map((s) => `<label class="chip ${out.includes(s) ? 'is-out' : ''}"><input type="radio" name="size" value="${s}" ${out.includes(s) ? 'disabled' : ''}><span>${s}</span></label>`).join('')}</div>
            ${out.length ? `<p class="muted small">Size ${out.join(', ')} is sold out.</p>` : ''}
            <p class="field-error" id="size-error" hidden>Choose a size to continue.</p>
          </fieldset>` : `<p class="pdp-note">${p.cat === 'unstitched' ? 'Unstitched fabric · ' + p.pieces + ' pieces' : 'One size'}</p>`}
          <div class="buy-row">
            <div class="stepper stepper--lg" aria-label="Quantity">
              <button data-action="pdp-qty" data-d="-1" aria-label="Decrease quantity">${icon('minus')}</button>
              <span id="pdp-qty" aria-live="polite">1</span>
              <button data-action="pdp-qty" data-d="1" aria-label="Increase quantity">${icon('plus')}</button>
            </div>
            <button class="btn btn--dark btn--grow" data-action="add" data-id="${p.id}">Add to bag</button>
            ${wishBtn(p).replace('class="wish', 'class="wish wish--box')}
          </div>
          <ul class="pdp-perks">
            <li>${icon('truck')} Dispatched in 1–2 working days. Free delivery over PKR 5,000.</li>
            <li>${icon('cash')} Cash on delivery available.</li>
            <li>${icon('swap')} Exchange within 30 days of delivery.</li>
          </ul>
          <div class="accordion">
            <details open><summary>Description${icon('plus')}</summary><div><p>${esc(p.desc)}</p></div></details>
            <details><summary>Fabric &amp; care${icon('plus')}</summary><div><p><b>${esc(p.fabric)}.</b> ${esc(D.FABRIC_NOTES[p.fabric] || '')}</p><ul>${care.map((c) => `<li>${c}</li>`).join('')}</ul><p class="muted small">Actual colours may vary slightly from your screen. Embellishments are handwork, so small irregularities are part of the piece.</p></div></details>
            <details><summary>Delivery &amp; exchange${icon('plus')}</summary><div><p>Standard delivery takes 2–5 working days across Pakistan (PKR ${SHIPPING.standard}, free over PKR 5,000). Express delivery to major cities takes 1–2 days (PKR ${SHIPPING.express}).</p><p>Unworn pieces with tags can be exchanged within 30 days. Sale items are exchange only.</p></div></details>
          </div>
        </div>
      </div>
    </section>
    <section class="section wrap" aria-labelledby="rel-h">
      <div class="section-head"><div><p class="eyebrow">Complete the look</p><h2 id="rel-h" class="h2">You may also like</h2></div></div>
      <div class="grid grid--4">${related.map(card).join('')}</div>
    </section>`;
  }

  function initProduct() {
    $$('[data-zoom]').forEach((el) => {
      el.addEventListener('mousemove', (e) => {
        const r = el.getBoundingClientRect();
        el.style.setProperty('--zx', ((e.clientX - r.left) / r.width) * 100 + '%');
        el.style.setProperty('--zy', ((e.clientY - r.top) / r.height) * 100 + '%');
        el.classList.add('is-zoom');
      });
      el.addEventListener('mouseleave', () => el.classList.remove('is-zoom'));
    });
    let x0 = null;
    const stage = $('#stage');
    stage.addEventListener('touchstart', (e) => { x0 = e.touches[0].clientX; }, { passive: true });
    stage.addEventListener('touchend', (e) => {
      if (x0 === null) return;
      const dx = e.changedTouches[0].clientX - x0; x0 = null;
      if (Math.abs(dx) < 40) return;
      const imgs = $$('.stage-img', stage);
      const cur = imgs.findIndex((x) => x.classList.contains('is-active'));
      showImage((cur + (dx < 0 ? 1 : -1) + imgs.length) % imgs.length);
    });
  }
  function showImage(i) {
    $$('.stage-img').forEach((el, k) => el.classList.toggle('is-active', k === i));
    $$('.thumb').forEach((el, k) => { el.classList.toggle('is-active', k === i); el.setAttribute('aria-selected', k === i); });
  }

  /* wishlist */
  function viewWishlist() {
    const list = state.wish.map((id) => byId[id]).filter(Boolean);
    return `<section class="wrap shop">
      ${crumbs([['Home', '#/'], ['Wishlist', '#']])}
      <header class="shop-head"><h1 class="h1">Wishlist</h1><p class="muted">${list.length ? `${list.length} saved ${list.length === 1 ? 'piece' : 'pieces'}. Saved on this device.` : 'Tap the heart on any piece to save it here.'}</p></header>
      ${list.length ? `<div class="grid grid--4">${list.map(card).join('')}</div>` : `<div class="empty"><p class="empty-title">Nothing saved yet</p><a class="btn btn--dark" href="#/shop/new">Browse new arrivals</a></div>`}
    </section>`;
  }

  /* checkout */
  function viewCheckout() {
    if (!state.cart.length) {
      return `<section class="wrap shop"><div class="empty"><p class="empty-title">Your bag is empty</p><p>Add a few pieces before checking out.</p><a class="btn btn--dark" href="#/shop/new">Shop new arrivals</a></div></section>`;
    }
    const field = (id, label, type = 'text', attrs = '', full = false) => `<div class="field ${full ? 'field--full' : ''}"><label for="co-${id}">${label}</label><input id="co-${id}" name="${id}" type="${type}" ${attrs}><p class="field-error" data-error="${id}" hidden></p></div>`;
    return `
    <section class="wrap checkout">
      ${crumbs([['Home', '#/'], ['Checkout', '#']])}
      <h1 class="h1">Checkout</h1>
      <div class="co-layout">
        <form class="co-form" id="co-form" novalidate>
          <fieldset><legend>Contact</legend><div class="fields">
            ${field('email', 'Email', 'email', 'autocomplete="email" required')}
            ${field('phone', 'Mobile number', 'tel', 'autocomplete="tel" placeholder="03XX XXXXXXX" required')}
          </div></fieldset>
          <fieldset><legend>Delivery address</legend><div class="fields">
            ${field('first', 'First name', 'text', 'autocomplete="given-name" required')}
            ${field('last', 'Last name', 'text', 'autocomplete="family-name" required')}
            ${field('address', 'Address', 'text', 'autocomplete="street-address" placeholder="House, street, area" required', true)}
            <div class="field"><label for="co-city">City</label><select id="co-city" name="city" required><option value="">Select city</option>${D.CITIES.map((c) => `<option>${c}</option>`).join('')}</select><p class="field-error" data-error="city" hidden></p></div>
            ${field('postal', 'Postal code (optional)', 'text', 'inputmode="numeric" autocomplete="postal-code"')}
          </div></fieldset>
          <fieldset><legend>Delivery method</legend><div class="radios">
            <label class="radio"><input type="radio" name="ship" value="standard" checked><span><b>Standard</b><span class="muted small">2–5 working days</span></span><span id="ship-std"></span></label>
            <label class="radio"><input type="radio" name="ship" value="express"><span><b>Express</b><span class="muted small">1–2 working days, major cities</span></span><span>${money(SHIPPING.express)}</span></label>
          </div></fieldset>
          <fieldset><legend>Payment</legend><div class="radios">
            <label class="radio"><input type="radio" name="pay" value="Cash on delivery" checked><span><b>Cash on delivery</b><span class="muted small">Pay the courier in cash</span></span></label>
            <label class="radio"><input type="radio" name="pay" value="Debit / credit card"><span><b>Debit / credit card</b><span class="muted small">Visa, Mastercard</span></span></label>
            <label class="radio"><input type="radio" name="pay" value="JazzCash / Easypaisa"><span><b>JazzCash / Easypaisa</b><span class="muted small">Mobile wallet</span></span></label>
          </div></fieldset>
          <button class="btn btn--dark btn--block btn--lg" type="submit" id="place">Place order</button>
          <p class="muted small center">Demo storefront: placing an order here does not charge you or ship anything.</p>
        </form>
        <aside class="co-summary" aria-label="Order summary">
          <h2 class="h3">Order summary</h2>
          <ul class="lines lines--compact">${state.cart.map((l) => { const p = byId[l.id]; return `<li class="line"><span class="line-img">${art(p, 'front', { decorative: true })}<span class="qty-badge">${l.qty}</span></span><div class="line-info"><span class="line-name">${esc(p.name)}</span><p class="muted small">${l.size ? 'Size ' + l.size : esc(p.sub)}</p></div><span class="line-price">${money(unitPrice(p) * l.qty)}</span></li>`; }).join('')}</ul>
          <form class="promo-form" id="promo-form" novalidate>
            <label class="sr" for="promo">Discount code</label>
            <input id="promo" name="promo" placeholder="Discount code" value="${state.promo ? SHIPPING.promo.code : ''}" autocomplete="off">
            <button class="btn btn--outline" type="submit">Apply</button>
          </form>
          <p class="field-error" id="promo-msg" hidden></p>
          <div id="co-totals"></div>
        </aside>
      </div>
    </section>`;
  }
  function renderTotals() {
    const method = ($('input[name="ship"]:checked') || {}).value || 'standard';
    const t = cartTotals(method);
    const std = cartTotals('standard').shipping;
    $('#ship-std').textContent = std ? money(std) : 'Free';
    $('#co-totals').innerHTML = `
      <div class="sum-row"><span>Subtotal</span><span>${money(t.subtotal)}</span></div>
      ${t.discount ? `<div class="sum-row"><span>Discount (${SHIPPING.promo.code}) <button class="linklike small" data-action="rm-promo">Remove</button></span><span>−${money(t.discount)}</span></div>` : ''}
      <div class="sum-row"><span>Delivery</span><span>${t.shipping ? money(t.shipping) : 'Free'}</span></div>
      <div class="sum-row sum-row--total"><span>Total</span><b>${money(t.total)}</b></div>`;
    $('#place').textContent = `Place order · ${money(t.total)}`;
  }
  function validateCheckout(form) {
    const v = Object.fromEntries(new FormData(form));
    const errs = {};
    if (!/^\S+@\S+\.\S+$/.test(v.email || '')) errs.email = 'Enter an email like name@example.com.';
    if (!/^(\+92|0)3\d{9}$/.test((v.phone || '').replace(/[\s-]/g, ''))) errs.phone = 'Enter a Pakistani mobile number, e.g. 0300 1234567.';
    if (!(v.first || '').trim()) errs.first = 'Enter your first name.';
    if (!(v.last || '').trim()) errs.last = 'Enter your last name.';
    if ((v.address || '').trim().length < 8) errs.address = 'Enter your full address so the courier can find you.';
    if (!v.city) errs.city = 'Select your city.';
    $$('[data-error]', form).forEach((el) => { const m = errs[el.dataset.error]; el.hidden = !m; el.textContent = m || ''; const input = form.elements[el.dataset.error]; if (input) input.setAttribute('aria-invalid', !!m); });
    return { ok: !Object.keys(errs).length, v, first: Object.keys(errs)[0] };
  }

  function viewOrder(no) {
    const o = state.lastOrder;
    if (!o || o.no !== no) return viewNotFound();
    return `<section class="wrap confirm">
      <div class="confirm-mark">${icon('check')}</div>
      <p class="eyebrow">Order ${esc(o.no)}</p>
      <h1 class="h1">Thank you, ${esc(o.first)}</h1>
      <p>Your order is confirmed. We’ll send updates to <b>${esc(o.email)}</b> and <b>${esc(o.phone)}</b>.</p>
      <div class="confirm-card">
        <div class="sum-row"><span>Delivering to</span><span>${esc(o.address)}, ${esc(o.city)}</span></div>
        <div class="sum-row"><span>Payment</span><span>${esc(o.pay)}</span></div>
        <div class="sum-row"><span>Items</span><span>${o.items}</span></div>
        <div class="sum-row sum-row--total"><span>Total</span><b>${money(o.total)}</b></div>
      </div>
      <p class="muted small">Demo storefront: no payment was taken and nothing will ship.</p>
      <a class="btn btn--dark" href="#/shop/new">Continue shopping</a>
    </section>`;
  }

  /* info pages */
  const PAGES = {
    about: { title: 'Our story', body: `
      <p class="lede">Bint e Safia means <em>daughter of Safia</em>. The label grew out of one woman’s wardrobe and the habits that came with it: buy good cloth, find a good tailor, wear it often.</p>
      <p>We design for everyday life in Pakistan, from a cold January morning in Lahore to a humid evening mehndi in Karachi. That means honest fabrics like khaddar, karandi and cambric, prints that draw on ajrak and block-printing traditions, and festive pieces that you will want to wear again.</p>
      <h2 class="h3">What we care about</h2>
      <ul><li><b>Cloth first.</b> We choose fabric for how it feels and wears, then design around it.</li><li><b>Fit that forgives.</b> Our stitched pieces are cut with room to move and graded across five sizes.</li><li><b>Pieces that last.</b> Fewer, better drops, and exchanges when something isn’t right.</li></ul>` },
    contact: { title: 'Contact us', body: `
      <p class="lede">Questions about sizing, an order or an exchange? Send us a message and our team will get back to you.</p>
      <div class="contact-grid">
        <form class="co-form" data-form="contact" novalidate><div class="fields">
          <div class="field"><label for="ct-name">Name</label><input id="ct-name" name="name" autocomplete="name" required><p class="field-error" data-error="name" hidden></p></div>
          <div class="field"><label for="ct-email">Email</label><input id="ct-email" name="email" type="email" autocomplete="email" required><p class="field-error" data-error="email" hidden></p></div>
          <div class="field field--full"><label for="ct-order">Order number (optional)</label><input id="ct-order" name="order" placeholder="BES-000000"></div>
          <div class="field field--full"><label for="ct-msg">Message</label><textarea id="ct-msg" name="message" rows="5" required></textarea><p class="field-error" data-error="message" hidden></p></div>
        </div><button class="btn btn--dark" type="submit">Send message</button></form>
        <div class="contact-info"><h2 class="h3">Customer care</h2><p>Monday to Saturday, 10 am – 7 pm PKT</p><p class="muted small">Add your WhatsApp, phone and email in <code>index.html</code> / <code>app.js</code> before launch.</p></div>
      </div>` },
    faqs: { title: 'FAQs', body: `<div class="accordion">${[
      ['How long does delivery take?', 'Standard delivery takes 2–5 working days across Pakistan. Express delivery to major cities takes 1–2 working days.'],
      ['How much is delivery?', `Standard delivery is PKR ${SHIPPING.standard} and free on orders over PKR 5,000. Express delivery is PKR ${SHIPPING.express}.`],
      ['Do you offer cash on delivery?', 'Yes, nationwide. You can also pay by debit or credit card, JazzCash or Easypaisa.'],
      ['How do I choose my size?', 'Use the size guide on any product page. If you are between sizes, size up for a relaxed fit.'],
      ['Can I exchange an item?', 'Unworn pieces with tags attached can be exchanged within 30 days of delivery, in store or by courier. Sale items are exchange only.'],
      ['What comes in an unstitched 3-piece?', 'A shirt fabric (usually 3 m), trouser fabric (2.5 m) and a dupatta (2.5 m). Exact cuts are listed on each product.']
    ].map(([q, a], i) => `<details ${i === 0 ? 'open' : ''}><summary>${q}${icon('plus')}</summary><div><p>${a}</p></div></details>`).join('')}</div>` },
    shipping: { title: 'Shipping & delivery', body: `
      <div class="table-wrap"><table class="table"><thead><tr><th>Method</th><th>Time</th><th>Cost</th></tr></thead><tbody>
        <tr><td>Standard</td><td>2–5 working days</td><td>PKR ${SHIPPING.standard} · free over PKR 5,000</td></tr>
        <tr><td>Express</td><td>1–2 working days (major cities)</td><td>PKR ${SHIPPING.express}</td></tr>
      </tbody></table></div>
      <p>Orders placed before 2 pm PKT on a working day are dispatched the next working day. You will receive a tracking number by SMS and email once your parcel leaves our warehouse.</p>` },
    returns: { title: 'Returns & exchange', body: `
      <p class="lede">Not quite right? Exchange it within 30 days of delivery.</p>
      <ol><li>Keep the piece unworn and unwashed, with tags attached.</li><li>Bring it to any store with your order number, or contact us to book a courier pick-up.</li><li>Choose a new size, colour or a different piece of equal value.</li></ol>
      <p>Sale items, unstitched fabric that has been cut, and accessories marked final sale are exchange only or non-returnable as stated on the product page.</p>` },
    stores: { title: 'Store locator', body: `<div class="stores">${D.STORES.map((s) => `<div class="store">${icon('pin')}<div><p class="eyebrow">${esc(s.city)}</p><h2 class="h3">${esc(s.name)}</h2><p>${esc(s.address)}</p><p class="muted small">Open daily, ${esc(s.hours)}</p></div></div>`).join('')}</div>` }
  };
  function viewPage(slug) {
    const pg = PAGES[slug];
    if (!pg) return viewNotFound();
    return `<section class="wrap page">${crumbs([['Home', '#/'], [pg.title, '#']])}<h1 class="h1">${pg.title}</h1><div class="prose">${pg.body}</div></section>`;
  }
  const viewNotFound = () => `<section class="wrap shop"><div class="empty"><p class="empty-title">We couldn’t find that page</p><p>It may have moved or sold out.</p><a class="btn btn--dark" href="#/">Back to home</a></div></section>`;

  /* modals */
  function quickView(id) {
    const p = byId[id];
    const out = soldOut(p);
    $('#modal-body').innerHTML = `
      <div class="qv">
        <div class="qv-art">${art(p)}</div>
        <div class="qv-info">
          <p class="eyebrow">${esc(catName[p.cat])} · ${esc(p.fabric)}</p>
          <h2 class="h2" id="modal-title">${esc(p.name)}</h2>
          <div class="pdp-price">${priceHTML(p)}</div>
          <p>${esc(p.desc)}</p>
          ${isStitched(p) ? `<fieldset class="sizes"><legend><span>Size</span></legend><div class="chips">${SIZES.map((s) => `<label class="chip ${out.includes(s) ? 'is-out' : ''}"><input type="radio" name="qv-size" value="${s}" ${out.includes(s) ? 'disabled' : ''}><span>${s}</span></label>`).join('')}</div><p class="field-error" id="qv-size-error" hidden>Choose a size to continue.</p></fieldset>` : ''}
          <div class="btn-row">
            <button class="btn btn--dark btn--grow" data-action="qv-add" data-id="${p.id}">Add to bag</button>
            ${wishBtn(p).replace('class="wish', 'class="wish wish--box')}
          </div>
          <a class="link-arrow" href="#/product/${p.id}">View full details ${icon('right')}</a>
        </div>
      </div>`;
    $('#modal').classList.remove('modal--narrow');
    openLayer('modal');
  }
  function sizeGuide() {
    $('#modal-body').innerHTML = `
      <h2 class="h2" id="modal-title">Size guide</h2>
      <p class="muted">Garment measurements in inches for stitched kurtas and shirts. If you’re between sizes, size up for a relaxed fit.</p>
      <div class="table-wrap"><table class="table table--num"><thead><tr><th>Size</th><th>Chest</th><th>Length</th><th>Shoulder</th><th>Sleeve</th></tr></thead>
      <tbody>${D.SIZE_CHART.map((r) => `<tr>${r.map((c, i) => i ? `<td>${c}″</td>` : `<th scope="row">${c}</th>`).join('')}</tr>`).join('')}</tbody></table></div>
      <h3 class="h3">How to measure</h3>
      <ul class="small"><li><b>Chest:</b> around the fullest part, under the arms.</li><li><b>Length:</b> from the highest shoulder point to the hem.</li><li><b>Shoulder:</b> across the back from seam to seam.</li><li><b>Sleeve:</b> from the shoulder seam to the cuff.</li></ul>`;
    $('#modal').classList.add('modal--narrow');
    openLayer('modal');
  }

  /* search */
  function renderSearch(q) {
    const body = $('#search-body');
    const term = q.toLowerCase().trim();
    if (!term) {
      body.innerHTML = `<p class="eyebrow">Popular searches</p><div class="chips chips--links">${['Khaddar', 'Ajrak', '3 Piece', 'Velvet', 'Dupatta', 'Festive'].map((s) => `<a class="achip" href="#/shop/all?q=${encodeURIComponent(s)}">${s}</a>`).join('')}</div>`;
      return;
    }
    const hits = PRODUCTS.filter((p) => [p.name, p.fabric, p.color, p.sub, catName[p.cat], p.collection, p.motif].join(' ').toLowerCase().includes(term));
    body.innerHTML = hits.length
      ? `<p class="eyebrow">${hits.length} ${hits.length === 1 ? 'result' : 'results'}</p><ul class="s-results">${hits.slice(0, 6).map((p) => `<li><a href="#/product/${p.id}"><span class="s-img">${art(p, 'front', { decorative: true })}</span><span><span class="s-name">${esc(p.name)}</span>${priceHTML(p)}</span></a></li>`).join('')}</ul>${hits.length > 6 ? `<a class="link-arrow" href="#/shop/all?q=${encodeURIComponent(q)}">See all ${hits.length} results ${icon('right')}</a>` : ''}`
      : `<p>No results for “${esc(q)}”. Try “khaddar”, “kurta” or “dupatta”.</p>`;
  }

  /* ---------- router ---------- */
  function route() {
    const raw = location.hash.replace(/^#/, '') || '/';
    if (!raw.startsWith('/')) return; // plain in-page anchors like #app
    const [pathPart, query = ''] = raw.split('?');
    const parts = pathPart.split('/').filter(Boolean);
    const params = new URLSearchParams(query);
    const app = $('#app');
    clearInterval(heroTimer);
    closeLayers(true);
    let html, title = 'Bint e Safia';
    switch (parts[0]) {
      case undefined: html = viewHome(); break;
      case 'shop': html = viewShop(parts[1] || 'all', params); title = shopBase(parts[1] || 'all').title + ' · Bint e Safia'; break;
      case 'product': html = viewProduct(parts[1]); title = (byId[parts[1]] ? byId[parts[1]].name + ' · ' : '') + 'Bint e Safia'; break;
      case 'wishlist': html = viewWishlist(); title = 'Wishlist · Bint e Safia'; break;
      case 'checkout': html = viewCheckout(); title = 'Checkout · Bint e Safia'; break;
      case 'order': html = viewOrder(parts[1]); title = 'Order confirmed · Bint e Safia'; break;
      case 'page': html = viewPage(parts[1]); title = (PAGES[parts[1]] ? PAGES[parts[1]].title + ' · ' : '') + 'Bint e Safia'; break;
      default: html = viewNotFound();
    }
    app.innerHTML = html;
    document.title = title;
    if (state.path !== pathPart) window.scrollTo(0, 0);
    state.path = pathPart;
    if (parts[0] === undefined) initHero();
    if (parts[0] === 'shop') renderShopGrid();
    if (parts[0] === 'product' && byId[parts[1]]) initProduct();
    if (parts[0] === 'checkout' && state.cart.length) renderTotals();
    $$('.nav-link').forEach((a) => a.classList.toggle('is-current', pathPart.startsWith(a.getAttribute('href').slice(1))));
  }

  /* ---------- events ---------- */
  document.addEventListener('click', (e) => {
    if (e.target.id === 'modal') return closeLayers();
    const t = e.target.closest('[data-action]');
    if (!t) {
      // following a link inside a drawer or the search closes it
      const a = e.target.closest('a[href^="#/"]');
      if (a && a.closest('.layer')) closeLayers(true);
      return;
    }
    const a = t.dataset.action;
    const id = t.dataset.id;
    switch (a) {
      case 'open-menu': openLayer('menu'); break;
      case 'open-search': openLayer('search'); renderSearch($('#search-input').value); break;
      case 'open-cart': renderCart(); openLayer('cart'); break;
      case 'open-filters': openLayer('filters'); break;
      case 'close': closeLayers(); break;
      case 'toggle-wish': {
        const on = !state.wish.includes(id);
        state.wish = on ? [...state.wish, id] : state.wish.filter((x) => x !== id);
        saveWish();
        $$(`[data-action="toggle-wish"][data-id="${id}"]`).forEach((b) => { b.classList.toggle('is-on', on); b.setAttribute('aria-pressed', on); b.setAttribute('aria-label', `${on ? 'Remove from' : 'Add to'} wishlist: ${byId[id].name}`); });
        toast(on ? `Saved <b>${esc(byId[id].name)}</b> to your wishlist` : 'Removed from wishlist');
        if (state.path === '/wishlist') route();
        break;
      }
      case 'quick-view': quickView(id); break;
      case 'size-guide': sizeGuide(); break;
      case 'add': {
        const p = byId[id];
        let size = null;
        if (isStitched(p)) {
          const sel = $('input[name="size"]:checked');
          $('#size-error').hidden = !!sel;
          if (!sel) { $('#sizes').scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'center' }); return; }
          size = sel.value;
        }
        addToCart(id, size, Number($('#pdp-qty').textContent));
        break;
      }
      case 'qv-add': {
        const p = byId[id];
        let size = null;
        if (isStitched(p)) {
          const sel = $('input[name="qv-size"]:checked');
          $('#qv-size-error').hidden = !!sel;
          if (!sel) return;
          size = sel.value;
        }
        addToCart(id, size, 1);
        break;
      }
      case 'pdp-qty': { const el = $('#pdp-qty'); el.textContent = Math.max(1, Math.min(10, Number(el.textContent) + Number(t.dataset.d))); break; }
      case 'qty': {
        const l = state.cart.find((x) => x.key === t.dataset.key);
        if (!l) break;
        l.qty += Number(t.dataset.d);
        if (l.qty < 1) state.cart = state.cart.filter((x) => x !== l);
        l.qty = Math.min(10, l.qty);
        saveCart(); renderCart();
        break;
      }
      case 'remove': state.cart = state.cart.filter((x) => x.key !== t.dataset.key); saveCart(); renderCart(); break;
      case 'slide': hero.go(Number(t.dataset.i)); break;
      case 'slide-step': hero.step(Number(t.dataset.d)); break;
      case 'hero-pause': hero.toggle(); break;
      case 'new-tab':
        $$('.tab').forEach((b) => { b.classList.toggle('is-active', b === t); b.setAttribute('aria-selected', b === t); });
        $('#new-track').innerHTML = newArrivals(t.dataset.tab);
        $('#new-track').scrollLeft = 0;
        break;
      case 'rail': { const tr = t.parentElement.querySelector('.rail-track'); tr.scrollBy({ left: Number(t.dataset.d) * tr.clientWidth * 0.8, behavior: reduceMotion ? 'auto' : 'smooth' }); break; }
      case 'cols': shop.cols = Number(t.dataset.n); store.set('bes_cols', shop.cols); $$('[data-action="cols"]').forEach((b) => { const on = b === t; b.classList.toggle('is-on', on); b.setAttribute('aria-pressed', on); }); renderShopGrid(); break;
      case 'load-more': shop.shown += 12; renderShopGrid(); break;
      case 'clear-filters': Object.assign(shop.f, { sub: [], fabric: [], size: [], color: [], max: null, sale: false, q: '' }); $('#filter-form').reset(); $('#max').value = $('#max').max; $('#max-out').textContent = money(Number($('#max').max)); $$('#filter-form input[type=checkbox]').forEach((c) => { c.checked = false; }); renderShopGrid(); break;
      case 'rm-filter': {
        const { k, v } = t.dataset;
        if (Array.isArray(shop.f[k])) { shop.f[k] = shop.f[k].filter((x) => x !== v); const box = $$(`#filter-form input[name="${k}"]`).find((c) => c.value === v); if (box) box.checked = false; }
        if (k === 'max') { shop.f.max = null; $('#max').value = $('#max').max; $('#max-out').textContent = money(Number($('#max').max)); }
        if (k === 'sale') { shop.f.sale = false; const s = $('#filter-form input[name="sale"]'); if (s) s.checked = false; }
        if (k === 'q') shop.f.q = '';
        renderShopGrid();
        break;
      }
      case 'gallery': showImage(Number(t.dataset.i)); break;
      case 'rm-promo': state.promo = null; saveCart(); $('#promo').value = ''; renderTotals(); break;
    }
  });

  document.addEventListener('change', (e) => {
    if (e.target.closest('#filter-form')) readFilterForm();
    if (e.target.id === 'sort') { shop.f.sort = e.target.value; renderShopGrid(); }
    if (e.target.name === 'ship') renderTotals();
  });
  document.addEventListener('input', (e) => {
    if (e.target.id === 'max') $('#max-out').textContent = money(Number(e.target.value));
    if (e.target.id === 'search-input') renderSearch(e.target.value);
    if (e.target.getAttribute('aria-invalid') === 'true') { e.target.removeAttribute('aria-invalid'); const err = e.target.parentElement.querySelector('.field-error'); if (err) err.hidden = true; }
  });

  document.addEventListener('submit', (e) => {
    const f = e.target;
    e.preventDefault();
    if (f.dataset.form === 'search') {
      const q = $('#search-input').value.trim();
      if (q) { closeLayers(true); location.hash = `#/shop/all?q=${encodeURIComponent(q)}`; }
      return;
    }
    if (f.dataset.form === 'newsletter') {
      const email = f.elements.email.value.trim();
      const err = $('[data-error="email"]', f);
      const ok = /^\S+@\S+\.\S+$/.test(email);
      err.hidden = ok; err.textContent = ok ? '' : 'Enter an email like name@example.com.';
      if (ok) { f.reset(); toast('You’re on the list. Welcome to Bint e Safia.'); }
      return;
    }
    if (f.dataset.form === 'contact') {
      const v = Object.fromEntries(new FormData(f));
      const errs = { name: !v.name.trim() && 'Enter your name.', email: !/^\S+@\S+\.\S+$/.test(v.email) && 'Enter an email like name@example.com.', message: v.message.trim().length < 10 && 'Tell us a little more (at least 10 characters).' };
      $$('[data-error]', f).forEach((el) => { const m = errs[el.dataset.error]; el.hidden = !m; el.textContent = m || ''; });
      if (!Object.values(errs).some(Boolean)) { f.reset(); toast(`Thanks, ${esc(v.name.split(' ')[0])}. Your message is ready to send once a form backend is connected.`); }
      return;
    }
    if (f.id === 'promo-form') {
      const code = f.elements.promo.value.trim().toUpperCase();
      const msg = $('#promo-msg');
      if (code === SHIPPING.promo.code) { state.promo = code; saveCart(); msg.hidden = true; toast(`${SHIPPING.promo.pct}% off applied`); }
      else { msg.hidden = false; msg.textContent = code ? `“${code}” isn’t a valid code.` : 'Enter a discount code.'; }
      renderTotals();
      return;
    }
    if (f.id === 'co-form') {
      const r = validateCheckout(f);
      if (!r.ok) { const el = f.elements[r.first]; if (el) el.focus(); return; }
      const t = cartTotals(r.v.ship);
      const no = 'BES-' + String(Date.now()).slice(-6);
      state.lastOrder = { no, first: r.v.first.trim(), email: r.v.email.trim(), phone: r.v.phone.trim(), address: r.v.address.trim(), city: r.v.city, pay: r.v.pay, items: state.cart.reduce((n, l) => n + l.qty, 0), total: t.total };
      store.set('bes_last_order', state.lastOrder);
      state.cart = []; state.promo = null; saveCart();
      location.hash = '#/order/' + no;
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLayers();
    // keep Tab inside an open modal/drawer
    if (e.key === 'Tab') {
      const layer = $('.layer.is-open');
      if (!layer || layer.id === 'filters' && window.innerWidth > 900) return;
      const f = $$('a[href], button:not([disabled]), input:not([disabled]), select, textarea, summary', layer).filter((x) => x.offsetParent !== null);
      if (!f.length) return;
      if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus(); }
      else if (!e.shiftKey && document.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus(); }
    }
  });

  // announcement bar
  (() => {
    const msgs = $$('.announce-msg');
    if (reduceMotion || msgs.length < 2) return;
    let i = 0;
    setInterval(() => { msgs[i].classList.remove('is-active'); i = (i + 1) % msgs.length; msgs[i].classList.add('is-active'); }, 4200);
  })();

  // header shadow on scroll
  const header = $('#header');
  window.addEventListener('scroll', () => header.classList.toggle('is-scrolled', window.scrollY > 8), { passive: true });

  /* ---------- boot ---------- */
  $$('[data-icon]').forEach((el) => el.insertAdjacentHTML('afterbegin', icon(el.dataset.icon)));
  $('.menu-btn').innerHTML = icon('menu');
  $$('[data-year]').forEach((el) => { el.textContent = new Date().getFullYear(); });
  buildNav();
  updateCounts();
  renderCart();
  window.addEventListener('hashchange', route);
  route();
})();
