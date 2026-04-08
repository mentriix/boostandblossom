/* =============================================
   BOOST & BLOSSOM — JS
   ============================================= */

// ---- Mobile menu toggle ----
const hamburger = document.getElementById('hamburger');
const navMenu   = document.getElementById('nav-menu');

hamburger.addEventListener('click', () => {
  navMenu.classList.toggle('open');
  hamburger.classList.toggle('active');
});

navMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navMenu.classList.remove('open');
    hamburger.classList.remove('active');
  });
});

// ---- Navbar scroll shadow (passive para no bloquear scroll) ----
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });

// ---- Dark mode ----
(function () {
  const btn = document.getElementById('theme-toggle');
  if (!btn) return;

  if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark-mode');
  }

  btn.addEventListener('click', function () {
    const isDark = !document.body.classList.contains('dark-mode');
    const apply = () => {
      document.body.classList.toggle('dark-mode');
      localStorage.setItem('theme', isDark ? 'dark' : 'light');
    };
    if (document.startViewTransition) {
      document.startViewTransition(apply);
    } else {
      apply();
    }
  });
})();

// ---- FAQ accordion (grid-template-rows — sin max-height jank) ----
document.querySelectorAll('.faq__question').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.parentElement;
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.faq__item.open').forEach(el => {
      el.classList.remove('open');
      el.querySelector('.faq__question').setAttribute('aria-expanded', 'false');
    });
    if (!isOpen) {
      item.classList.add('open');
      btn.setAttribute('aria-expanded', 'true');
    }
  });
});

// ---- Navbar active state en scroll ----
(function () {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.navbar__nav a[href^="#"]');

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === '#' + entry.target.id);
        });
      }
    });
  }, { rootMargin: '-25% 0px -70% 0px' });

  sections.forEach(s => observer.observe(s));
})();

// ---- Cookie banner ----
(function () {
  const banner = document.getElementById('cookie-banner');
  if (!banner) return;

  // Si ya decidió, no mostrar
  if (localStorage.getItem('cookies')) return;

  // Mostrar con pequeño delay para no solapar la entrada del hero
  setTimeout(() => banner.classList.add('visible'), 1800);

  const dismiss = accepted => {
    banner.classList.remove('visible');
    localStorage.setItem('cookies', accepted ? 'accepted' : 'rejected');
    setTimeout(() => banner.remove(), 600);
  };

  document.getElementById('cookie-accept').addEventListener('click', () => dismiss(true));
  document.getElementById('cookie-reject').addEventListener('click', () => dismiss(false));

  // Modal "Más info" del banner
  document.getElementById('cookie-info-btn')
    .addEventListener('click', () => openModal('cookie-modal'));
})();

// ---- Sistema de modales legales ----
(function () {
  const openModal = id => {
    const m = document.getElementById(id);
    if (m) m.classList.add('visible');
  };
  const closeModal = id => {
    const m = document.getElementById(id);
    if (m) m.classList.remove('visible');
  };

  // Exponer openModal globalmente para el banner de cookies
  window.openModal = openModal;

  // Botones de apertura desde el footer
  document.getElementById('btn-privacidad')
    ?.addEventListener('click', () => openModal('modal-privacidad'));
  document.getElementById('btn-aviso')
    ?.addEventListener('click', () => openModal('modal-aviso'));
  document.getElementById('btn-cookies-footer')
    ?.addEventListener('click', () => openModal('cookie-modal'));

  // Cerrar con data-close, backdrop y Escape — aplica a todos los modales
  document.addEventListener('click', e => {
    const id = e.target.dataset.close;
    if (id) closeModal(id);
  });
  document.addEventListener('keydown', e => {
    if (e.key !== 'Escape') return;
    document.querySelectorAll('.cookie-modal.visible')
      .forEach(m => m.classList.remove('visible'));
  });

  // Cerrar modal de cookies del banner (botón X con id fijo)
  document.getElementById('cookie-modal-close')
    ?.addEventListener('click', () => closeModal('cookie-modal'));
  document.getElementById('cookie-modal-close-btn')
    ?.addEventListener('click', () => closeModal('cookie-modal'));
  document.getElementById('cookie-modal-backdrop')
    ?.addEventListener('click', () => closeModal('cookie-modal'));
})();

// ---- Contact form — Netlify Forms (pendiente de integrar) ----

// ---- Scroll reveal — CSS classes, translateY + opacity, stagger elegante ----
(function () {
  const SELECTOR =
    '.service-card, .sobre-mi__text, .contacto__form, .contacto__info, ' +
    '.proceso__step, .proceso__connector, .faq__item, .filosofia__valores, ' +
    '.filosofia__derecha, .stat, .manifesto__quote, .suena-card';

  // Marcar elementos antes de que se pinte la página
  document.querySelectorAll('section').forEach(section => {
    const els = section.querySelectorAll(SELECTOR);
    if (!els.length) return;

    els.forEach((el, i) => {
      el.classList.add('scroll-hidden');
      el.style.transitionDelay = Math.min(i * 0.07, 0.28) + 's';
    });
  });

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('revealed');
      observer.unobserve(entry.target);
      // Limpiar delay tras animación para no afectar hover-transitions
      entry.target.addEventListener('transitionend', () => {
        entry.target.style.transitionDelay = '';
      }, { once: true });
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll(SELECTOR).forEach(el => observer.observe(el));
})();

// ---- Section headings reveal — label primero, luego h2 ----
(function () {
  document.querySelectorAll('section').forEach(section => {
    const label = section.querySelector('.section-label');
    const title = section.querySelector('.section-title');
    const intro = section.querySelector('.section-intro');

    [label, title, intro].forEach((el, i) => {
      if (!el) return;
      el.classList.add('section-heading-hidden');
      el.style.transitionDelay = (i * 0.12) + 's';
    });
  });

  const headingObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const section = entry.target;
      section.querySelectorAll('.section-heading-hidden').forEach(el => {
        el.classList.add('revealed');
        el.addEventListener('transitionend', () => {
          el.style.transitionDelay = '';
        }, { once: true });
      });
      headingObserver.unobserve(section);
    });
  }, { threshold: 0.15 });

  document.querySelectorAll('section').forEach(s => headingObserver.observe(s));
})();

// ---- Stats counter — anima números al entrar en viewport ----
(function () {
  const stats = document.querySelectorAll('.stat__num');
  if (!stats.length) return;

  const parseTarget = text => {
    const clean = text.replace(/[^0-9.]/g, '');
    return parseFloat(clean) || 0;
  };

  const formatStat = (el, value) => {
    const original = el.dataset.original;
    if (original.startsWith('×'))      return '×' + Math.round(value);
    if (original.endsWith('%'))        return Math.round(value) + '%';
    if (original.endsWith('h'))        return Math.round(value) + 'h';
    if (original.startsWith('0') && original.endsWith('€')) return '0€';
    return original;
  };

  stats.forEach(el => {
    el.dataset.original = el.textContent.trim();
  });

  const counterObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const original = el.dataset.original;
      const target = parseTarget(original);

      if (target === 0 || original === '0€') {
        counterObserver.unobserve(el);
        return;
      }

      const duration = 1400;
      const start = performance.now();

      const tick = now => {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        // easeOutExpo
        const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
        el.textContent = formatStat(el, eased * target);
        if (progress < 1) requestAnimationFrame(tick);
        else el.textContent = original;
      };

      requestAnimationFrame(tick);
      counterObserver.unobserve(el);
    });
  }, { threshold: 0.5 });

  stats.forEach(el => counterObserver.observe(el));
})();
