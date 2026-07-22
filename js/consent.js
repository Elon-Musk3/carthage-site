(() => {
  'use strict';

  const config = window.CARTHAGE_PRIVACY_CONFIG || {};
  const STORAGE_KEY = config.storageKey || 'carthage_privacy_consent_v2';
  const CONSENT_VERSION = config.version || '1';
  const DEFAULT_CONSENT = Object.freeze({
    necessary: true,
    analytics: false,
    marketing: false,
    preferences: false
  });

  let currentConsent = { ...DEFAULT_CONSENT };
  let analyticsLoaded = false;
  let pixelLoaded = false;
  let lastFocusedElement = null;
  let closeTimer = null;
  let hasStoredDecision = false;
  let settingsOpenedFromBanner = false;

  const safeParse = (value) => {
    try { return JSON.parse(value); } catch { return null; }
  };

  const readStoredConsent = () => {
    let raw = null;
    try { raw = localStorage.getItem(STORAGE_KEY); } catch { return null; }
    const record = safeParse(raw);
    if (!record || record.version !== CONSENT_VERSION || !record.categories) return null;
    return {
      necessary: true,
      analytics: Boolean(record.categories.analytics),
      marketing: Boolean(record.categories.marketing),
      preferences: Boolean(record.categories.preferences)
    };
  };

  const loadGoogleAnalytics = () => {
    const id = String(config.googleAnalyticsId || '').trim();
    if (!/^G-[A-Z0-9]+$/i.test(id)) return;
    window[`ga-disable-${id}`] = false;
    if (analyticsLoaded) return;

    analyticsLoaded = true;
    window.dataLayer = window.dataLayer || [];
    window.gtag = window.gtag || function gtag() { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    window.gtag('config', id, {
      anonymize_ip: true,
      allow_google_signals: false,
      allow_ad_personalization_signals: false
    });

    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(id)}`;
    script.dataset.carthageTracking = 'analytics';
    document.head.appendChild(script);
  };

  const disableGoogleAnalytics = () => {
    const id = String(config.googleAnalyticsId || '').trim();
    if (/^G-[A-Z0-9]+$/i.test(id)) window[`ga-disable-${id}`] = true;
  };

  const loadMetaPixel = () => {
    const id = String(config.metaPixelId || '').trim();
    if (!/^\d{8,20}$/.test(id)) return;

    if (pixelLoaded) {
      if (typeof window.fbq === 'function') window.fbq('consent', 'grant');
      return;
    }

    pixelLoaded = true;
    !function(f,b,e,v,n,t,s){
      if(f.fbq)return;n=f.fbq=function(){n.callMethod?
      n.callMethod.apply(n,arguments):n.queue.push(arguments)};
      if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
      n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;
      t.dataset.carthageTracking='marketing';
      s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)
    }(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');

    window.fbq('init', id);
    window.fbq('consent', 'grant');
    window.fbq('track', 'PageView');
  };

  const revokeMetaPixel = () => {
    if (typeof window.fbq === 'function') window.fbq('consent', 'revoke');
  };

  const applyConsent = (consent) => {
    if (consent.analytics) loadGoogleAnalytics(); else disableGoogleAnalytics();
    if (consent.marketing) loadMetaPixel(); else revokeMetaPixel();
  };

  const policyUrl = config.policyUrl || 'politica-de-privacidade.html';
  const cookiesUrl = config.cookiesUrl || 'politica-de-cookies.html';

  const renderUi = () => {
    if (document.getElementById('ctg-consent-banner')) return;

    const wrapper = document.createElement('div');
    wrapper.innerHTML = `
      <section class="ctg-consent-banner" id="ctg-consent-banner" role="region" aria-label="Aviso de privacidade" hidden>
        <div class="ctg-consent-banner__top">
          <span class="ctg-consent-mark" aria-hidden="true">C</span>
          <div>
            <h2 class="ctg-consent-title">Sua privacidade, sem interromper a navegação.</h2>
            <p class="ctg-consent-description">
              Recursos essenciais ficam ativos. Medição e publicidade só são usadas com autorização.
              <a href="${policyUrl}">Privacidade</a> · <a href="${cookiesUrl}">Cookies</a>
            </p>
          </div>
          <button class="ctg-consent-banner__close" type="button" data-consent-action="reject" aria-label="Fechar e manter apenas recursos necessários">×</button>
        </div>
        <div class="ctg-consent-actions">
          <button class="ctg-consent-button ctg-consent-button--plain" type="button" data-consent-action="reject">Somente necessários</button>
          <button class="ctg-consent-button" type="button" data-consent-action="customize">Configurar</button>
          <button class="ctg-consent-button ctg-consent-button--primary" type="button" data-consent-action="accept">Aceitar opcionais</button>
        </div>
      </section>

      <div class="ctg-consent-modal" id="ctg-consent-modal" hidden>
        <section class="ctg-consent-dialog" role="dialog" aria-modal="true" aria-labelledby="ctg-consent-title" tabindex="-1">
          <header class="ctg-consent-dialog-header">
            <div>
              <p class="ctg-consent-eyebrow">Controle de privacidade</p>
              <h2 id="ctg-consent-title">Escolha o que pode ser ativado</h2>
              <p>As categorias opcionais permanecem desligadas até você salvar uma escolha.</p>
            </div>
            <button class="ctg-consent-close" type="button" data-consent-action="close" aria-label="Fechar preferências">×</button>
          </header>

          <div class="ctg-consent-options">
            <section class="ctg-consent-option">
              <div><h3>Necessários</h3><p>Funcionamento, segurança e registro da sua escolha.</p></div>
              <span class="ctg-consent-status">Sempre ativos</span>
            </section>

            <section class="ctg-consent-option">
              <div><h3>Analíticos</h3><p>Métricas agregadas pelo Google Analytics, apenas quando um ID real estiver configurado.</p></div>
              <label class="ctg-consent-switch" aria-label="Ativar tecnologias analíticas">
                <input type="checkbox" id="ctg-consent-analytics">
                <span class="ctg-consent-slider"></span>
              </label>
            </section>

            <section class="ctg-consent-option">
              <div><h3>Publicitários</h3><p>Medição de campanhas e eventos por meio do Meta Pixel.</p></div>
              <label class="ctg-consent-switch" aria-label="Ativar tecnologias publicitárias">
                <input type="checkbox" id="ctg-consent-marketing">
                <span class="ctg-consent-slider"></span>
              </label>
            </section>

            <section class="ctg-consent-option">
              <div><h3>Preferências</h3><p>Recursos opcionais de interface. Atualmente não há recurso adicional ativo.</p></div>
              <label class="ctg-consent-switch" aria-label="Ativar tecnologias de preferências">
                <input type="checkbox" id="ctg-consent-preferences">
                <span class="ctg-consent-slider"></span>
              </label>
            </section>
          </div>

          <footer class="ctg-consent-dialog-footer">
            <button class="ctg-consent-button ctg-consent-button--plain" type="button" data-consent-action="reject">Manter somente necessários</button>
            <button class="ctg-consent-button ctg-consent-button--primary" type="button" data-consent-action="save">Salvar seleção</button>
          </footer>
        </section>
      </div>

      <div class="ctg-consent-notice" id="ctg-consent-notice" role="status" aria-live="polite" hidden>Preferências salvas.</div>`;

    document.body.append(...wrapper.children);
  };

  const getBanner = () => document.getElementById('ctg-consent-banner');
  const getModal = () => document.getElementById('ctg-consent-modal');
  const getDialog = () => getModal()?.querySelector('.ctg-consent-dialog');
  const getNotice = () => document.getElementById('ctg-consent-notice');

  const showBanner = () => {
    const banner = getBanner();
    if (banner) banner.hidden = false;
    document.documentElement.classList.add('ctg-consent-pending');
  };

  const hideBanner = () => {
    const banner = getBanner();
    if (banner) banner.hidden = true;
    document.documentElement.classList.remove('ctg-consent-pending');
  };

  const updateControls = (consent) => {
    const controls = {
      analytics: document.getElementById('ctg-consent-analytics'),
      marketing: document.getElementById('ctg-consent-marketing'),
      preferences: document.getElementById('ctg-consent-preferences')
    };
    Object.entries(controls).forEach(([key, input]) => {
      if (input) input.checked = Boolean(consent[key]);
    });
  };

  const showNotice = (message = 'Preferências salvas.') => {
    const notice = getNotice();
    if (!notice) return;
    notice.textContent = message;
    notice.hidden = false;
    window.clearTimeout(showNotice.timer);
    showNotice.timer = window.setTimeout(() => { notice.hidden = true; }, 2200);
  };

  const openSettings = () => {
    const modal = getModal();
    const dialog = getDialog();
    if (!modal || !dialog) return;

    window.clearTimeout(closeTimer);
    lastFocusedElement = document.activeElement;
    settingsOpenedFromBanner = Boolean(getBanner() && !getBanner().hidden);
    updateControls(currentConsent);
    hideBanner();
    modal.hidden = false;
    document.documentElement.classList.add('ctg-consent-lock');
    requestAnimationFrame(() => {
      modal.classList.add('is-open');
      dialog.focus({ preventScroll: true });
    });
  };

  const closeSettings = ({ restoreFocus = true, immediate = false } = {}) => {
    const modal = getModal();
    if (!modal || modal.hidden) return;

    window.clearTimeout(closeTimer);
    modal.classList.remove('is-open');
    document.documentElement.classList.remove('ctg-consent-lock');

    const finish = () => {
      modal.hidden = true;
      if (settingsOpenedFromBanner && !hasStoredDecision) showBanner();
      settingsOpenedFromBanner = false;
      if (restoreFocus && lastFocusedElement?.focus) lastFocusedElement.focus({ preventScroll: true });
    };

    if (immediate || window.matchMedia('(prefers-reduced-motion: reduce)').matches) finish();
    else closeTimer = window.setTimeout(finish, 210);
  };

  const persistConsent = (categories, source) => {
    currentConsent = {
      necessary: true,
      analytics: Boolean(categories.analytics),
      marketing: Boolean(categories.marketing),
      preferences: Boolean(categories.preferences)
    };

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        version: CONSENT_VERSION,
        savedAt: new Date().toISOString(),
        source,
        categories: currentConsent
      }));
    } catch {}

    hasStoredDecision = true;
    applyConsent(currentConsent);
    updateControls(currentConsent);
    hideBanner();
    closeSettings({ restoreFocus: false, immediate: true });
    showNotice(source === 'accept-all' ? 'Tecnologias opcionais autorizadas.' : 'Preferências salvas.');

    window.dispatchEvent(new CustomEvent('carthage:consent-updated', {
      detail: { ...currentConsent }
    }));
  };

  const saveCustomSelection = () => {
    persistConsent({
      analytics: document.getElementById('ctg-consent-analytics')?.checked,
      marketing: document.getElementById('ctg-consent-marketing')?.checked,
      preferences: document.getElementById('ctg-consent-preferences')?.checked
    }, 'custom');
  };

  const getFocusable = () => {
    const dialog = getDialog();
    if (!dialog) return [];
    return [...dialog.querySelectorAll('button:not([disabled]), input:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])')]
      .filter((element) => !element.hidden && element.offsetParent !== null);
  };

  const bindEvents = () => {
    document.addEventListener('click', (event) => {
      const settingsButton = event.target.closest('[data-open-privacy-settings]');
      if (settingsButton) {
        event.preventDefault();
        openSettings();
        return;
      }

      const actionButton = event.target.closest('[data-consent-action]');
      if (actionButton) {
        event.preventDefault();
        const action = actionButton.dataset.consentAction;
        if (action === 'accept') persistConsent({ analytics: true, marketing: true, preferences: true }, 'accept-all');
        else if (action === 'reject') persistConsent(DEFAULT_CONSENT, 'reject-optional');
        else if (action === 'customize') openSettings();
        else if (action === 'close') closeSettings();
        else if (action === 'save') saveCustomSelection();
        return;
      }

      const modal = getModal();
      if (modal && event.target === modal) closeSettings();
    });

    document.addEventListener('keydown', (event) => {
      const modal = getModal();
      if (!modal || modal.hidden) return;

      if (event.key === 'Escape') {
        event.preventDefault();
        closeSettings();
        return;
      }

      if (event.key !== 'Tab') return;
      const focusable = getFocusable();
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    });
  };

  const init = () => {
    renderUi();
    bindEvents();

    const stored = readStoredConsent();
    hasStoredDecision = Boolean(stored);
    currentConsent = stored || { ...DEFAULT_CONSENT };
    updateControls(currentConsent);
    applyConsent(currentConsent);

    if (stored) hideBanner();
    else showBanner();

    window.CARTHAGE_PRIVACY = Object.freeze({
      openSettings,
      getConsent: () => ({ ...currentConsent }),
      reset: () => {
        try { localStorage.removeItem(STORAGE_KEY); } catch {}
        window.location.reload();
      }
    });
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
