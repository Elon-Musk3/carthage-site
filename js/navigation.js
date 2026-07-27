(() => {
  'use strict';

  const header = document.querySelector('[data-site-header]');
  const mobileToggle = document.querySelector('[data-mobile-menu-toggle]');
  const mobilePanel = document.querySelector('[data-mobile-menu]');
  const megaRoots = [...document.querySelectorAll('[data-mega-root]')];
  const megaTriggers = [...document.querySelectorAll('[data-mega-trigger]')];
  const transition = document.querySelector('[data-page-transition]');
  const hoverCapable = window.matchMedia('(hover: hover) and (pointer: fine)');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const hoveredMegaRoots = new WeakSet();
  const megaCloseTimers = new WeakMap();
  const megaHideTimers = new WeakMap();
  const megaCloseDelay = 110;
  const megaTransitionDuration = reducedMotion.matches ? 0 : 190;
  const megaSwapDuration = reducedMotion.matches ? 0 : 190;
  let activeMegaRoot = null;
  let lastFocusedBeforeMobile = null;
  let suppressMegaFocusOpen = false;

  const setHeaderState = () => header?.classList.toggle('is-scrolled', window.scrollY > 18);

  const clearMegaTimer = (timers, root) => {
    const timer = timers.get(root);
    if (timer !== undefined) window.clearTimeout(timer);
    timers.delete(root);
  };

  const getMegaParts = (root) => ({
    trigger: root?.querySelector('[data-mega-trigger]'),
    panel: root?.querySelector('[data-mega-panel]')
  });

  const syncMegaBackdrop = () => {
    const open = Boolean(activeMegaRoot?.classList.contains('is-open'));
    document.documentElement.classList.toggle('mega-open', open);
  };

  const cancelMegaClose = (root) => clearMegaTimer(megaCloseTimers, root);

  const clearMegaMotion = (panel) => {
    panel?.classList.remove('is-initial-open', 'is-swap-in', 'is-switching-out');
  };

  const hideMegaPanel = (panel) => {
    if (!panel) return;
    panel.hidden = true;
    panel.classList.remove('is-open');
    clearMegaMotion(panel);
  };

  const closeMegaMenu = (root, { immediate = false, restoreFocus = false } = {}) => {
    if (!root) return;
    const { trigger, panel } = getMegaParts(root);
    if (!trigger || !panel) return;
    const wasOpen = root.classList.contains('is-open') || trigger.getAttribute('aria-expanded') === 'true';
    cancelMegaClose(root);
    clearMegaTimer(megaHideTimers, root);
    if (activeMegaRoot === root) activeMegaRoot = null;
    root.classList.remove('is-open');
    clearMegaMotion(panel);
    panel.classList.remove('is-open');
    trigger.setAttribute('aria-expanded', 'false');
    syncMegaBackdrop();

    if (immediate || panel.hidden || megaTransitionDuration === 0) {
      hideMegaPanel(panel);
    } else {
      const timer = window.setTimeout(() => {
        if (!root.classList.contains('is-open')) hideMegaPanel(panel);
        megaHideTimers.delete(root);
      }, megaTransitionDuration);
      megaHideTimers.set(root, timer);
    }

    if (restoreFocus && wasOpen) {
      suppressMegaFocusOpen = true;
      trigger.focus({ preventScroll: true });
      suppressMegaFocusOpen = false;
    }
  };

  const closeMegaMenus = ({ except = null, immediate = false, restoreFocus = false } = {}) => {
    megaRoots.forEach((root) => {
      if (root !== except) closeMegaMenu(root, { immediate, restoreFocus });
    });
  };

  const focusMegaEdge = (panel, edge) => {
    const focusable = [...panel.querySelectorAll('a, button:not([disabled])')];
    const target = edge === 'last' ? focusable.at(-1) : focusable[0];
    target?.focus({ preventScroll: true });
  };

  const revealMegaMenu = (root, trigger, panel, { focusEdge = null } = {}) => {
    cancelMegaClose(root);
    clearMegaTimer(megaHideTimers, root);
    clearMegaMotion(panel);
    panel.classList.remove('is-open');
    panel.hidden = false;
    trigger.setAttribute('aria-expanded', 'true');
    root.classList.add('is-open');
    activeMegaRoot = root;
    syncMegaBackdrop();

    window.requestAnimationFrame(() => {
      if (activeMegaRoot !== root || !root.classList.contains('is-open')) return;
      panel.classList.add('is-open', 'is-initial-open');
      if (focusEdge) focusMegaEdge(panel, focusEdge);
    });
  };

  const switchMegaMenu = (fromRoot, toRoot, trigger, panel, { focusEdge = null } = {}) => {
    const { trigger: previousTrigger, panel: previousPanel } = getMegaParts(fromRoot);
    if (!previousTrigger || !previousPanel) {
      revealMegaMenu(toRoot, trigger, panel, { focusEdge });
      return;
    }

    cancelMegaClose(fromRoot);
    cancelMegaClose(toRoot);
    clearMegaTimer(megaHideTimers, fromRoot);
    clearMegaTimer(megaHideTimers, toRoot);

    fromRoot.classList.remove('is-open');
    previousTrigger.setAttribute('aria-expanded', 'false');
    previousPanel.classList.remove('is-initial-open', 'is-swap-in');

    clearMegaMotion(panel);
    panel.classList.remove('is-open');
    panel.hidden = false;
    trigger.setAttribute('aria-expanded', 'true');
    toRoot.classList.add('is-open');
    activeMegaRoot = toRoot;
    syncMegaBackdrop();

    if (megaSwapDuration === 0) {
      hideMegaPanel(previousPanel);
      panel.classList.add('is-open');
      if (focusEdge) focusMegaEdge(panel, focusEdge);
      return;
    }

    previousPanel.classList.add('is-switching-out');
    const hideTimer = window.setTimeout(() => {
      if (activeMegaRoot !== fromRoot) hideMegaPanel(previousPanel);
      megaHideTimers.delete(fromRoot);
    }, megaSwapDuration);
    megaHideTimers.set(fromRoot, hideTimer);

    window.requestAnimationFrame(() => {
      if (activeMegaRoot !== toRoot || !toRoot.classList.contains('is-open')) return;
      panel.classList.add('is-open', 'is-swap-in');
      if (focusEdge) focusMegaEdge(panel, focusEdge);
    });
  };

  const openMegaMenu = (trigger, { focusEdge = null } = {}) => {
    const root = trigger?.closest('[data-mega-root]');
    const { panel } = getMegaParts(root);
    if (!root || !panel) return;

    cancelMegaClose(root);
    clearMegaTimer(megaHideTimers, root);

    if (activeMegaRoot === root && root.classList.contains('is-open')) {
      if (focusEdge) focusMegaEdge(panel, focusEdge);
      return;
    }

    if (activeMegaRoot && activeMegaRoot !== root) {
      switchMegaMenu(activeMegaRoot, root, trigger, panel, { focusEdge });
      return;
    }

    revealMegaMenu(root, trigger, panel, { focusEdge });
  };

  const scheduleMegaClose = (root) => {
    cancelMegaClose(root);
    const timer = window.setTimeout(() => {
      closeMegaMenu(root);
      megaCloseTimers.delete(root);
    }, megaCloseDelay);
    megaCloseTimers.set(root, timer);
  };

  const setMobileOpen = (open) => {
    if (!mobilePanel || !mobileToggle) return;
    if (open) closeMegaMenus({ immediate: true });
    if (open) lastFocusedBeforeMobile = document.activeElement;
    mobilePanel.hidden = !open;
    mobileToggle.setAttribute('aria-expanded', String(open));
    document.documentElement.classList.toggle('menu-open', open);
    if (open) mobilePanel.querySelector('a, button')?.focus({ preventScroll: true });
    else if (lastFocusedBeforeMobile instanceof HTMLElement) lastFocusedBeforeMobile.focus({ preventScroll: true });
  };

  const initMegaMenu = () => {
    megaRoots.forEach((root) => {
      const { trigger, panel } = getMegaParts(root);
      if (!trigger || !panel) return;

      trigger.addEventListener('click', (event) => {
        const activatedByKeyboard = event.detail === 0;
        if (hoverCapable.matches && !activatedByKeyboard) {
          openMegaMenu(trigger);
          return;
        }
        if (root.classList.contains('is-open')) closeMegaMenu(root);
        else openMegaMenu(trigger);
      });

      trigger.addEventListener('keydown', (event) => {
        if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return;
        event.preventDefault();
        openMegaMenu(trigger, { focusEdge: event.key === 'ArrowUp' ? 'last' : 'first' });
      });

      root.addEventListener('pointerenter', () => {
        if (!hoverCapable.matches) return;
        hoveredMegaRoots.add(root);
        cancelMegaClose(root);
        openMegaMenu(trigger);
      });

      root.addEventListener('pointerleave', () => {
        if (!hoverCapable.matches) return;
        hoveredMegaRoots.delete(root);
        scheduleMegaClose(root);
      });

      root.addEventListener('focusin', () => {
        if (!suppressMegaFocusOpen) openMegaMenu(trigger);
      });
      root.addEventListener('focusout', (event) => {
        if (root.contains(event.relatedTarget) || hoveredMegaRoots.has(root)) return;
        scheduleMegaClose(root);
      });
    });

    document.addEventListener('click', (event) => {
      if (!event.target.closest('[data-mega-root]')) closeMegaMenus();
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        closeMegaMenus({ restoreFocus: true });
        setMobileOpen(false);
      }
    });

    hoverCapable.addEventListener?.('change', () => closeMegaMenus({ immediate: true }));
    window.addEventListener('blur', () => closeMegaMenus({ immediate: true }));
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
    mobilePanel?.addEventListener('keydown', (event) => {
      if (event.key !== 'Tab' || mobilePanel.hidden) return;
      const focusable = [...mobilePanel.querySelectorAll('a,button:not([disabled])')].filter((item) => !item.hidden);
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    });
  };

  const initSmoothAnchors = () => {
    document.addEventListener('click', (event) => {
      const link = event.target.closest('a[href^="#"]');
      if (!link) return;
      const target = document.querySelector(link.getAttribute('href'));
      if (!target) return;
      event.preventDefault();
      target.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
      window.history.pushState(null, '', link.getAttribute('href'));
      if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });
    });
  };

  const initPrefetch = () => {
    const prefetched = new Set();
    const prefetch = (event) => {
      const link = event.target.closest('a[href]');
      if (!link) return;
      const url = new URL(link.href, location.href);
      if (url.origin !== location.origin || !url.pathname.endsWith('.html') || prefetched.has(url.href)) return;
      prefetched.add(url.href);
      const hint = document.createElement('link');
      hint.rel = 'prefetch'; hint.href = url.href; document.head.appendChild(hint);
    };
    document.addEventListener('pointerover', prefetch, { passive: true });
    document.addEventListener('focusin', prefetch);
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
  initSmoothAnchors();
  initPrefetch();
  initActivePage();
  initPageTransitions();
  initBackToTop();
  initFloatingWhatsapp();
})();
