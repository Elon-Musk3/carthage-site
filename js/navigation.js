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
  let mobileScrim = null;
  let mobileIsOpen = false;
  let lockedScrollY = 0;
  let mobileScrollRestoreFrame = 0;
  let transitionNavigationTimer = 0;

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

  const syncMobileGeometry = () => {
    if (!header || !mobilePanel) return;
    const rect = header.getBoundingClientRect();
    const viewportHeight = window.visualViewport?.height || window.innerHeight;
    const panelTop = Math.max(8, Math.ceil(rect.bottom + 8));
    const availableHeight = Math.max(180, Math.floor(viewportHeight - panelTop - 8));
    const rootStyle = document.documentElement.style;
    rootStyle.setProperty('--mobile-header-top', `${Math.max(0, Math.round(rect.top))}px`);
    rootStyle.setProperty('--mobile-header-left', `${Math.max(0, Math.round(rect.left))}px`);
    rootStyle.setProperty('--mobile-header-width', `${Math.round(rect.width)}px`);
    rootStyle.setProperty('--mobile-menu-top', `${panelTop}px`);
    rootStyle.setProperty('--mobile-menu-height', `${availableHeight}px`);
  };

  const resetMobileAccordions = () => {
    document.querySelectorAll('[data-mobile-accordion]').forEach((button) => {
      const target = document.getElementById(button.getAttribute('aria-controls'));
      if (target) target.hidden = true;
      button.setAttribute('aria-expanded', 'false');
      const indicator = button.querySelector('[aria-hidden="true"], span:last-child');
      if (indicator) indicator.textContent = '+';
    });
  };

  const clearMobileGeometry = () => {
    const rootStyle = document.documentElement.style;
    [
      '--menu-scroll-offset',
      '--mobile-header-top',
      '--mobile-header-left',
      '--mobile-header-width',
      '--mobile-menu-top',
      '--mobile-menu-height'
    ].forEach((property) => rootStyle.removeProperty(property));
  };

  const readPageScrollY = () => {
    const candidates = [
      window.scrollY,
      window.pageYOffset,
      document.scrollingElement?.scrollTop,
      document.documentElement.scrollTop,
      document.body?.scrollTop
    ].map((value) => Number(value) || 0);
    return Math.max(0, ...candidates);
  };

  const cancelMobileScrollRestore = () => {
    if (mobileScrollRestoreFrame) window.cancelAnimationFrame(mobileScrollRestoreFrame);
    mobileScrollRestoreFrame = 0;
    document.documentElement.classList.remove('is-restoring-mobile-scroll');
  };

  const restoreMobileScroll = (targetY) => {
    const normalizedTarget = Math.max(0, Math.round(Number(targetY) || 0));
    const root = document.documentElement;
    let confirmations = 0;

    cancelMobileScrollRestore();
    root.classList.add('is-restoring-mobile-scroll');

    const applyPosition = () => {
      window.scrollTo(0, normalizedTarget);
      const scrollingElement = document.scrollingElement;
      if (scrollingElement && Math.abs((scrollingElement.scrollTop || 0) - normalizedTarget) > 1) {
        scrollingElement.scrollTop = normalizedTarget;
      }
    };

    const confirmPosition = () => {
      if (mobileIsOpen) {
        cancelMobileScrollRestore();
        return;
      }

      applyPosition();
      confirmations += 1;
      if (confirmations < 2) {
        mobileScrollRestoreFrame = window.requestAnimationFrame(confirmPosition);
        return;
      }

      mobileScrollRestoreFrame = 0;
      root.classList.remove('is-restoring-mobile-scroll');
    };

    applyPosition();
    mobileScrollRestoreFrame = window.requestAnimationFrame(confirmPosition);
  };

  const setMobileOpen = (
    open,
    {
      restoreFocus = true,
      restoreScroll = true,
      resetAccordions = false
    } = {}
  ) => {
    if (!mobilePanel || !mobileToggle) return;
    const wasOpen = mobileIsOpen || !mobilePanel.hidden || document.documentElement.classList.contains('menu-open');

    if (open) {
      cancelMobileScrollRestore();
      closeMegaMenus({ immediate: true });
      lastFocusedBeforeMobile = document.activeElement;
      lockedScrollY = readPageScrollY();
      syncMobileGeometry();
      document.documentElement.style.setProperty('--menu-scroll-offset', `${-lockedScrollY}px`);
      mobilePanel.scrollTop = 0;
      mobilePanel.hidden = false;
      if (mobileScrim) mobileScrim.hidden = false;
      mobileToggle.setAttribute('aria-expanded', 'true');
      mobileToggle.setAttribute('aria-label', 'Fechar menu');
      document.documentElement.classList.add('menu-open');
      mobileIsOpen = true;
      window.requestAnimationFrame(() => {
        if (!mobileIsOpen) return;
        syncMobileGeometry();
        mobilePanel.scrollTop = 0;
        mobilePanel.focus({ preventScroll: true });
      });
      return;
    }

    const scrollTarget = lockedScrollY;
    mobileIsOpen = false;
    mobilePanel.hidden = true;
    if (mobileScrim) mobileScrim.hidden = true;
    mobileToggle.setAttribute('aria-expanded', 'false');
    mobileToggle.setAttribute('aria-label', 'Abrir menu');
    document.documentElement.classList.remove('menu-open');
    if (resetAccordions) resetMobileAccordions();
    clearMobileGeometry();

    if (wasOpen && restoreFocus && lastFocusedBeforeMobile instanceof HTMLElement && lastFocusedBeforeMobile.isConnected) {
      lastFocusedBeforeMobile.focus({ preventScroll: true });
    }
    if (wasOpen && restoreScroll) restoreMobileScroll(scrollTarget);
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
    if (!mobilePanel || !mobileToggle) return;

    mobileScrim = document.createElement('button');
    mobileScrim.type = 'button';
    mobileScrim.className = 'mobile-menu-scrim';
    mobileScrim.tabIndex = -1;
    mobileScrim.setAttribute('aria-label', 'Fechar menu');
    mobileScrim.hidden = true;
    mobilePanel.before(mobileScrim);

    mobilePanel.setAttribute('tabindex', '-1');
    mobilePanel.setAttribute('role', 'dialog');
    mobilePanel.setAttribute('aria-modal', 'true');
    mobilePanel.setAttribute('aria-label', 'Navegação principal');
    mobileToggle.addEventListener('click', () => setMobileOpen(!mobileIsOpen));
    mobileScrim.addEventListener('pointerdown', (event) => {
      event.stopPropagation();
    });
    mobileScrim.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopPropagation();
      setMobileOpen(false, { resetAccordions: true });
    });

    document.querySelectorAll('[data-mobile-accordion]').forEach((button) => {
      button.addEventListener('click', () => {
        const target = document.getElementById(button.getAttribute('aria-controls'));
        if (!target) return;
        const open = target.hidden;
        target.hidden = !open;
        button.setAttribute('aria-expanded', String(open));
        const indicator = button.querySelector('[aria-hidden="true"], span:last-child');
        if (indicator) indicator.textContent = open ? '−' : '+';
      });
    });
    mobilePanel.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => setMobileOpen(false, { restoreFocus: false, resetAccordions: true }));
    });
    header?.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        if (mobileIsOpen) setMobileOpen(false, { restoreFocus: false, resetAccordions: true });
      });
    });

    document.addEventListener('click', (event) => {
      if (!mobileIsOpen) return;
      const target = event.target;
      if (!(target instanceof Node)) return;
      if (target === mobileScrim || mobilePanel.contains(target) || mobileToggle.contains(target)) return;

      event.preventDefault();
      event.stopImmediatePropagation();
      setMobileOpen(false, { resetAccordions: true });
    }, true);

    mobilePanel.addEventListener('keydown', (event) => {
      if (event.key !== 'Tab' || mobilePanel.hidden) return;
      const focusable = [...mobilePanel.querySelectorAll('a,button:not([disabled])')]
        .filter((item) => !item.closest('[hidden]'));
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && (document.activeElement === first || document.activeElement === mobilePanel)) {
        event.preventDefault();
        last.focus();
      }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    });

    const handleViewportChange = () => {
      if (window.innerWidth > 1080) {
        setMobileOpen(false, { restoreFocus: false, resetAccordions: true });
        return;
      }
      if (mobileIsOpen) syncMobileGeometry();
    };
    window.addEventListener('resize', handleViewportChange, { passive: true });
    window.addEventListener('orientationchange', () => {
      setMobileOpen(false, { restoreFocus: false, resetAccordions: true });
    }, { passive: true });
    window.visualViewport?.addEventListener('resize', handleViewportChange, { passive: true });
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

  const resetPageTransition = () => {
    if (!transition) return;
    window.clearTimeout(transitionNavigationTimer);
    transitionNavigationTimer = 0;
    transition.classList.remove('is-leaving');
    transition.classList.add('is-ready');
  };

  const resetRestoredPage = () => {
    closeMegaMenus({ immediate: true });
    setMobileOpen(false, {
      restoreFocus: false,
      restoreScroll: true,
      resetAccordions: true
    });
    resetPageTransition();
    setHeaderState();
  };

  const initPageLifecycle = () => {
    window.addEventListener('pageshow', () => window.requestAnimationFrame(resetRestoredPage));
    window.addEventListener('popstate', resetRestoredPage);
    window.addEventListener('pagehide', () => {
      window.clearTimeout(transitionNavigationTimer);
      transitionNavigationTimer = 0;
      transition?.classList.remove('is-leaving');
      transition?.classList.add('is-ready');
      setMobileOpen(false, {
        restoreFocus: false,
        restoreScroll: false,
        resetAccordions: true
      });
    });
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') resetPageTransition();
    });
  };

  const initPageTransitions = () => {
    if (!transition) return;
    resetPageTransition();
    if (reducedMotion.matches) return;
    document.addEventListener('click', (event) => {
      const link = event.target.closest('a[href]');
      if (!link || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const url = new URL(link.href, window.location.href);
      const sameOrigin = url.origin === window.location.origin;
      const samePageHash = url.pathname === window.location.pathname && url.hash;
      if (!sameOrigin || samePageHash || link.target === '_blank' || link.hasAttribute('download') || link.dataset.noTransition !== undefined) return;
      event.preventDefault();
      transition.classList.add('is-leaving');
      transitionNavigationTimer = window.setTimeout(() => {
        transitionNavigationTimer = 0;
        window.location.assign(url.href);
      }, 180);
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
  initPageLifecycle();
  initSmoothAnchors();
  initPrefetch();
  initActivePage();
  initPageTransitions();
  initBackToTop();
  initFloatingWhatsapp();
})();
