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
  const isStitched = (p) => ['ready-to-wear', 'formal', 'casual'].includes(p.cat);
  // A deterministic "sold out" size for some products so the size picker shows real states.
  const soldOut = (p) => (isStitched(p) && hash(p.id) % 3 === 0 ? [SIZES[hash(p.id) % SIZES.length]] : []);
  const pad = (n) => String(n).padStart(2, '0');

  const state = {
    cart: store.get('bes_cart', []).filter((l) => byId[l.id]),
    wish: store.get('bes_wish', []).filter((id) => byId[id]),
    promo: store.get('bes_promo', null),
    lastOrder: store.get('bes_last_order', null),
    path: null
  };
  const saveCart = () => { store.set('bes_cart', state.cart); store.set('bes_promo', state.promo); updateCounts(); };
  const saveWish = () => { store.set('bes_wish', state.wish); updateCounts(); };

  /* ---------- icons ---------- */
  const I = {
    search: '<circle cx="10.5" cy="10.5" r="6.5"/><path d="M15.5 15.5l5 5"/>',
    heart: '<path d="M12 20s-7.5-4.6-9-9.3C2 7.6 4 4.5 7.2 4.5c2 0 3.6 1.2 4.8 3 1.2-1.8 2.8-3 4.8-3C20 4.5 22 7.6 21 10.7 19.5 15.4 12 20 12 20Z"/>',
    bag: '<path d="M5 8h14l-1 13H6L5 8Z"/><path d="M9 8V6.5a3 3 0 0 1 6 0V8"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4 21c1.2-4 4.3-6 8-6s6.8 2 8 6"/>',
    menu: '<path d="M3 7h18M3 12h18M3 17h12"/>',
    close: '<path d="M6 6l12 12M18 6 6 18"/>',
    left: '<path d="M15 5l-7 7 7 7"/>',
    right: '<path d="M9 5l7 7-7 7"/>',
    arrow: '<path d="M4 12h15M14 7l5 5-5 5"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    minus: '<path d="M5 12h14"/>',
    filter: '<path d="M4 6h16M7 12h10M10 18h4"/>',
    sprig: '<path d="M5 20C9 15 13 10 19 4"/><path d="M8.6 15.6c-2.4.3-4-.6-4.6-2.4 2.2-.6 3.8 0 4.6 2.4ZM11.6 12c-2.4.2-3.9-.8-4.4-2.6 2.2-.5 3.8.2 4.4 2.6ZM14.4 8.8c-2.3 0-3.7-1.1-4-2.9 2.2-.3 3.6.5 4 2.9ZM9.8 16.2c.6 2.3 0 3.9-1.8 4.6-.7-2.1-.1-3.8 1.8-4.6ZM13 12.8c.8 2.2.3 3.9-1.4 4.8-.9-2.1-.4-3.8 1.4-4.8ZM15.8 9.6c.9 2.2.5 3.9-1.2 4.9-1-2-.6-3.8 1.2-4.9Z"/>',
    star: '<path d="M12 3.5l2.6 5.4 5.9.8-4.3 4.1 1 5.8L12 16.9l-5.2 2.7 1-5.8-4.3-4.1 5.9-.8L12 3.5Z"/>',
    quality: '<circle cx="12" cy="10" r="6"/><path d="M12 7l1 2 2.2.3-1.6 1.5.4 2.2-2-1-2 1 .4-2.2-1.6-1.5L11 9l1-2ZM8.5 15l-1.5 6 5-2.5 5 2.5-1.5-6"/>',
    design: '<circle cx="12" cy="12" r="2.5"/><path d="M12 3c1.8 2 1.8 4.5 0 6.5-1.8-2-1.8-4.5 0-6.5ZM12 21c-1.8-2-1.8-4.5 0-6.5 1.8 2 1.8 4.5 0 6.5ZM3 12c2-1.8 4.5-1.8 6.5 0-2 1.8-4.5 1.8-6.5 0ZM21 12c-2 1.8-4.5 1.8-6.5 0 2-1.8 4.5-1.8 6.5 0Z"/><circle cx="12" cy="12" r="9.5"/>',
    lock: '<rect x="4.5" y="10.5" width="15" height="10" rx="1.5"/><path d="M8 10.5V7.5a4 4 0 0 1 8 0v3M12 14.5v2.5"/>',
    truck: '<path d="M2 6h11v10H2zM13 10h4l4 3v3h-8z"/><circle cx="6" cy="17.5" r="1.8"/><circle cx="17" cy="17.5" r="1.8"/>',
    returns: '<path d="M4 12a8 8 0 1 0 2.4-5.7M4 4v4.5h4.5"/><path d="M12 8v4l2.5 2"/>',
    cash: '<rect x="2.5" y="6" width="19" height="12" rx="1.5"/><circle cx="12" cy="12" r="2.6"/>',
    swap: '<path d="M4 8h14l-3-3M20 16H6l3 3"/>',
    pin: '<path d="M12 21s-6.5-6.2-6.5-11a6.5 6.5 0 0 1 13 0c0 4.8-6.5 11-6.5 11Z"/><circle cx="12" cy="10" r="2.3"/>',
    instagram: '<rect x="3.5" y="3.5" width="17" height="17" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.2" cy="6.8" r=".6"/>',
    facebook: '<path d="M14 8.5h2.5V5H14c-2.2 0-3.5 1.5-3.5 3.6V11H8v3.4h2.5V21H14v-6.6h2.5l.5-3.4h-3V9.3c0-.5.3-.8 1-.8Z"/>',
    tiktok: '<path d="M14 3v11.5a3.5 3.5 0 1 1-3.5-3.5M14 3c.4 2.6 2.2 4.3 5 4.5"/>',
    youtube: '<rect x="2.5" y="5.5" width="19" height="13" rx="4"/><path d="M10 9v6l5-3-5-3Z"/>',
    pinterest: '<circle cx="12" cy="12" r="9"/><path d="M11 8.5c3-1 5.5.7 5 3.3-.4 2-2.3 2.9-3.7 2.2M12 10l-2.5 10"/>',
    check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
    grid2: '<rect x="4" y="4" width="7" height="16"/><rect x="13" y="4" width="7" height="16"/>',
    grid3: '<rect x="3" y="4" width="5" height="16"/><rect x="9.5" y="4" width="5" height="16"/><rect x="16" y="4" width="5" height="16"/>'
  };
  const icon = (n, cls = '') => `<svg class="ico ${cls}" viewBox="0 0 24 24" aria-hidden="true" focusable="false">${I[n] || ''}</svg>`;
  const sprig = () => `<span class="sprig" aria-hidden="true">${icon('sprig')}</span>`;

  /* ---------- fragments ---------- */
  const img = (src, alt, cls = '', eager = false) => `<img class="${cls}" src="${esc(src)}" alt="${esc(alt)}" ${eager ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async">`;

  const priceHTML = (p) => p.sale
    ? `<span class="price"><ins>${money(p.sale)}</ins> <s aria-label="Was ${money(p.price)}">${money(p.price)}</s> <span class="pct">−${Math.round((1 - p.sale / p.price) * 100)}%</span></span>`
    : `<span class="price">${money(p.price)}</span>`;

  const badge = (p) => p.sale ? '<span class="badge badge--sale">Sale</span>'
    : p.isNew ? '<span class="badge">New</span>'
      : p.best ? '<span class="badge">Bestseller</span>' : '';

  const wishBtn = (p, cls = '') => {
    const on = state.wish.includes(p.id);
    return `<button class="wish ${cls} ${on ? 'is-on' : ''}" data-action="toggle-wish" data-id="${p.id}" aria-pressed="${on}" aria-label="${on ? 'Remove from' : 'Add to'} wishlist: ${esc(p.name)}">${icon('heart')}</button>`;
  };

  const dots = (p) => `<span class="dots-row" aria-label="Colours">${p.swatches.map((c) => `<span class="swatch-dot" style="--c:${c}"></span>`).join('')}</span>`;

  const card = (p) => `
    <article class="card">
      <div class="card-media">
        <a href="#/product/${p.id}" class="card-link" tabindex="-1" aria-hidden="true">
          ${img(p.images[0], '', 'card-img')}
          ${p.images[1] ? img(p.images[1], '', 'card-img card-img--alt') : ''}
        </a>
        ${badge(p)}${wishBtn(p)}
        <button class="quick" data-action="quick-view" data-id="${p.id}">Quick view</button>
      </div>
      <div class="card-body">
        <p class="card-type">${esc(p.type)}</p>
        <h3 class="card-title"><a href="#/product/${p.id}">${esc(p.name)}</a></h3>
        ${priceHTML(p)}
        ${dots(p)}
      </div>
    </article>`;

  const head = (eyebrow, title, id, link) => `
    <div class="section-head">
      <div><p class="eyebrow">${eyebrow}</p><h2 class="h2" id="${id}">${title} ${sprig()}</h2></div>
      ${link ? `<a class="link-arrow" href="${link[1]}">${link[0]} ${icon('arrow')}</a>` : ''}
    </div>`;

  const rail = (id, html, label) => `
    <div class="rail">
      <button class="rail-btn rail-btn--prev" data-action="rail" data-d="-1" aria-label="Scroll ${label} left">${icon('left')}</button>
      <div class="rail-track" id="${id}">${html}</div>
      <button class="rail-btn rail-btn--next" data-action="rail" data-d="1" aria-label="Scroll ${label} right">${icon('right')}</button>
    </div>`;

  const crumbs = (items) => `<nav class="crumbs" aria-label="Breadcrumb"><ol>${items.map((it, i) => i < items.length - 1 ? `<li><a href="${it[1]}">${esc(it[0])}</a></li>` : `<li aria-current="page">${esc(it[0])}</li>`).join('')}</ol></nav>`;

  /* ---------- header nav + mobile menu ---------- */
  function buildNav() {
    const collections = `<div class="mega"><div class="wrap mega-inner">
      ${CATEGORIES.map((c) => `<a class="mega-tile" href="#/shop/${c.slug}"><span class="mega-img">${img(c.image, '')}</span><span class="mega-name">${esc(c.name)}</span><span class="mega-tag">${esc(c.tagline)}</span></a>`).join('')}
    </div></div>`;
    const left = [['New In', '#/shop/new'], ['Collections', '#/shop/all', collections], ['Unstitched', '#/shop/unstitched'], ['Ready to Wear', '#/shop/ready-to-wear']];
    const right = [['Accessories', '#/shop/accessories'], ['Sale', '#/shop/sale'], ['Our Story', '#/page/about']];
    const list = (items) => `<ul class="nav-list">${items.map(([l, h, m]) => `<li class="nav-item${m ? ' has-mega' : ''}"><a class="nav-link" href="${h}">${l}</a>${m || ''}</li>`).join('')}</ul>`;
    $('#nav-left').innerHTML = list(left);
    $('#nav-right').innerHTML = list(right);

    $('#menu-body').innerHTML = `
      <ul class="m-cats">${CATEGORIES.map((c) => `<li><a href="#/shop/${c.slug}"><span class="m-cat-img">${img(c.image, '')}</span><span>${esc(c.name)}</span></a></li>`).join('')}</ul>
      <ul class="m-nav">
        <li><a href="#/shop/new">New In</a></li>
        <li><a href="#/shop/all">All Collections</a></li>
        <li><a href="#/shop/sale" class="is-sale">Sale</a></li>
        <li><a href="#/page/about">Our Story</a></li>
      </ul>
      <ul class="m-links">
        <li><a href="#/wishlist">${icon('heart')} Wishlist</a></li>
        <li><a href="#/page/account">${icon('user')} My account</a></li>
        <li><a href="#/page/stores">${icon('pin')} Store locator</a></li>
      </ul>`;
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
    toastTimer = setTimeout(() => t.classList.remove('is-on'), 2800);
  }

  /* ---------- cart ---------- */
  function addToCart(id, size, qty = 1) {
    if (!byId[id]) return;
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
      $('#cart-body').innerHTML = `<div class="empty"><p class="empty-title">Your bag is empty</p><p>Pieces you add will show up here.</p><a class="btn btn--plum" href="#/shop/new">Shop new arrivals</a></div>`;
      $('#cart-foot').innerHTML = '';
      return;
    }
    const t = cartTotals();
    const left = SHIPPING.freeOver - t.subtotal;
    const pct = Math.min(100, (t.subtotal / SHIPPING.freeOver) * 100);
    $('#cart-body').innerHTML = `
      <div class="ship-meter"><p>${left > 0 ? `Add <b>${money(left)}</b> more for free shipping` : 'You’ve unlocked <b>free shipping</b>'}</p><div class="meter"><span style="width:${pct}%"></span></div></div>
      <ul class="lines">${state.cart.map(lineHTML).join('')}</ul>`;
    $('#cart-foot').innerHTML = `
      <div class="sum-row"><span>Subtotal</span><b>${money(t.subtotal)}</b></div>
      ${t.discount ? `<div class="sum-row"><span>${SHIPPING.promo.code}</span><span>−${money(t.discount)}</span></div>` : ''}
      <p class="muted small">Shipping and discount codes are applied at checkout.</p>
      <a class="btn btn--plum btn--block" href="#/checkout">Checkout · ${money(t.subtotal - t.discount)}</a>
      <button class="btn btn--ghost btn--block" data-action="close">Continue shopping</button>`;
  }
  const lineHTML = (l) => {
    const p = byId[l.id];
    return `<li class="line">
      <a class="line-img" href="#/product/${p.id}">${img(p.images[0], '')}</a>
      <div class="line-info">
        <a class="line-name" href="#/product/${p.id}">${esc(p.name)}</a>
        <p class="muted small">${esc(p.type)}${l.size ? ' · Size ' + l.size : ''}</p>
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

  /* ---------- home ---------- */
  let heroTimer = null;

  function viewHome() {
    const fresh = PRODUCTS.filter((p) => p.isNew || p.cat === 'formal').slice(0, 8);
    const loved = PRODUCTS.filter((p) => p.best);
    const tiles = [...CATEGORIES, D.SALE_TILE];
    const perks = [['quality', 'Premium Quality', 'Crafted with care'], ['design', 'Timeless Designs', 'Styles beyond seasons'], ['lock', 'Secure Payments', 'Shop with confidence'], ['truck', 'Fast & Reliable Shipping', 'Across Pakistan'], ['returns', 'Hassle Free Returns', 'A smoother shopping experience']];
    const R = D.REVIEWS;

    return `
    <section class="hero" aria-roledescription="carousel" aria-label="Featured collections">
      <div class="hero-track">
        ${D.HERO.map((s, i) => `
        <div class="slide ${i === 0 ? 'is-active' : ''}" role="group" aria-roledescription="slide" aria-label="${i + 1} of ${D.HERO.length}" style="--tint:${s.tint};--focus:${s.focus || '50% 30%'}" ${i ? 'aria-hidden="true"' : ''}>
          <div class="slide-media">${img(s.image, '', '', i === 0)}</div>
          <div class="wrap slide-inner">
            <div class="slide-copy">
              <p class="eyebrow eyebrow--wide">${esc(s.eyebrow)}</p>
              <${i === 0 ? 'h1' : 'h2'} class="display"><span>${esc(s.title[0])}</span><span class="display-2">${esc(s.title[1])} ${sprig()}</span></${i === 0 ? 'h1' : 'h2'}>
              <p class="slide-text">${esc(s.text)}</p>
              <a class="btn btn--plum" href="${s.cta[1]}" ${i ? 'tabindex="-1"' : ''}>${esc(s.cta[0])} ${icon('arrow')}</a>
            </div>
          </div>
        </div>`).join('')}
      </div>
      <div class="wrap hero-controls">
        <div class="counter" role="tablist" aria-label="Choose slide">
          ${D.HERO.map((s, i) => `<button role="tab" class="count-btn ${i === 0 ? 'is-active' : ''}" data-action="slide" data-i="${i}" aria-selected="${i === 0}" aria-label="Slide ${i + 1}: ${esc(s.eyebrow)}"><span class="count-num">${pad(i + 1)}</span><span class="count-bar"><span></span></span></button>`).join('')}
          <button class="icon-btn hero-next" data-action="slide-step" data-d="1" aria-label="Next slide">${icon('right')}</button>
          <button class="icon-btn hero-pause" data-action="hero-pause" aria-label="Pause slideshow" aria-pressed="false"><span class="pause-ico" aria-hidden="true"></span></button>
        </div>
      </div>
    </section>

    <section class="section section--blush" aria-labelledby="cats-h">
      <div class="wrap">
        ${head('Shop by Category', 'Find Your Perfect Style', 'cats-h', ['Explore all categories', '#/shop/all'])}
        <ul class="cat-row">${tiles.map((c) => `
          <li><a class="cat" href="#/shop/${c.slug}">
            <span class="cat-img">${img(c.image, '')}</span>
            <span class="cat-label"><span class="cat-name">${esc(c.name)}</span><span class="cat-tag">${esc(c.tagline)}</span></span>
          </a></li>`).join('')}
        </ul>
      </div>
    </section>

    <section class="section" aria-labelledby="new-h">
      <div class="wrap">
        ${head('New In', 'Fresh Arrivals', 'new-h', ['View all new in', '#/shop/new'])}
        ${rail('fresh-track', fresh.map(card).join(''), 'new arrivals')}
      </div>
    </section>

    <section class="festive" aria-labelledby="festive-h">
      <div class="festive-media">${img(D.IMG + 'festive-moments.jpg', 'Model reclining in an ivory floral embroidered suit', '', true)}</div>
      <div class="festive-copy">
        <p class="eyebrow eyebrow--wide">The Festive Edit</p>
        <h2 class="display display--md" id="festive-h"><span>Moments</span><span class="display-2">in Bloom</span></h2>
        <p>For the celebrations, the gatherings and everything in between.</p>
        <a class="btn btn--plum" href="#/shop/formal">Explore the Edit ${icon('arrow')}</a>
      </div>
      <div class="festive-arch">${img(D.IMG + 'festive-arch.jpg', '')}</div>
    </section>

    <section class="section" aria-labelledby="best-h">
      <div class="wrap">
        ${head('Bestsellers', 'Loved by Many', 'best-h', ['Shop bestsellers', '#/shop/all?sort=best'])}
        ${rail('best-track', loved.map(card).join(''), 'bestsellers')}
      </div>
    </section>

    <section class="section section--blush lookbook" aria-labelledby="look-h">
      <div class="wrap lookbook-inner">
        <div class="lookbook-copy">
          <p class="eyebrow eyebrow--wide">Style Edit</p>
          <h2 class="h2 h2--lg" id="look-h">Stories in Style ${sprig()}</h2>
          <p>A curated edit of timeless pieces, modern moods and everyday elegance.</p>
          <a class="btn btn--plum" href="#/shop/all">View Lookbook ${icon('arrow')}</a>
        </div>
        <ul class="look-grid">${D.LOOKBOOK.map((l) => `<li><a class="look" href="${l.href}">${img(l.image, l.alt)}</a></li>`).join('')}</ul>
      </div>
    </section>

    <section class="perks-band" aria-label="Why shop with us">
      <div class="wrap perks">${perks.map(([i, t, d]) => `<div class="perk"><span class="perk-ico">${icon(i)}</span><div><p class="perk-t">${t}</p><p class="perk-d">${d}</p></div></div>`).join('')}</div>
    </section>

    <section class="section reviews" aria-labelledby="rev-h">
      <div class="wrap">
        <div class="section-head">
          <div><p class="eyebrow">What Our Customers Say</p><h2 class="h2" id="rev-h">Real Stories, Real Love ${sprig()}</h2></div>
          <div class="rev-arrows"><button class="icon-btn" data-action="rail-to" data-target="rev-track" data-d="-1" aria-label="Previous reviews">${icon('left')}</button><button class="icon-btn" data-action="rail-to" data-target="rev-track" data-d="1" aria-label="Next reviews">${icon('right')}</button></div>
        </div>
        ${R.sample ? '<p class="sample-note">Sample reviews for layout. Replace with verified customer reviews before launch.</p>' : ''}
        <div class="rev-track" id="rev-track">${R.items.map((r) => `
          <figure class="review">
            <span class="avatar" aria-hidden="true">${esc(r.name.split(' ').map((w) => w[0]).join(''))}</span>
            <div>
              <figcaption><b>${esc(r.name)}</b> <span class="muted small">${esc(r.city)}</span><span class="stars" aria-label="${r.rating} out of 5 stars">${icon('star').repeat(r.rating)}</span></figcaption>
              <blockquote>“${esc(r.text)}”</blockquote>
            </div>
          </figure>`).join('')}
        </div>
      </div>
    </section>`;
  }

  const heroCtl = { go() {}, step() {}, toggle() {} };
  function initHero() {
    clearInterval(heroTimer);
    const slides = $$('.slide');
    if (!slides.length) return;
    let i = 0, paused = reduceMotion;
    const hero = $('.hero');
    const go = (n) => {
      i = (n + slides.length) % slides.length;
      slides.forEach((s, k) => {
        s.classList.toggle('is-active', k === i);
        s.setAttribute('aria-hidden', k !== i);
        $$('a.btn', s).forEach((a) => (k === i ? a.removeAttribute('tabindex') : a.setAttribute('tabindex', '-1')));
      });
      $$('.count-btn').forEach((d, k) => { d.classList.toggle('is-active', k === i); d.setAttribute('aria-selected', k === i); });
    };
    const start = () => {
      clearInterval(heroTimer);
      // restart the progress bar animation on the active counter
      hero.classList.remove('is-running'); void hero.offsetWidth; hero.classList.toggle('is-running', !paused);
      if (!paused) heroTimer = setInterval(() => { go(i + 1); start(); }, 6500);
    };
    const pauseBtn = $('.hero-pause');
    const setPaused = (v) => { paused = v; pauseBtn.setAttribute('aria-pressed', v); pauseBtn.setAttribute('aria-label', v ? 'Play slideshow' : 'Pause slideshow'); pauseBtn.classList.toggle('is-paused', v); start(); };
    setPaused(paused);
    heroCtl.go = (n) => { go(n); start(); };
    heroCtl.step = (d) => { go(i + d); start(); };
    heroCtl.toggle = () => setPaused(!paused);
    let x0 = null;
    const track = $('.hero-track');
    track.addEventListener('touchstart', (e) => { x0 = e.touches[0].clientX; }, { passive: true });
    track.addEventListener('touchend', (e) => { if (x0 === null) return; const dx = e.changedTouches[0].clientX - x0; if (Math.abs(dx) > 40) heroCtl.step(dx < 0 ? 1 : -1); x0 = null; });
  }

  /* ---------- shop ---------- */
  const SORTS = [['featured', 'Featured'], ['new', 'Newest'], ['best', 'Bestsellers'], ['price-asc', 'Price: low to high'], ['price-desc', 'Price: high to low']];
  let shop = null;

  function shopBase(slug) {
    if (slug === 'new') return { title: 'New In', blurb: 'The latest pieces, added every week.', list: PRODUCTS.filter((p) => p.isNew) };
    if (slug === 'sale') return { title: 'Sale', blurb: 'Loved styles for less. Sale items are exchange only.', list: PRODUCTS.filter((p) => p.sale) };
    const c = CATEGORIES.find((x) => x.slug === slug);
    if (c) return { title: c.name, blurb: c.blurb, list: PRODUCTS.filter((p) => p.cat === slug) };
    return { title: 'All Collections', blurb: 'Everything from Bint e Safia, in one place.', list: PRODUCTS.slice() };
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
    <section class="shop-hero">
      <div class="wrap">
        ${crumbs([['Home', '#/'], [f.q ? `Search: “${f.q}”` : base.title, '#']])}
        <h1 class="h1">${f.q ? `Results for “${esc(f.q)}”` : esc(base.title)} ${sprig()}</h1>
        <p>${esc(base.blurb)}</p>
      </div>
    </section>
    <section class="wrap shop">
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
          <div class="filters-foot"><button class="btn btn--ghost" data-action="clear-filters">Clear all</button><button class="btn btn--plum" data-action="close">Show results</button></div>
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
    const list = base.list.filter((p) =>
      (!f.sub.length || f.sub.includes(p.sub)) &&
      (!f.fabric.length || f.fabric.includes(p.fabric)) &&
      (!f.color.length || f.color.includes(p.color)) &&
      (!f.size.length || (isStitched(p) && f.size.some((s) => !soldOut(p).includes(s)))) &&
      (!f.max || unitPrice(p) <= f.max) &&
      (!f.sale || p.sale) &&
      (!q || [p.name, p.type, p.fabric, p.color, p.sub, catName[p.cat], p.collection].join(' ').toLowerCase().includes(q))
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
      : `<div class="empty"><p class="empty-title">No pieces match these filters</p><p>Try removing a filter or widening the price range.</p><button class="btn btn--plum" data-action="clear-filters">Clear filters</button></div>`;
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
    const qs = new URLSearchParams();
    ['sub', 'fabric', 'size', 'color'].forEach((k) => f[k].forEach((v) => qs.append(k, v)));
    if (f.max) qs.set('max', f.max);
    if (f.sale) qs.set('sale', '1');
    if (f.q) qs.set('q', f.q);
    if (f.sort !== 'featured') qs.set('sort', f.sort);
    try { history.replaceState(null, '', `#/shop/${shop.slug}${qs.toString() ? '?' + qs : ''}`); } catch (e) { /* sandboxed */ }
  }

  function readFilterForm() {
    const fd = new FormData($('#filter-form'));
    const f = shop.f;
    ['sub', 'fabric', 'size', 'color'].forEach((k) => { f[k] = fd.getAll(k); });
    const max = Number($('#max').value);
    f.max = max < Number($('#max').max) ? max : null;
    f.sale = fd.get('sale') === '1';
    shop.shown = 12;
    renderShopGrid();
  }

  /* ---------- product ---------- */
  function viewProduct(id) {
    const p = byId[id];
    if (!p) return viewNotFound();
    // With a single photo, the second view is a close-up crop of the same image.
    const views = p.images.length > 1 ? p.images.map((src) => ({ src })) : [{ src: p.images[0] }, { src: p.images[0], detail: true }];
    const out = soldOut(p);
    const related = PRODUCTS.filter((x) => x.id !== p.id && (x.cat === p.cat || x.fabric === p.fabric)).sort((a, b) => (b.cat === p.cat) - (a.cat === p.cat)).slice(0, 4);
    const care = ['Organza', 'Chiffon', 'Raw Silk', 'Embellished'].includes(p.fabric) ? D.CARE.delicate : D.CARE.default;
    return `
    <section class="wrap pdp-wrap">
      ${crumbs([['Home', '#/'], [catName[p.cat], '#/shop/' + p.cat], [p.name, '#']])}
      <div class="pdp">
        <div class="gallery">
          <div class="thumbs" role="tablist" aria-label="Product images">${views.map((v, i) => `<button role="tab" class="thumb ${i === 0 ? 'is-active' : ''} ${v.detail ? 'is-detail' : ''}" aria-selected="${i === 0}" data-action="gallery" data-i="${i}" aria-label="Image ${i + 1}">${img(v.src, '')}</button>`).join('')}</div>
          <div class="stage" id="stage">${views.map((v, i) => `<div class="stage-img ${i === 0 ? 'is-active' : ''} ${v.detail ? 'is-detail' : ''}" data-zoom>${img(v.src, `${p.name}${v.detail ? ', embroidery close-up' : ''}`, '', i === 0)}</div>`).join('')}${badge(p)}</div>
        </div>
        <div class="pdp-info">
          <p class="eyebrow">${esc(p.collection)}</p>
          <h1 class="h1 pdp-title">${esc(p.name)}</h1>
          <p class="muted">${esc(p.type)} · ${esc(p.sub)}</p>
          <div class="pdp-price">${priceHTML(p)}</div>
          <p class="muted small">Inclusive of all taxes · SKU ${p.id.toUpperCase()}</p>
          <div class="pdp-colour"><span>Colour: <b>${esc(p.color)}</b></span>${dots(p)}</div>
          ${isStitched(p) ? `
          <fieldset class="sizes" id="sizes">
            <legend><span>Size</span><button type="button" class="linklike small" data-action="size-guide">Size guide</button></legend>
            <div class="chips">${SIZES.map((s) => `<label class="chip ${out.includes(s) ? 'is-out' : ''}"><input type="radio" name="size" value="${s}" ${out.includes(s) ? 'disabled' : ''}><span>${s}</span></label>`).join('')}</div>
            ${out.length ? `<p class="muted small">Size ${out.join(', ')} is sold out.</p>` : ''}
            <p class="field-error" id="size-error" hidden>Choose a size to continue.</p>
          </fieldset>` : `<p class="pdp-note">${p.cat === 'unstitched' ? `Unstitched fabric · ${p.pieces} pieces` : 'One size'}</p>`}
          <div class="buy-row">
            <div class="stepper stepper--lg" aria-label="Quantity">
              <button data-action="pdp-qty" data-d="-1" aria-label="Decrease quantity">${icon('minus')}</button>
              <span id="pdp-qty" aria-live="polite">1</span>
              <button data-action="pdp-qty" data-d="1" aria-label="Increase quantity">${icon('plus')}</button>
            </div>
            <button class="btn btn--plum btn--grow" data-action="add" data-id="${p.id}">Add to Bag ${icon('bag')}</button>
            ${wishBtn(p, 'wish--box')}
          </div>
          <ul class="pdp-perks">
            <li>${icon('truck')} Dispatched in 1–2 working days. Free shipping over ${money(SHIPPING.freeOver)}.</li>
            <li>${icon('cash')} Cash on delivery available nationwide.</li>
            <li>${icon('swap')} Easy exchange within 30 days of delivery.</li>
          </ul>
          <div class="accordion">
            <details open><summary>Description${icon('plus')}</summary><div><p>${esc(p.desc)}</p></div></details>
            <details><summary>Fabric &amp; Care${icon('plus')}</summary><div><p><b>${esc(p.fabric)}.</b> ${esc(D.FABRIC_NOTES[p.fabric] || '')}</p><ul>${care.map((c) => `<li>${c}</li>`).join('')}</ul><p class="muted small">Colours may vary slightly from your screen. Embroidery is hand-finished, so small irregularities are part of the piece.</p></div></details>
            <details><summary>Shipping &amp; Exchange${icon('plus')}</summary><div><p>Standard delivery takes 2–5 working days across Pakistan (${money(SHIPPING.standard)}, free over ${money(SHIPPING.freeOver)}). Express delivery to major cities takes 1–2 days (${money(SHIPPING.express)}).</p><p>Unworn pieces with tags can be exchanged within 30 days. Sale items are exchange only.</p></div></details>
          </div>
        </div>
      </div>
    </section>
    <section class="section" aria-labelledby="rel-h">
      <div class="wrap">
        ${head('Complete the Look', 'You May Also Love', 'rel-h')}
        <div class="grid grid--4">${related.map(card).join('')}</div>
      </div>
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

  /* ---------- wishlist ---------- */
  function viewWishlist() {
    const list = state.wish.map((id) => byId[id]).filter(Boolean);
    return `<section class="shop-hero"><div class="wrap">${crumbs([['Home', '#/'], ['Wishlist', '#']])}<h1 class="h1">Wishlist ${sprig()}</h1><p>${list.length ? `${list.length} saved ${list.length === 1 ? 'piece' : 'pieces'}, saved on this device.` : 'Tap the heart on any piece to save it here.'}</p></div></section>
      <section class="wrap shop">${list.length ? `<div class="grid grid--4">${list.map(card).join('')}</div>` : `<div class="empty"><p class="empty-title">Nothing saved yet</p><a class="btn btn--plum" href="#/shop/new">Browse new arrivals</a></div>`}</section>`;
  }

  /* ---------- checkout ---------- */
  function viewCheckout() {
    if (!state.cart.length) {
      return `<section class="wrap shop"><div class="empty"><p class="empty-title">Your bag is empty</p><p>Add a few pieces before checking out.</p><a class="btn btn--plum" href="#/shop/new">Shop new arrivals</a></div></section>`;
    }
    const field = (id, label, type = 'text', attrs = '', full = false) => `<div class="field ${full ? 'field--full' : ''}"><label for="co-${id}">${label}</label><input id="co-${id}" name="${id}" type="${type}" ${attrs}><p class="field-error" data-error="${id}" hidden></p></div>`;
    return `
    <section class="wrap checkout">
      ${crumbs([['Home', '#/'], ['Checkout', '#']])}
      <h1 class="h1">Checkout ${sprig()}</h1>
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
          <button class="btn btn--plum btn--block btn--lg" type="submit" id="place">Place order</button>
          <p class="muted small center">Demo storefront: placing an order here does not charge you or ship anything.</p>
        </form>
        <aside class="co-summary" aria-label="Order summary">
          <h2 class="h3">Order summary</h2>
          <ul class="lines lines--compact">${state.cart.map((l) => { const p = byId[l.id]; return `<li class="line"><span class="line-img">${img(p.images[0], '')}<span class="qty-badge">${l.qty}</span></span><div class="line-info"><span class="line-name">${esc(p.name)}</span><p class="muted small">${l.size ? 'Size ' + l.size : esc(p.sub)}</p></div><span class="line-price">${money(unitPrice(p) * l.qty)}</span></li>`; }).join('')}</ul>
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
      <div class="sum-row"><span>Shipping</span><span>${t.shipping ? money(t.shipping) : 'Free'}</span></div>
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
      <a class="btn btn--plum" href="#/shop/new">Continue shopping</a>
    </section>`;
  }

  /* ---------- info pages ---------- */
  const PAGES = {
    about: { title: 'Our Story', body: `
      <p class="lede">Bint e Safia means <em>daughter of Safia</em>. The label grew out of one woman’s wardrobe and the habits that came with it: buy good cloth, find a good tailor, wear it often.</p>
      <p>We design for everyday life in Pakistan, from a quiet afternoon at home to a full mehndi night. That means honest fabrics, embroidery done with patience, and festive pieces you will want to wear again.</p>
      <h2 class="h3">What we care about</h2>
      <ul><li><b>Cloth first.</b> We choose fabric for how it feels and wears, then design around it.</li><li><b>Fit that forgives.</b> Our stitched pieces are cut with room to move and graded across five sizes.</li><li><b>Pieces that last.</b> Fewer, better drops, and exchanges when something isn’t right.</li></ul>` },
    contact: { title: 'Contact Us', body: `
      <p class="lede">Questions about sizing, an order or an exchange? Send us a message and our team will get back to you.</p>
      <div class="contact-grid">
        <form class="co-form" data-form="contact" novalidate><div class="fields">
          <div class="field"><label for="ct-name">Name</label><input id="ct-name" name="name" autocomplete="name" required><p class="field-error" data-error="name" hidden></p></div>
          <div class="field"><label for="ct-email">Email</label><input id="ct-email" name="email" type="email" autocomplete="email" required><p class="field-error" data-error="email" hidden></p></div>
          <div class="field field--full"><label for="ct-order">Order number (optional)</label><input id="ct-order" name="order" placeholder="BES-000000"></div>
          <div class="field field--full"><label for="ct-msg">Message</label><textarea id="ct-msg" name="message" rows="5" required></textarea><p class="field-error" data-error="message" hidden></p></div>
        </div><button class="btn btn--plum" type="submit">Send message</button></form>
        <div class="contact-info"><h2 class="h3">Customer care</h2><p>Monday to Saturday, 10 am – 7 pm PKT</p><p class="muted small">Add your WhatsApp, phone and email here before launch.</p></div>
      </div>` },
    account: { title: 'My Account', body: `
      <div class="contact-grid">
        <form class="co-form" data-form="account" novalidate><div class="fields">
          <div class="field field--full"><label for="ac-email">Email</label><input id="ac-email" name="email" type="email" autocomplete="email" required><p class="field-error" data-error="email" hidden></p></div>
          <div class="field field--full"><label for="ac-pass">Password</label><input id="ac-pass" name="password" type="password" autocomplete="current-password" required></div>
        </div><button class="btn btn--plum" type="submit">Sign in</button></form>
        <div class="contact-info"><h2 class="h3">New here?</h2><p>Create an account at checkout to track orders, save addresses and get early access to sales.</p></div>
      </div>` },
    faqs: { title: 'FAQs', body: `<div class="accordion">${[
      ['How long does delivery take?', 'Standard delivery takes 2–5 working days across Pakistan. Express delivery to major cities takes 1–2 working days.'],
      ['How much is shipping?', `Standard shipping is ${money(SHIPPING.standard)} and free on orders over ${money(SHIPPING.freeOver)}. Express shipping is ${money(SHIPPING.express)}.`],
      ['Do you offer cash on delivery?', 'Yes, nationwide. You can also pay by debit or credit card, JazzCash or Easypaisa.'],
      ['How do I choose my size?', 'Use the size guide on any product page. If you are between sizes, size up for a relaxed fit.'],
      ['Can I exchange an item?', 'Unworn pieces with tags attached can be exchanged within 30 days of delivery, in store or by courier. Sale items are exchange only.'],
      ['What comes in an unstitched suit?', 'Usually an embroidered shirt front, back and sleeves, trouser fabric and a dupatta. Exact cuts are listed on each product.']
    ].map(([q, a], i) => `<details ${i === 0 ? 'open' : ''}><summary>${q}${icon('plus')}</summary><div><p>${a}</p></div></details>`).join('')}</div>` },
    shipping: { title: 'Shipping & Delivery', body: `
      <div class="table-wrap"><table class="table"><thead><tr><th>Method</th><th>Time</th><th>Cost</th></tr></thead><tbody>
        <tr><td>Standard</td><td>2–5 working days</td><td>${money(SHIPPING.standard)} · free over ${money(SHIPPING.freeOver)}</td></tr>
        <tr><td>Express</td><td>1–2 working days (major cities)</td><td>${money(SHIPPING.express)}</td></tr>
      </tbody></table></div>
      <p>Orders placed before 2 pm PKT on a working day are dispatched the next working day. You will receive a tracking number by SMS and email once your parcel leaves our warehouse.</p>` },
    returns: { title: 'Returns & Exchanges', body: `
      <p class="lede">Not quite right? Exchange it within 30 days of delivery.</p>
      <ol><li>Keep the piece unworn and unwashed, with tags attached.</li><li>Bring it to any store with your order number, or contact us to book a courier pick-up.</li><li>Choose a new size, colour or a different piece of equal value.</li></ol>
      <p>Sale items and unstitched fabric that has been cut are exchange only.</p>` },
    care: { title: 'Care Guide', body: `
      <p class="lede">Embroidery and fine fabrics last longest with a little care.</p>
      <h2 class="h3">Lawn and cambric</h2><ul>${D.CARE.default.map((c) => `<li>${c}</li>`).join('')}</ul>
      <h2 class="h3">Organza, chiffon, silk and embellished pieces</h2><ul>${D.CARE.delicate.map((c) => `<li>${c}</li>`).join('')}</ul>` },
    stores: { title: 'Store Locator', body: `<div class="stores">${D.STORES.map((s) => `<div class="store">${icon('pin')}<div><p class="eyebrow">${esc(s.city)}</p><h2 class="h3">${esc(s.name)}</h2><p>${esc(s.address)}</p><p class="muted small">Open daily, ${esc(s.hours)}</p></div></div>`).join('')}</div><p class="muted small">Store details are placeholders. Replace them with your real locations.</p>` }
  };
  function viewPage(slug) {
    const pg = PAGES[slug];
    if (!pg) return viewNotFound();
    return `<section class="shop-hero"><div class="wrap">${crumbs([['Home', '#/'], [pg.title, '#']])}<h1 class="h1">${pg.title} ${sprig()}</h1></div></section><section class="wrap page"><div class="prose">${pg.body}</div></section>`;
  }
  const viewNotFound = () => `<section class="wrap shop"><div class="empty"><p class="empty-title">We couldn’t find that page</p><p>It may have moved or sold out.</p><a class="btn btn--plum" href="#/">Back to home</a></div></section>`;

  /* ---------- modals ---------- */
  function quickView(id) {
    const p = byId[id];
    const out = soldOut(p);
    $('#modal-body').innerHTML = `
      <div class="qv">
        <div class="qv-art">${img(p.images[0], p.name)}</div>
        <div class="qv-info">
          <p class="eyebrow">${esc(p.type)}</p>
          <h2 class="h2" id="modal-title">${esc(p.name)}</h2>
          <div class="pdp-price">${priceHTML(p)}</div>
          <p>${esc(p.desc)}</p>
          ${isStitched(p) ? `<fieldset class="sizes"><legend><span>Size</span></legend><div class="chips">${SIZES.map((s) => `<label class="chip ${out.includes(s) ? 'is-out' : ''}"><input type="radio" name="qv-size" value="${s}" ${out.includes(s) ? 'disabled' : ''}><span>${s}</span></label>`).join('')}</div><p class="field-error" id="qv-size-error" hidden>Choose a size to continue.</p></fieldset>` : ''}
          <div class="btn-row">
            <button class="btn btn--plum btn--grow" data-action="qv-add" data-id="${p.id}">Add to Bag</button>
            ${wishBtn(p, 'wish--box')}
          </div>
          <a class="link-arrow" href="#/product/${p.id}">View full details ${icon('arrow')}</a>
        </div>
      </div>`;
    $('#modal').classList.remove('modal--narrow');
    openLayer('modal');
  }
  function sizeGuide() {
    $('#modal-body').innerHTML = `
      <h2 class="h2" id="modal-title">Size Guide ${sprig()}</h2>
      <p class="muted">Garment measurements in inches for stitched shirts. If you’re between sizes, size up for a relaxed fit.</p>
      <div class="table-wrap"><table class="table table--num"><thead><tr><th>Size</th><th>Chest</th><th>Length</th><th>Shoulder</th><th>Sleeve</th></tr></thead>
      <tbody>${D.SIZE_CHART.map((r) => `<tr>${r.map((c, i) => i ? `<td>${c}″</td>` : `<th scope="row">${c}</th>`).join('')}</tr>`).join('')}</tbody></table></div>
      <h3 class="h3">How to measure</h3>
      <ul class="small bullets"><li><b>Chest:</b> around the fullest part, under the arms.</li><li><b>Length:</b> from the highest shoulder point to the hem.</li><li><b>Shoulder:</b> across the back from seam to seam.</li><li><b>Sleeve:</b> from the shoulder seam to the cuff.</li></ul>`;
    $('#modal').classList.add('modal--narrow');
    openLayer('modal');
  }

  /* ---------- search ---------- */
  const searchHit = (p) => `<li><a href="#/product/${p.id}"><span class="s-img">${img(p.images[0], '')}</span><span><span class="s-name">${esc(p.name)}</span><span class="muted small">${esc(p.type)}</span>${priceHTML(p)}</span></a></li>`;
  function renderSearch(q) {
    const body = $('#search-body');
    const term = q.toLowerCase().trim();
    if (!term) {
      body.innerHTML = `<p class="eyebrow">Popular searches</p><div class="chips chips--links">${['Organza', 'Lawn', 'Formal', 'Unstitched', 'Plum', 'Dupatta'].map((s) => `<a class="achip" href="#/shop/all?q=${encodeURIComponent(s)}">${s}</a>`).join('')}</div>
        <p class="eyebrow">Trending now</p><ul class="s-results">${PRODUCTS.filter((p) => p.best).slice(0, 4).map(searchHit).join('')}</ul>`;
      return;
    }
    const hits = PRODUCTS.filter((p) => [p.name, p.type, p.fabric, p.color, p.sub, catName[p.cat], p.collection].join(' ').toLowerCase().includes(term));
    body.innerHTML = hits.length
      ? `<p class="eyebrow">${hits.length} ${hits.length === 1 ? 'result' : 'results'}</p><ul class="s-results">${hits.slice(0, 6).map(searchHit).join('')}</ul>${hits.length > 6 ? `<a class="link-arrow" href="#/shop/all?q=${encodeURIComponent(q)}">See all ${hits.length} results ${icon('arrow')}</a>` : ''}`
      : `<p>No results for “${esc(q)}”. Try “organza”, “lawn” or “dupatta”.</p>`;
  }

  /* ---------- router ---------- */
  function route() {
    const raw = location.hash.replace(/^#/, '') || '/';
    if (!raw.startsWith('/')) return; // plain in-page anchors like #app
    const [pathPart, query = ''] = raw.split('?');
    const parts = pathPart.split('/').filter(Boolean);
    const params = new URLSearchParams(query);
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
    $('#app').innerHTML = html;
    document.title = title;
    document.body.dataset.view = parts[0] || 'home';
    if (state.path !== pathPart) window.scrollTo(0, 0);
    state.path = pathPart;
    if (parts[0] === undefined) initHero();
    if (parts[0] === 'shop') renderShopGrid();
    if (parts[0] === 'product' && byId[parts[1]]) initProduct();
    if (parts[0] === 'checkout' && state.cart.length) renderTotals();
    $$('.nav-link').forEach((a) => a.classList.toggle('is-current', pathPart !== '/' && pathPart === a.getAttribute('href').slice(1)));
  }

  /* ---------- events ---------- */
  const scrollTrack = (tr, d) => tr.scrollBy({ left: d * tr.clientWidth * 0.85, behavior: reduceMotion ? 'auto' : 'smooth' });

  document.addEventListener('click', (e) => {
    if (e.target.id === 'modal') return closeLayers();
    const t = e.target.closest('[data-action]');
    if (!t) {
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
        let size = null;
        if (isStitched(byId[id])) {
          const sel = $('input[name="size"]:checked');
          $('#size-error').hidden = !!sel;
          if (!sel) { $('#sizes').scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'center' }); return; }
          size = sel.value;
        }
        addToCart(id, size, Number($('#pdp-qty').textContent));
        break;
      }
      case 'qv-add': {
        let size = null;
        if (isStitched(byId[id])) {
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
        l.qty = Math.min(10, l.qty + Number(t.dataset.d));
        if (l.qty < 1) state.cart = state.cart.filter((x) => x !== l);
        saveCart(); renderCart();
        break;
      }
      case 'remove': state.cart = state.cart.filter((x) => x.key !== t.dataset.key); saveCart(); renderCart(); break;
      case 'slide': heroCtl.go(Number(t.dataset.i)); break;
      case 'slide-step': heroCtl.step(Number(t.dataset.d)); break;
      case 'hero-pause': heroCtl.toggle(); break;
      case 'rail': scrollTrack(t.parentElement.querySelector('.rail-track'), Number(t.dataset.d)); break;
      case 'rail-to': scrollTrack(document.getElementById(t.dataset.target), Number(t.dataset.d)); break;
      case 'cols': shop.cols = Number(t.dataset.n); store.set('bes_cols', shop.cols); $$('[data-action="cols"]').forEach((b) => { const on = b === t; b.classList.toggle('is-on', on); b.setAttribute('aria-pressed', on); }); renderShopGrid(); break;
      case 'load-more': shop.shown += 12; renderShopGrid(); break;
      case 'clear-filters': {
        Object.assign(shop.f, { sub: [], fabric: [], size: [], color: [], max: null, sale: false, q: '' });
        $$('#filter-form input[type=checkbox]').forEach((c) => { c.checked = false; });
        $('#max').value = $('#max').max; $('#max-out').textContent = money(Number($('#max').max));
        renderShopGrid();
        break;
      }
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

  const EMAIL = /^\S+@\S+\.\S+$/;
  document.addEventListener('submit', (e) => {
    const f = e.target;
    e.preventDefault();
    if (f.dataset.form === 'search') {
      const q = $('#search-input').value.trim();
      if (q) { closeLayers(true); location.hash = `#/shop/all?q=${encodeURIComponent(q)}`; }
      return;
    }
    if (f.dataset.form === 'newsletter') {
      const err = $('[data-error="email"]', f);
      const ok = EMAIL.test(f.elements.email.value.trim());
      err.hidden = ok; err.textContent = ok ? '' : 'Enter an email like name@example.com.';
      if (ok) { f.reset(); toast('Welcome to the Inner Circle. Watch your inbox for new arrivals.'); }
      return;
    }
    if (f.dataset.form === 'contact') {
      const v = Object.fromEntries(new FormData(f));
      const errs = { name: !v.name.trim() && 'Enter your name.', email: !EMAIL.test(v.email) && 'Enter an email like name@example.com.', message: v.message.trim().length < 10 && 'Tell us a little more (at least 10 characters).' };
      $$('[data-error]', f).forEach((el) => { const m = errs[el.dataset.error]; el.hidden = !m; el.textContent = m || ''; });
      if (!Object.values(errs).some(Boolean)) { f.reset(); toast(`Thanks, ${esc(v.name.split(' ')[0])}. Your message is ready to send once a form backend is connected.`); }
      return;
    }
    if (f.dataset.form === 'account') {
      const err = $('[data-error="email"]', f);
      const ok = EMAIL.test(f.elements.email.value.trim());
      err.hidden = ok; err.textContent = ok ? '' : 'Enter the email you shop with.';
      if (ok) toast('Customer accounts switch on when the store backend is connected.');
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
    if (e.key === 'Tab') {
      const layer = $('.layer.is-open');
      if (!layer || (layer.id === 'filters' && window.innerWidth > 980)) return;
      const f = $$('a[href], button:not([disabled]), input:not([disabled]), select, textarea, summary', layer).filter((x) => x.offsetParent !== null);
      if (!f.length) return;
      if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus(); }
      else if (!e.shiftKey && document.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus(); }
    }
  });

  // Announcement bar: all three show on wide screens; narrow screens rotate them.
  (() => {
    const msgs = $$('.topbar-msg');
    if (reduceMotion || msgs.length < 2) return;
    let i = 0;
    setInterval(() => { msgs[i].classList.remove('is-active'); i = (i + 1) % msgs.length; msgs[i].classList.add('is-active'); }, 4200);
  })();

  const header = $('#header');
  window.addEventListener('scroll', () => header.classList.toggle('is-scrolled', window.scrollY > 40), { passive: true });

  /* ---------- boot ---------- */
  $$('[data-icon]').forEach((el) => el.insertAdjacentHTML('afterbegin', icon(el.dataset.icon)));
  $$('[data-year]').forEach((el) => { el.textContent = new Date().getFullYear(); });
  buildNav();
  updateCounts();
  renderCart();
  window.addEventListener('hashchange', route);
  route();
})();
