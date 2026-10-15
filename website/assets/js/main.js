// Unify Club — shared site behavior (no build step, no dependencies)
document.addEventListener('DOMContentLoaded', () => {
  /* Dark / light theme toggle. The initial theme is already applied by a
     tiny inline script in <head> (before CSS loads) to avoid a flash of
     the wrong theme — this just wires up the button and keeps it in sync. */
  const themeToggle = document.querySelector('[data-theme-toggle]');
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      if (isDark) {
        document.documentElement.removeAttribute('data-theme');
        try { localStorage.setItem('unify-theme', 'light'); } catch (e) {}
      } else {
        document.documentElement.setAttribute('data-theme', 'dark');
        try { localStorage.setItem('unify-theme', 'dark'); } catch (e) {}
      }
    });
  }

  /* English / Urdu toggle — see assets/js/i18n.js for the dictionary and
     coverage notes. Swaps data-i18n element text and flips <html lang>. */
  const langToggle = document.querySelector('[data-lang-toggle]');
  const dict = window.UNIFY_I18N || { en: {}, ur: {} };
  function applyLanguage(lang) {
    const strings = dict[lang] || dict.en;
    document.documentElement.setAttribute('lang', lang);
    document.querySelectorAll('[data-i18n]').forEach((el) => {
      const key = el.dataset.i18n;
      if (strings[key]) el.textContent = strings[key];
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach((el) => {
      const key = el.dataset.i18nPlaceholder;
      if (strings[key]) el.setAttribute('placeholder', strings[key]);
    });
    // Image alt text is real accessibility content, not decorative — it
    // localizes the same way text/placeholders do, via a dedicated
    // attribute (alt can't carry a data-i18n child the way text can).
    document.querySelectorAll('[data-i18n-alt]').forEach((el) => {
      const key = el.dataset.i18nAlt;
      if (strings[key]) el.setAttribute('alt', strings[key]);
    });
    // aria-label is screen-reader-only text (e.g. icon-only buttons) — same
    // treatment as alt text, so assistive tech also gets the right language.
    document.querySelectorAll('[data-i18n-aria]').forEach((el) => {
      const key = el.dataset.i18nAria;
      if (strings[key]) el.setAttribute('aria-label', strings[key]);
    });
    document.querySelectorAll('[data-lang-label]').forEach((el) => {
      el.textContent = lang === 'ur' ? 'EN' : 'UR';
    });
    document.body.classList.toggle('lang-ur', lang === 'ur');
  }
  let currentLang = 'en';
  try { currentLang = localStorage.getItem('unify-lang') || 'en'; } catch (e) {}
  if (currentLang === 'ur') applyLanguage('ur');
  if (langToggle) {
    langToggle.addEventListener('click', () => {
      currentLang = currentLang === 'ur' ? 'en' : 'ur';
      applyLanguage(currentLang);
      try { localStorage.setItem('unify-lang', currentLang); } catch (e) {}
    });
  }

  /* Mobile nav toggle */
  const navToggle = document.querySelector('[data-nav-toggle]');
  if (navToggle) {
    navToggle.addEventListener('click', () => {
      document.body.classList.toggle('nav-open');
      const expanded = document.body.classList.contains('nav-open');
      navToggle.setAttribute('aria-expanded', String(expanded));
    });
    document.querySelectorAll('.nav-links > a, .dropdown-panel a').forEach((link) => {
      link.addEventListener('click', () => document.body.classList.remove('nav-open'));
    });
  }

  /* Dropdown nav items: hover/focus on desktop (CSS-only), tap-to-expand on mobile */
  document.querySelectorAll('.nav-item.has-dropdown > a').forEach((trigger) => {
    trigger.addEventListener('click', (event) => {
      if (window.matchMedia('(max-width: 1080px)').matches) {
        event.preventDefault();
        const item = trigger.parentElement;
        document.querySelectorAll('.nav-item.dropdown-open').forEach((open) => {
          if (open !== item) open.classList.remove('dropdown-open');
        });
        item.classList.toggle('dropdown-open');
      }
    });
  });

  /* Mark active nav link based on current page */
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a[data-page]').forEach((link) => {
    if (link.dataset.page === path) link.classList.add('active');
  });
  document.querySelectorAll('.dropdown-panel a.active').forEach((child) => {
    const parentTrigger = child.closest('.nav-item')?.querySelector(':scope > a');
    parentTrigger?.classList.add('active');
  });

  /* Scroll reveal */
  const revealTargets = document.querySelectorAll('[data-reveal], [data-reveal-group]');
  if ('IntersectionObserver' in window && revealTargets.length) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.14, rootMargin: '0px 0px -40px 0px' }
    );
    revealTargets.forEach((el) => io.observe(el));
  } else {
    revealTargets.forEach((el) => el.classList.add('in'));
  }

  /* Animated stat counters */
  const counters = document.querySelectorAll('[data-count]');
  if ('IntersectionObserver' in window && counters.length) {
    const countIo = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target;
          const target = parseInt(el.dataset.count, 10) || 0;
          const suffix = el.dataset.suffix || '';
          const duration = 1400;
          const start = performance.now();
          const step = (now) => {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            el.textContent = Math.round(eased * target).toLocaleString() + suffix;
            if (progress < 1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
          countIo.unobserve(el);
        });
      },
      { threshold: 0.5 }
    );
    counters.forEach((el) => countIo.observe(el));
  }

  /* FAQ / accordion */
  document.querySelectorAll('.accordion-item').forEach((item) => {
    const trigger = item.querySelector('.accordion-trigger');
    const panel = item.querySelector('.accordion-panel');
    if (!trigger || !panel) return;
    trigger.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      item.parentElement.querySelectorAll('.accordion-item.open').forEach((openItem) => {
        if (openItem !== item) {
          openItem.classList.remove('open');
          openItem.querySelector('.accordion-panel').style.maxHeight = null;
        }
      });
      item.classList.toggle('open', !isOpen);
      panel.style.maxHeight = !isOpen ? panel.scrollHeight + 'px' : null;
    });
  });

  /* Lead forms (Book a Trial / Contact / Volunteer) — submit into the CRM's
     Leads module via POST /public/leads, then show a real 3-step tracker
     driven by the lead's actual stage, not a static "thank you" message.
     See website/docs/SECURITY.md §API Security and ARCHITECTURE.md §6. */
  const API_BASE_URL = (window.UNIFY_API_BASE_URL || '').replace(/\/+$/, '');
  // Dictionary lookup for JS-rendered strings (tracker steps, status/error
  // text) so they honor the current language exactly like data-i18n markup
  // does — these are built at render time from `t()`, never hardcoded
  // English, so switching to Urdu never leaves English text behind in
  // dynamically-generated content. Falls back to the English literal passed
  // as `fallback` if a key is somehow missing from the dictionary.
  function t(key, fallback) {
    const strings = dict[currentLang] || dict.en;
    return strings[key] || fallback;
  }
  function trackerSteps() {
    return [
      { n: 1, label: t('tracker.step1', 'Submitted') },
      { n: 2, label: t('tracker.step2', 'Our team reviews') },
      { n: 3, label: t('tracker.step3', 'Confirmed & scheduled') },
    ];
  }

  function buildLeadPayload(form) {
    const data = Object.fromEntries(new FormData(form).entries());
    const formType = form.dataset.formType;
    const payload = { formType, website: data.website || '' };
    if (formType === 'trial') {
      Object.assign(payload, {
        parentName: data.parent, phone: data.phone, email: data.email,
        childName: data.child, childAge: data.age, program: data.program,
        preferredDay: data.day, preferredTime: data.time, message: data.notes,
      });
    } else if (formType === 'contact') {
      Object.assign(payload, {
        parentName: data.name, email: data.email, phone: data.phone,
        subject: data.subject, message: data.message,
      });
    } else if (formType === 'volunteer') {
      Object.assign(payload, {
        parentName: data.name, email: data.email, phone: data.phone,
        interestArea: data.interest, availability: data.availability, message: data.message,
      });
    }
    return payload;
  }

  function renderTracker(container, result) {
    if (!container) return;
    if (result.errorMessage) {
      container.innerHTML =
        '<div class="lead-tracker lead-tracker--error">' +
        '<svg><use href="#i-close"/></svg>' +
        '<div><strong>' + t('tracker.error.title', 'We couldn’t submit this right now.') + '</strong>' +
        '<p>' + result.errorMessage + ' ' + t('tracker.error.fallback', 'Please call') + ' <a href="tel:+923141123441">+92 314 1123 441</a> ' + t('tracker.error.or', 'or email') + ' ' +
        '<a href="mailto:Info@unifyclub.org">Info@unifyclub.org</a> ' + t('tracker.error.directly', 'directly and we’ll take it from there.') + '</p></div></div>';
      container.classList.add('show');
      return;
    }
    const stepsHtml = trackerSteps().map((s) => {
      const state = s.n < result.step ? 'is-done' : s.n === result.step ? 'is-current' : '';
      const dot = s.n < result.step ? '<svg><use href="#i-check"/></svg>' : String(s.n);
      return '<div class="lead-tracker-step ' + state + '"><span class="lead-tracker-dot">' + dot +
        '</span><span class="lead-tracker-label">' + s.label + '</span></div>';
    }).join('');
    container.innerHTML =
      '<div class="lead-tracker"><div class="lead-tracker-steps">' + stepsHtml + '</div>' +
      '<p class="lead-tracker-note">' + t('tracker.status', 'Current status:') + ' <strong>' + result.stepLabel + '</strong>. ' + t('tracker.reference', 'Reference:') + ' <code>' +
      result.id + '</code> — ' + t('tracker.save', 'save this to check your status anytime.') + '</p></div>';
    container.classList.add('show');
  }

  function rememberSubmission(id, formType) {
    try {
      const saved = JSON.parse(localStorage.getItem('unify-submissions') || '[]');
      saved.push({ id, formType, at: Date.now() });
      localStorage.setItem('unify-submissions', JSON.stringify(saved.slice(-10)));
    } catch (e) { /* localStorage unavailable — non-fatal, reference still shown on screen */ }
  }

  document.querySelectorAll('[data-lead-form]').forEach((form) => {
    const tracker = form.parentElement.querySelector('[data-lead-tracker]');
    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      if (!API_BASE_URL) {
        renderTracker(tracker, { errorMessage: t('tracker.not_connected', 'This site isn’t connected to our booking system yet.') });
        return;
      }
      const submitBtn = form.querySelector('button[type="submit"]');
      if (submitBtn) submitBtn.disabled = true;
      try {
        const res = await fetch(API_BASE_URL + '/public/leads', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(buildLeadPayload(form)),
        });
        const body = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(body.message || ('Server returned ' + res.status));
        rememberSubmission(body.id, form.dataset.formType);
        form.hidden = true;
        renderTracker(tracker, body);
        tracker?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      } catch (err) {
        renderTracker(tracker, { errorMessage: err.message || 'Something went wrong.' });
      } finally {
        if (submitBtn) submitBtn.disabled = false;
      }
    });
  });

  /* Status lookup widget (e.g. on contact.html) — lets a returning visitor
     check progress on a submission by its reference code. */
  document.querySelectorAll('[data-status-form]').forEach((form) => {
    const input = form.querySelector('input[name="reference"]');
    const result = document.querySelector(form.dataset.statusForm);
    try {
      const saved = JSON.parse(localStorage.getItem('unify-submissions') || '[]');
      if (input && !input.value && saved.length) input.value = saved[saved.length - 1].id;
    } catch (e) { /* no saved reference available — leave input blank */ }
    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      const id = input?.value.trim();
      if (!id || !API_BASE_URL) return;
      try {
        const res = await fetch(API_BASE_URL + '/public/leads/' + encodeURIComponent(id) + '/status');
        const body = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(body.message || t('tracker.not_found', 'We couldn’t find that reference.'));
        renderTracker(result, body);
      } catch (err) {
        renderTracker(result, { errorMessage: err.message || t('tracker.not_found', 'We couldn’t find that reference.') });
      }
    });
  });

  /* Simple lightbox for gallery tiles */
  const lightbox = document.querySelector('[data-lightbox]');
  if (lightbox) {
    const lbTitle = lightbox.querySelector('[data-lightbox-title]');
    const lbTag = lightbox.querySelector('[data-lightbox-tag]');
    const lbTile = lightbox.querySelector('[data-lightbox-tile]');
    document.querySelectorAll('[data-gallery-item]').forEach((item) => {
      item.addEventListener('click', () => {
        // Prefer a dictionary lookup (data-title-key/data-tag-key) so the
        // lightbox honors the current language exactly like the tile
        // caption beside it; data-title/data-tag stay as the English
        // fallback for any tile that doesn't carry a key.
        lbTitle.textContent = t(item.dataset.titleKey, item.dataset.title) || '';
        lbTag.textContent = t(item.dataset.tagKey, item.dataset.tag) || '';
        lbTile.className = 'photo-tile ' + (item.dataset.tone || '');
        // Prefer the tile's real photo (assets/img/) if it has one; fall
        // back to the illustrated tile-icon for any tile that doesn't.
        lbTile.innerHTML = item.querySelector('img')?.outerHTML || item.querySelector('.tile-icon')?.outerHTML || '';
        lightbox.classList.add('show');
        document.body.style.overflow = 'hidden';
      });
    });
    lightbox.addEventListener('click', (event) => {
      if (event.target === lightbox || event.target.closest('[data-lightbox-close]')) {
        lightbox.classList.remove('show');
        document.body.style.overflow = '';
      }
    });
  }

  /* Testimonial / story slider (simple index-based show/hide) */
  document.querySelectorAll('[data-slider]').forEach((slider) => {
    const slides = slider.querySelectorAll('[data-slide]');
    const prev = slider.querySelector('[data-slide-prev]');
    const next = slider.querySelector('[data-slide-next]');
    let index = 0;
    const show = (i) => {
      slides.forEach((s, si) => s.classList.toggle('is-active', si === i));
    };
    show(0);
    prev?.addEventListener('click', () => { index = (index - 1 + slides.length) % slides.length; show(index); });
    next?.addEventListener('click', () => { index = (index + 1) % slides.length; show(index); });
  });

  /* Footer year */
  document.querySelectorAll('[data-year]').forEach((el) => { el.textContent = new Date().getFullYear(); });

  /* Home hero: scroll-linked parallax on the photo collage and decorative
     blobs (index.html only — these selectors simply find nothing on every
     other page). A plain rAF-throttled scroll listener sets the CSS custom
     properties --parallax-y/--blob-y that style.css reads; see the "Home
     hero entrance choreography" comment there for the rest of this moment.
     No listener is attached at all if the hero isn't on the page, and the
     listener stops doing work (but isn't removed) once the hero has
     scrolled well out of view, since it's cheap and the user may scroll
     back up. prefers-reduced-motion skips the effect entirely. */
  const heroSection = document.querySelector('.home-hero');
  const heroVisual = heroSection?.querySelector('[data-parallax]');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (heroSection && heroVisual && !prefersReducedMotion) {
    let parallaxTicking = false;
    const updateParallax = () => {
      parallaxTicking = false;
      const rect = heroSection.getBoundingClientRect();
      if (rect.bottom < 0 || rect.top > window.innerHeight) return;
      const progress = Math.min(Math.max(-rect.top / Math.max(rect.height, 1), 0), 1);
      heroVisual.style.setProperty('--parallax-y', (progress * -72) + 'px');
      heroSection.querySelectorAll('.blob').forEach((blob, i) => {
        blob.style.setProperty('--blob-y', (progress * (i === 0 ? 80 : 110)) + 'px');
      });
      const orb = heroSection.querySelector('.hero-orb');
      if (orb) orb.style.setProperty('--orb-shift', (progress * -60) + 'px');
    };
    updateParallax();
    window.addEventListener('scroll', () => {
      if (!parallaxTicking) { parallaxTicking = true; requestAnimationFrame(updateParallax); }
    }, { passive: true });
  }

  /* Home hero: magnetic hover on the two primary CTAs — on pointer devices
     with real hover (not touch), the button drifts a few px toward the
     cursor while hovered and eases back to rest on mouseleave. Bounded to a
     small max offset so it reads as a gentle pull, never a jump. */
  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches && !prefersReducedMotion) {
    document.querySelectorAll('[data-magnetic]').forEach((btn) => {
      const maxOffset = 10;
      btn.addEventListener('mousemove', (event) => {
        const rect = btn.getBoundingClientRect();
        const relX = (event.clientX - rect.left) / rect.width - 0.5;
        const relY = (event.clientY - rect.top) / rect.height - 0.5;
        btn.style.transform = 'translate(' + (relX * maxOffset * 2).toFixed(1) + 'px,' + (relY * maxOffset).toFixed(1) + 'px)';
      });
      btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
    });
  }
});
