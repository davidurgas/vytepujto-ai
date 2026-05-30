/* ============================================================
   VYTEPUJTO.SK — Main JavaScript
   Vanilla JS, no dependencies
   ============================================================ */

'use strict';

document.addEventListener('DOMContentLoaded', () => {
  initHeader();
  initMobileMenu();
  initFAQ();
  initCounters();
  initScrollAnimations();
  initSmoothScroll();
  initGalleryFilter();
  initContactForm();
});

/* ---- Header scroll behaviour ---- */
function initHeader() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  const onScroll = () => {
    header.classList.toggle('scrolled', window.scrollY > 60);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* ---- Mobile hamburger menu ---- */
function initMobileMenu() {
  const btn    = document.querySelector('.hamburger');
  const drawer = document.querySelector('.mobile-drawer');
  if (!btn || !drawer) return;

  btn.addEventListener('click', () => {
    const open = btn.classList.toggle('active');
    drawer.classList.toggle('open', open);
    btn.setAttribute('aria-expanded', open);
  });

  document.addEventListener('click', e => {
    if (!btn.contains(e.target) && !drawer.contains(e.target)) {
      btn.classList.remove('active');
      drawer.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
    }
  });

  /* Close drawer when a link is clicked */
  drawer.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      btn.classList.remove('active');
      drawer.classList.remove('open');
    });
  });
}

/* ---- FAQ accordion ---- */
function initFAQ() {
  const items = document.querySelectorAll('.faq-item');
  if (!items.length) return;

  items.forEach(item => {
    const q = item.querySelector('.faq-q');
    q.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      items.forEach(i => i.classList.remove('open'));
      if (!isOpen) item.classList.add('open');
    });

    /* Keyboard accessibility */
    q.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); q.click(); }
    });
    q.setAttribute('tabindex', '0');
    q.setAttribute('role', 'button');
  });
}

/* ---- Animated number counters ---- */
function initCounters() {
  const els = document.querySelectorAll('[data-count]');
  if (!els.length) return;

  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        runCounter(entry.target);
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  els.forEach(el => io.observe(el));
}

function runCounter(el) {
  const target   = parseFloat(el.dataset.count);
  const suffix   = el.dataset.suffix || '';
  const prefix   = el.dataset.prefix || '';
  const decimals = (target % 1 !== 0) ? 1 : 0;
  const duration = 2000;
  const fps      = 60;
  const increment = target / (duration / (1000 / fps));
  let current = 0;

  const tick = () => {
    current += increment;
    if (current >= target) {
      el.textContent = prefix + target.toFixed(decimals).replace('.', ',') + suffix;
      return;
    }
    el.textContent = prefix + current.toFixed(decimals).replace('.', ',') + suffix;
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

/* ---- Scroll-triggered fade animations ---- */
function initScrollAnimations() {
  const els = document.querySelectorAll('.fade-up, .fade-left, .fade-right');
  if (!els.length) return;

  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  els.forEach(el => io.observe(el));
}

/* ---- Smooth scroll for anchor links ---- */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const target = document.querySelector(link.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const offset = 90; // header height
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
}

/* ---- Gallery category filter ---- */
function initGalleryFilter() {
  const btns  = document.querySelectorAll('.filter-btn');
  const items = document.querySelectorAll('.gallery-item[data-cat]');
  if (!btns.length) return;

  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      btns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const cat = btn.dataset.filter;
      items.forEach(item => {
        const show = cat === 'all' || item.dataset.cat === cat;
        item.style.display = show ? '' : 'none';
      });
    });
  });
}

/* ---- Contact form ---- */
function initContactForm() {
  const form = document.getElementById('kontaktForm');
  if (!form) return;

  form.addEventListener('submit', async e => {
    e.preventDefault();
    const btn  = form.querySelector('button[type="submit"]');
    const orig = btn.textContent;

    btn.textContent = 'Odosiela sa…';
    btn.disabled = true;

    /* Simulate async send — replace with real fetch() call to your backend */
    await new Promise(r => setTimeout(r, 1400));

    btn.textContent  = '✓ Správa odoslaná!';
    btn.style.background = '#22c55e';
    btn.style.borderColor = '#22c55e';

    setTimeout(() => {
      btn.textContent  = orig;
      btn.disabled     = false;
      btn.style.background = '';
      btn.style.borderColor = '';
      form.reset();
    }, 3500);
  });
}

/* ---- Active nav link highlighting ---- */
(function highlightNav() {
  const path = window.location.pathname.replace(/\/$/, '') || '/';
  document.querySelectorAll('.nav-link, .mobile-drawer a').forEach(a => {
    const href = a.getAttribute('href').replace(/\/$/, '') || '/';
    if (href === path) a.setAttribute('aria-current', 'page');
  });
})();
