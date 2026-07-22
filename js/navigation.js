(() => {
  'use strict';

  const header = document.querySelector('[data-site-header]');
  const mobileToggle = document.querySelector('[data-mobile-menu-toggle]');
  const mobilePanel = document.querySelector('[data-mobile-menu]');
  const megaTriggers = [...document.querySelectorAll('[data-mega-trigger]')];
  const megaPanels = [...document.querySelectorAll('[data-mega-panel]')];
  const transition = document.querySelector('[data-page-transition]');

  const setHeaderState = () => header?.classList.toggle('is-scrolled', window.scrollY > 18);

  const closeMegaMenus = ({ restoreFocus = false } = {}) => {
    megaPanels.forEach(panel => panel.hidden = true);
    megaTriggers.forEach(trigger => {
      const wasOpen = trigger.getAttribute('aria-expanded') === 'true';
      trigger.setAttribute('aria-expanded', 'false');
      if (restoreFocus && wasOpen) trigger.focus();
    });
  };

  const openMegaMenu = (trigger) => {
    const name = trigger.dataset.megaTrigger;
    const panel = document.querySelector(`[data-mega-panel="${name}"]`);
    if (!panel) return;
    const willOpen = panel.hidden;
    closeMegaMenus();
    if (!willOpen) return;
    panel.hidden = false;
    trigger.setAttribute('aria-expanded', 'true');
    panel.querySelector('a, button')?.focus({ preventScroll: true });
  };

  const setMobileOpen = (open) => {
    if (!mobilePanel || !mobileToggle) return;
    mobilePanel.hidden = !open;
    mobileToggle.setAttribute('aria-expanded', String(open));
    document.documentElement.classList.toggle('menu-open', open);
    if (open) mobilePanel.querySelector('a, button')?.focus({ preventScroll: true });
  };

  const initMegaMenu = () => {
    megaTriggers.forEach(trigger => trigger.addEventListener('click', () => openMegaMenu(trigger)));
    document.addEventListener('click', (event) => {
      if (!event.target.closest('[data-mega-root]')) closeMegaMenus();
    });
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        closeMegaMenus({ restoreFocus: true });
        setMobileOpen(false);
      }
    });
  };

  const initMobileMenu = () => {
    mobileToggle?.addEventListener('click', () => setMobileOpen(mobilePanel?.hidden));
    document.querySelectorAll('[data-mobile-accordion]').forEach((button) => {
      button.addEventListener('click', () => {
        const target = document.getElementById(button.getAttribute('aria-controls'));
        if (!target) return;
        const open = target.hidden;
        target.hidden = !open;
        button.setAttribute('aria-expanded', String(open));
      });
    });
    mobilePanel?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => setMobileOpen(false)));
  };

  const initActivePage = () => {
    const page = document.body?.dataset.page;
    if (!page) return;
    document.querySelectorAll(`[data-nav-page="${page}"]`).forEach(link => {
      link.classList.add('is-active');
      link.setAttribute('aria-current', 'page');
    });
  };

  const initPageTransitions = () => {
    if (!transition || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    requestAnimationFrame(() => transition.classList.add('is-ready'));
    document.addEventListener('click', (event) => {
      const link = event.target.closest('a[href]');
      if (!link || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const url = new URL(link.href, window.location.href);
      const sameOrigin = url.origin === window.location.origin;
      const samePageHash = url.pathname === window.location.pathname && url.hash;
      if (!sameOrigin || samePageHash || link.target === '_blank' || link.hasAttribute('download') || link.dataset.noTransition !== undefined) return;
      event.preventDefault();
      transition.classList.add('is-leaving');
      window.setTimeout(() => { window.location.href = url.href; }, 180);
    });
  };

  const smoothScrollTop = () => {
    const start = window.scrollY;
    if (!start) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      window.scrollTo(0, 0);
      return;
    }
    const duration = Math.min(900, Math.max(520, start * 0.22));
    const startedAt = performance.now();
    const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);
    const frame = (now) => {
      const progress = Math.min(1, (now - startedAt) / duration);
      window.scrollTo(0, Math.round(start * (1 - easeOutCubic(progress))));
      if (progress < 1) requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
  };

  const initBackToTop = () => {
    const button = document.querySelector('[data-back-to-top]');
    if (!button) return;
    const update = () => button.classList.toggle('is-visible', window.scrollY > 650);
    button.addEventListener('click', smoothScrollTop);
    window.addEventListener('scroll', update, { passive: true });
    update();
  };

  const initFloatingWhatsapp = () => {
    const button = document.querySelector('.floating-whatsapp');
    if (!button) return;
    const update = () => button.classList.toggle('is-visible', window.scrollY > 420);
    window.addEventListener('scroll', update, { passive: true });
    update();
  };

  window.addEventListener('scroll', setHeaderState, { passive: true });
  setHeaderState();
  initMegaMenu();
  initMobileMenu();
  initActivePage();
  initPageTransitions();
  initBackToTop();
  initFloatingWhatsapp();
})();
