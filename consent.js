(() => {
  'use strict';

  const config = window.CARTHAGE_PRIVACY_CONFIG || {};
  const STORAGE_KEY = config.storageKey || 'carthage_privacy_consent_v1';
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

  const log = (...args) => {
    if (config.debug) console.info('[Carthage Privacy]', ...args);
  };

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
    } catch {
      log('Não foi possível persistir as preferências neste navegador.');
    }

    applyConsent(currentConsent);
    updateControls(currentConsent);
    hideBanner();
    closeSettings();

    window.dispatchEvent(new CustomEvent('carthage:consent-updated', {
      detail: { ...currentConsent }
    }));
  };

  const loadGoogleAnalytics = () => {
    const id = String(config.googleAnalyticsId || '').trim();
    if (!/^G-[A-Z0-9]+$/i.test(id)) return;

    window[`ga-disable-${id}`] = false;
    if (analyticsLoaded) return;
    analyticsLoaded = true;
    window.dataLayer = window.dataLayer || [];
    window.gtag = window.gtag || function gtag(){ window.dataLayer.push(arguments); };
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
    log('Google Analytics carregado após consentimento.');
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
    /* Meta Pixel: carregado apenas após consentimento publicitário. */
    !function(f,b,e,v,n,t,s){
      if(f.fbq)return;n=f.fbq=function(){n.callMethod?
      n.callMethod.apply(n,arguments):n.queue.push(arguments)};
      if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
      n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;
      t.dataset.carthageTracking='marketing';
      s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)
    }(window, document,'script','https://connect.facebook.net/en_US/fbevents.js');

    window.fbq('init', id);
    window.fbq('consent', 'grant');
    window.fbq('track', 'PageView');
    log('Meta Pixel carregado após consentimento.');
  };

  const revokeMetaPixel = () => {
    if (typeof window.fbq === 'function') window.fbq('consent', 'revoke');
  };

  const applyConsent = (consent) => {
    if (consent.analytics) loadGoogleAnalytics();
    else disableGoogleAnalytics();

    if (consent.marketing) loadMetaPixel();
    else revokeMetaPixel();
  };

  const policyUrl = config.policyUrl || '/legal/privacidade.html';
  const cookiesUrl = config.cookiesUrl || '/legal/cookies.html';

  const renderUi = () => {
    if (document.getElementById('ctg-consent-banner')) return;

    const wrapper = document.createElement('div');
    wrapper.innerHTML = `
      <section class="ctg-consent-banner" id="ctg-consent-banner" role="dialog" aria-label="Preferências de privacidade" hidden>
        <div class="ctg-consent-copy">
          <p class="ctg-consent-eyebrow">Privacidade sob seu controle</p>
          <h2 class="ctg-consent-title">Você escolhe quais tecnologias opcionais podem ser usadas.</h2>
          <p class="ctg-consent-description">
            Usamos recursos necessários para o site funcionar. Analytics e publicidade só são ativados após sua escolha.
            Consulte a <a href="${policyUrl}">Política de Privacidade</a> e a <a href="${cookiesUrl}">Política de Cookies</a>.
          </p>
        </div>
        <div class="ctg-consent-actions">
          <button class="ctg-consent-button ctg-consent-button--plain" type="button" data-consent-action="reject">Rejeitar opcionais</button>
          <button class="ctg-consent-button" type="button" data-consent-action="customize">Personalizar</button>
          <button class="ctg-consent-button ctg-consent-button--primary" type="button" data-consent-action="accept">Aceitar todos</button>
        </div>
      </section>

      <div class="ctg-consent-modal" id="ctg-consent-modal" role="dialog" aria-modal="true" aria-labelledby="ctg-consent-title" hidden>
        <div class="ctg-consent-dialog">
          <header class="ctg-consent-dialog-header">
            <div>
              <h2 id="ctg-consent-title">Preferências de privacidade</h2>
              <p>Ative apenas as categorias que desejar. Você poderá alterar essa decisão pelo rodapé do site.</p>
            </div>
            <button class="ctg-consent-close" type="button" data-consent-action="close" aria-label="Fechar preferências">×</button>
          </header>

          <div class="ctg-consent-options">
            <section class="ctg-consent-option">
              <div>
                <h3>Necessários</h3>
                <p>Permitem funções básicas, segurança e armazenamento da própria escolha de privacidade.</p>
              </div>
              <span class="ctg-consent-status">Sempre ativos</span>
            </section>

            <section class="ctg-consent-option">
              <div>
                <h3>Analíticos</h3>
                <p>Ajudam a entender páginas acessadas, origem da visita e desempenho agregado do site por meio do Google Analytics, quando configurado.</p>
              </div>
              <label class="ctg-consent-switch" aria-label="Ativar cookies analíticos">
                <input type="checkbox" id="ctg-consent-analytics">
                <span class="ctg-consent-slider"></span>
              </label>
            </section>

            <section class="ctg-consent-option">
              <div>
                <h3>Publicitários</h3>
                <p>Permitem medir campanhas e eventos por meio do Meta Pixel. Permanecem desligados sem sua autorização.</p>
              </div>
              <label class="ctg-consent-switch" aria-label="Ativar cookies publicitários">
                <input type="checkbox" id="ctg-consent-marketing">
                <span class="ctg-consent-slider"></span>
              </label>
            </section>

            <section class="ctg-consent-option">
              <div>
                <h3>Preferências</h3>
                <p>Podem memorizar escolhas de interface. No momento, a Carthage não utiliza recursos opcionais dessa categoria.</p>
              </div>
              <label class="ctg-consent-switch" aria-label="Ativar cookies de preferências">
                <input type="checkbox" id="ctg-consent-preferences">
                <span class="ctg-consent-slider"></span>
              </label>
            </section>
          </div>

          <footer class="ctg-consent-dialog-footer">
            <button class="ctg-consent-button ctg-consent-button--plain" type="button" data-consent-action="reject">Rejeitar opcionais</button>
            <button class="ctg-consent-button ctg-consent-button--primary" type="button" data-consent-action="save">Guardar preferências</button>
          </footer>
        </div>
      </div>`;

    document.body.append(...wrapper.children);

    document.addEventListener('click', (event) => {
      const actionButton = event.target.closest('[data-consent-action]');
      const settingsButton = event.target.closest('[data-open-privacy-settings]');

      if (settingsButton) {
        event.preventDefault();
        openSettings();
        return;
      }
      if (!actionButton) return;

      const action = actionButton.dataset.consentAction;
      if (action === 'accept') persistConsent({ analytics: true, marketing: true, preferences: true }, 'accept-all');
      if (action === 'reject') persistConsent(DEFAULT_CONSENT, 'reject-optional');
      if (action === 'customize') openSettings();
      if (action === 'close') closeSettings();
      if (action === 'save') {
        persistConsent({
          analytics: document.getElementById('ctg-consent-analytics')?.checked,
          marketing: document.getElementById('ctg-consent-marketing')?.checked,
          preferences: document.getElementById('ctg-consent-preferences')?.checked
        }, 'custom');
      }
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && !getModal().hidden) closeSettings();
    });
  };

  const getBanner = () => document.getElementById('ctg-consent-banner');
  const getModal = () => document.getElementById('ctg-consent-modal');

  const showBanner = () => { getBanner().hidden = false; };
  const hideBanner = () => { getBanner().hidden = true; };

  const updateControls = (consent) => {
    const analytics = document.getElementById('ctg-consent-analytics');
    const marketing = document.getElementById('ctg-consent-marketing');
    const preferences = document.getElementById('ctg-consent-preferences');
    if (analytics) analytics.checked = Boolean(consent.analytics);
    if (marketing) marketing.checked = Boolean(consent.marketing);
    if (preferences) preferences.checked = Boolean(consent.preferences);
  };

  const openSettings = () => {
    lastFocusedElement = document.activeElement;
    updateControls(currentConsent);
    getModal().hidden = false;
    document.documentElement.classList.add('ctg-consent-lock');
    getModal().querySelector('.ctg-consent-close')?.focus();
  };

  const closeSettings = () => {
    getModal().hidden = true;
    document.documentElement.classList.remove('ctg-consent-lock');
    lastFocusedElement?.focus?.();
  };

  const init = () => {
    renderUi();
    const stored = readStoredConsent();
    if (stored) {
      currentConsent = stored;
      updateControls(stored);
      applyConsent(stored);
      hideBanner();
    } else {
      currentConsent = { ...DEFAULT_CONSENT };
      updateControls(currentConsent);
      applyConsent(currentConsent);
      showBanner();
    }

    window.CARTHAGE_PRIVACY = Object.freeze({
      openSettings,
      getConsent: () => ({ ...currentConsent }),
      reset: () => {
        try { localStorage.removeItem(STORAGE_KEY); } catch {}
        window.location.reload();
      }
    });
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})();
