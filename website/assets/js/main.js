// Unify Club — shared site behavior (no build step, no dependencies)
document.addEventListener('DOMContentLoaded', () => {
  /* Mobile nav toggle */
  const navToggle = document.querySelector('[data-nav-toggle]');
  if (navToggle) {
    navToggle.addEventListener('click', () => {
      document.body.classList.toggle('nav-open');
      const expanded = document.body.classList.contains('nav-open');
      navToggle.setAttribute('aria-expanded', String(expanded));
    });
    document.querySelectorAll('.nav-links a').forEach((link) => {
      link.addEventListener('click', () => document.body.classList.remove('nav-open'));
    });
  }

  /* Mark active nav link based on current page */
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a[data-page]').forEach((link) => {
    if (link.dataset.page === path) link.classList.add('active');
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

  /* Demo forms: booking / contact — no backend wired up yet, so we
     confirm locally and let visitors know we'll follow up by phone/email. */
  document.querySelectorAll('[data-demo-form]').forEach((form) => {
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const success = form.parentElement.querySelector('.form-success');
      if (success) {
        success.classList.add('show');
        success.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
      form.reset();
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
        lbTitle.textContent = item.dataset.title || '';
        lbTag.textContent = item.dataset.tag || '';
        lbTile.className = 'photo-tile ' + (item.dataset.tone || '');
        lbTile.innerHTML = item.querySelector('.tile-icon')?.outerHTML || '';
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
});
