/* Unify Organica — theme behaviour (no dependencies) */
(function () {
  'use strict';
  var routes = window.routes || { root: '/', cart: '/cart', cartAdd: '/cart/add', cartChange: '/cart/change' };
  var rootUrl = routes.root.replace(/\/$/, '') + '/';

  /* ---------- Scroll reveal ---------- */
  function initReveal(scope) {
    var els = (scope || document).querySelectorAll('.reveal:not(.is-in)');
    if (!('IntersectionObserver' in window)) { els.forEach(function (el) { el.classList.add('is-in'); }); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    els.forEach(function (el) { io.observe(el); });
  }

  /* ---------- Details helpers (mobile nav / search) ---------- */
  document.addEventListener('click', function (e) {
    var closer = e.target.closest('[data-close-details]');
    if (closer) { var d = closer.closest('details'); if (d) d.removeAttribute('open'); }
    document.querySelectorAll('details.search-pop[open], details.mobile-nav[open]').forEach(function (d) {
      if (!d.contains(e.target)) d.removeAttribute('open');
    });
  });

  /* ---------- Toast ---------- */
  var toastEl;
  function toast(msg) {
    if (!toastEl) { toastEl = document.createElement('div'); toastEl.className = 'toast'; toastEl.setAttribute('role', 'status'); document.body.appendChild(toastEl); }
    toastEl.textContent = msg;
    toastEl.classList.add('is-visible');
    clearTimeout(toastEl._t);
    toastEl._t = setTimeout(function () { toastEl.classList.remove('is-visible'); }, 2600);
  }

  /* ---------- Cart drawer ---------- */
  function drawer() { return document.querySelector('[data-cart-drawer]'); }
  function openDrawer() {
    var d = drawer(); if (!d) return;
    d.classList.add('is-open'); d.setAttribute('aria-hidden', 'false');
    document.documentElement.style.overflow = 'hidden';
    var btn = d.querySelector('[data-cart-close].icon-btn'); if (btn) btn.focus();
  }
  function closeDrawer() {
    var d = drawer(); if (!d) return;
    d.classList.remove('is-open'); d.setAttribute('aria-hidden', 'true');
    document.documentElement.style.overflow = '';
  }
  function updateCount(count) {
    document.querySelectorAll('[data-cart-count]').forEach(function (el) {
      el.textContent = count;
      el.classList.toggle('is-empty', count === 0);
      el.classList.remove('bump'); void el.offsetWidth; el.classList.add('bump');
    });
  }
  function refreshDrawer() {
    return fetch(rootUrl + '?sections=cart-drawer', { credentials: 'same-origin' })
      .then(function (r) { return r.json(); })
      .then(function (data) {
        var html = data['cart-drawer']; var d = drawer();
        if (!html || !d) return;
        var tmp = document.createElement('div'); tmp.innerHTML = html;
        var fresh = tmp.querySelector('.drawer__panel');
        var current = d.querySelector('.drawer__panel');
        if (fresh && current) current.innerHTML = fresh.innerHTML;
      })
      .then(function () { return fetch(routes.cart + '.js', { credentials: 'same-origin' }); })
      .then(function (r) { return r.json(); })
      .then(function (cart) { updateCount(cart.item_count); });
  }

  document.addEventListener('click', function (e) {
    if (e.target.closest('[data-cart-open]') && drawer()) { e.preventDefault(); openDrawer(); return; }
    if (e.target.closest('[data-cart-close]')) { closeDrawer(); return; }
    var change = e.target.closest('[data-line-change]');
    if (change) {
      change.disabled = true;
      fetch(routes.cartChange + '.js', {
        method: 'POST', credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ line: parseInt(change.dataset.lineChange, 10), quantity: Math.max(0, parseInt(change.dataset.qty, 10)) })
      }).then(refreshDrawer).catch(function () { change.disabled = false; });
    }
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeDrawer(); });

  /* AJAX add to cart for any product form flagged with data-ajax-cart */
  document.addEventListener('submit', function (e) {
    var form = e.target;
    if (!form.matches('form[data-ajax-cart]') || !window.fetch) return;
    e.preventDefault();
    var btn = form.querySelector('[type="submit"]');
    if (btn) { btn.disabled = true; btn.setAttribute('aria-busy', 'true'); }
    fetch(routes.cartAdd + '.js', {
      method: 'POST', credentials: 'same-origin',
      headers: { Accept: 'application/json', 'X-Requested-With': 'XMLHttpRequest' },
      body: new FormData(form)
    })
      .then(function (r) { return r.json().then(function (j) { return { ok: r.ok, body: j }; }); })
      .then(function (res) {
        if (!res.ok) { toast(res.body.description || res.body.message || 'Could not add to bag'); return; }
        return refreshDrawer().then(function () {
          if (drawer()) openDrawer(); else toast('Added to your bag');
        });
      })
      .catch(function () { form.removeAttribute('data-ajax-cart'); form.submit(); })
      .finally(function () { if (btn) { btn.disabled = false; btn.removeAttribute('aria-busy'); } });
  });

  /* ---------- Quantity steppers ---------- */
  document.addEventListener('click', function (e) {
    var step = e.target.closest('[data-qty-step]'); if (!step) return;
    var input = step.parentElement.querySelector('input[type="number"]'); if (!input) return;
    var v = (parseInt(input.value, 10) || 1) + parseInt(step.dataset.qtyStep, 10);
    input.value = Math.max(parseInt(input.min || '1', 10), v);
  });

  /* ---------- Product page: variant price + gallery ---------- */
  function initProduct() {
    var section = document.querySelector('[data-product-section]'); if (!section) return;
    var json = section.querySelector('[data-variants]');
    var variants = json ? JSON.parse(json.textContent) : [];
    var form = section.querySelector('[data-product-form]');
    var nowEl = section.querySelector('[data-price-now]');
    var wasEl = section.querySelector('[data-price-was]');
    var addBtn = section.querySelector('[data-add-btn]');
    var fmt = function (cents) {
      try { return new Intl.NumberFormat(document.documentElement.lang || undefined, { style: 'currency', currency: (window.Shopify && Shopify.currency && Shopify.currency.active) || 'USD' }).format(cents / 100); }
      catch (err) { return (cents / 100).toFixed(2); }
    };
    if (form) form.addEventListener('change', function (e) {
      if (e.target.name !== 'id') return;
      var id = parseInt(e.target.value, 10);
      var v = variants.find(function (x) { return x.id === id; }); if (!v) return;
      if (nowEl) nowEl.textContent = fmt(v.price);
      if (wasEl) { wasEl.hidden = !(v.compare_at_price > v.price); if (v.compare_at_price) wasEl.textContent = fmt(v.compare_at_price); }
      if (addBtn) { addBtn.disabled = !v.available; addBtn.textContent = v.available ? 'Add to bag' : 'Sold out'; }
      if (v.featured_media) showMedia(v.featured_media.id);
      var url = new URL(window.location.href); url.searchParams.set('variant', id); history.replaceState({}, '', url);
    });
    function showMedia(id) {
      section.querySelectorAll('[data-media-id]').forEach(function (s) { s.classList.toggle('is-active', String(s.dataset.mediaId) === String(id)); });
      section.querySelectorAll('[data-thumb]').forEach(function (t) { t.classList.toggle('is-active', String(t.dataset.thumb) === String(id)); });
    }
    section.addEventListener('click', function (e) { var t = e.target.closest('[data-thumb]'); if (t) showMedia(t.dataset.thumb); });
  }

  /* ---------- Product recommendations ---------- */
  function initRecommendations() {
    document.querySelectorAll('[data-recommendations]').forEach(function (el) {
      if (el.querySelector('.grid')) return;
      fetch(el.dataset.url).then(function (r) { return r.text(); }).then(function (html) {
        var tmp = document.createElement('div'); tmp.innerHTML = html;
        var inner = tmp.querySelector('[data-recommendations]');
        if (inner && inner.innerHTML.trim()) { el.innerHTML = inner.innerHTML; initReveal(el); }
      }).catch(function () {});
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    initReveal();
    initProduct();
    initRecommendations();
  });
  document.addEventListener('shopify:section:load', function (e) { initReveal(e.target); initProduct(); });
})();
