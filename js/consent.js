(() => {
  'use strict';

  const config = window.CARTHAGE_PRIVACY_CONFIG || {};
  const STORAGE_KEY = config.storageKey || 'carthage_privacy_consent_v3';
  const INTERFACE_KEY = 'carthage_interface_preferences_v1';
  const CONSENT_VERSION = config.version || '1';
  const DEFAULT_CONSENT = Object.freeze({
    necessary: true,
    analytics: false,
    marketing: false,
    preferences: false
  });
  const DEFAULT_INTERFACE = Object.freeze({
    theme: 'original',
    contrast: 'standard',
    textSize: 'standard',
    density: 'comfortable',
    motion: 'full',
    autoplay: 'on'
  });

  let currentConsent = { ...DEFAULT_CONSENT };
  let interfacePreferences = { ...DEFAULT_INTERFACE };
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

  const readInterfacePreferences = () => {
    let record = null;
    try { record = safeParse(localStorage.getItem(INTERFACE_KEY)); } catch { return { ...DEFAULT_INTERFACE }; }
    if (!record) return { ...DEFAULT_INTERFACE };
    return Object.fromEntries(Object.entries(DEFAULT_INTERFACE).map(([key, fallback]) => {
      const candidate = String(record[key] || '');
      const allowed = {
        theme: ['original', 'dark', 'light'],
        contrast: ['standard', 'high'],
        textSize: ['standard', 'large'],
        density: ['comfortable', 'compact'],
        motion: ['full', 'reduced'],
        autoplay: ['on', 'off']
      }[key];
      return [key, allowed?.includes(candidate) ? candidate : fallback];
    }));
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

  const applyAutoplay = (value) => {
    document.querySelectorAll('video').forEach((video) => {
      video.autoplay = value === 'on';
      if (value === 'off') {
        video.pause();
        video.dataset.userPaused = 'true';
      } else if (video.muted && video.hasAttribute('loop')) {
        delete video.dataset.userPaused;
        video.play().catch(() => {});
      }
    });
  };

  const applyInterfacePreferences = (preferences, { persist = false } = {}) => {
    interfacePreferences = { ...DEFAULT_INTERFACE, ...preferences };
    const root = document.documentElement;
    root.dataset.interfaceTheme = interfacePreferences.theme;
    root.dataset.interfaceContrast = interfacePreferences.contrast;
    root.dataset.interfaceText = interfacePreferences.textSize;
    root.dataset.interfaceDensity = interfacePreferences.density;
    root.dataset.interfaceMotion = interfacePreferences.motion;
    root.dataset.interfaceAutoplay = interfacePreferences.autoplay;
    applyAutoplay(interfacePreferences.autoplay);
    if (persist) {
      try { localStorage.setItem(INTERFACE_KEY, JSON.stringify(interfacePreferences)); } catch {}
    }
    document.querySelectorAll('[data-interface-setting]').forEach((button) => {
      const active = interfacePreferences[button.dataset.interfaceSetting] === button.dataset.interfaceValue;
      button.setAttribute('aria-pressed', String(active));
    });
    window.dispatchEvent(new CustomEvent('carthage:interface-updated', {
      detail: { ...interfacePreferences }
    }));
  };

  const policyUrl = config.policyUrl || 'politica-de-privacidade.html';
  const cookiesUrl = config.cookiesUrl || 'politica-de-cookies.html';

  const renderUi = () => {
    if (document.getElementById('ctg-consent-banner')) return;
    const wrapper = document.createElement('div');
    wrapper.innerHTML = `
      <section class="ctg-consent-banner" id="ctg-consent-banner" role="region" aria-label="Aviso de privacidade" hidden>
        <div class="ctg-consent-banner__top">
          <span class="ctg-consent-mark" aria-hidden="true"><img src="assets/logo/favicon-64.png" alt="" width="34" height="34"></span>
          <div>
            <h2 class="ctg-consent-title">Privacidade com escolha real.</h2>
            <p class="ctg-consent-description">
              Recursos essenciais permanecem ativos. Medição, publicidade e preferências só entram em funcionamento conforme sua decisão.
              <a href="${policyUrl}">Privacidade</a> · <a href="${cookiesUrl}">Cookies</a>
            </p>
          </div>
          <button class="ctg-consent-banner__close" type="button" data-consent-action="reject" aria-label="Fechar e manter apenas recursos necessários">×</button>
        </div>
        <div class="ctg-consent-actions">
          <button class="ctg-consent-button ctg-consent-button--plain" type="button" data-consent-action="reject">Somente necessários</button>
          <button class="ctg-consent-button" type="button" data-consent-action="customize">Configurar escolhas</button>
          <button class="ctg-consent-button ctg-consent-button--primary" type="button" data-consent-action="accept">Aceitar opcionais</button>
        </div>
      </section>

      <div class="ctg-consent-modal" id="ctg-consent-modal" hidden>
        <section class="ctg-consent-dialog" role="dialog" aria-modal="true" aria-labelledby="ctg-consent-title" tabindex="-1">
          <header class="ctg-consent-dialog-header">
            <div>
              <p class="ctg-consent-eyebrow">Central de escolhas</p>
              <h2 id="ctg-consent-title">Privacidade e experiência sob seu controle</h2>
              <p>Cada alteração é aplicada imediatamente. Você pode retornar a esta central pelo rodapé.</p>
            </div>
            <button class="ctg-consent-close" type="button" data-consent-action="close" aria-label="Fechar central de escolhas">×</button>
          </header>

          <nav class="ctg-preference-tabs" aria-label="Categorias de configuração">
            <button type="button" aria-selected="true" data-preference-tab="privacy">Privacidade</button>
            <button type="button" aria-selected="false" data-preference-tab="appearance">Aparência</button>
            <button type="button" aria-selected="false" data-preference-tab="accessibility">Leitura</button>
            <button type="button" aria-selected="false" data-preference-tab="media">Mídia</button>
          </nav>

          <div class="ctg-consent-options">
            <section class="ctg-preference-panel is-active" data-preference-panel="privacy">
              <div class="ctg-preference-intro">
                <strong>Tecnologias e finalidades</strong>
                <span>O estado abaixo corresponde ao que realmente pode ser carregado nesta sessão.</span>
              </div>
              <section class="ctg-consent-option">
                <div><h3>Necessários</h3><p>Navegação, segurança, prevenção de abuso e registro local das escolhas.</p></div>
                <span class="ctg-consent-status">Sempre ativos</span>
              </section>
              <section class="ctg-consent-option">
                <div><h3>Analíticos</h3><p>Métricas agregadas do Google Analytics somente quando houver ID válido e autorização.</p></div>
                <label class="ctg-consent-switch" aria-label="Ativar tecnologias analíticas">
                  <input type="checkbox" id="ctg-consent-analytics"><span class="ctg-consent-slider"></span>
                </label>
              </section>
              <section class="ctg-consent-option">
                <div><h3>Publicitários</h3><p>Meta Pixel e eventos de campanha para compreender resultados de anúncios.</p></div>
                <label class="ctg-consent-switch" aria-label="Ativar tecnologias publicitárias">
                  <input type="checkbox" id="ctg-consent-marketing"><span class="ctg-consent-slider"></span>
                </label>
              </section>
              <section class="ctg-consent-option">
                <div><h3>Preferências</h3><p>Permite lembrar tema, leitura, densidade, movimento e reprodução de mídia.</p></div>
                <label class="ctg-consent-switch" aria-label="Ativar armazenamento de preferências">
                  <input type="checkbox" id="ctg-consent-preferences"><span class="ctg-consent-slider"></span>
                </label>
              </section>
            </section>

            <section class="ctg-preference-panel" data-preference-panel="appearance" hidden>
              <div class="ctg-preference-intro"><strong>Aparência</strong><span>Escolha a composição cromática e a densidade da interface.</span></div>
              <div class="ctg-setting">
                <div><h3>Tema visual</h3><p>Original preserva a direção de arte; escuro reforça contraste; claro suaviza grandes superfícies.</p></div>
                <div class="ctg-setting__choices" role="group" aria-label="Tema visual">
                  <button type="button" data-interface-setting="theme" data-interface-value="original">Original</button>
                  <button type="button" data-interface-setting="theme" data-interface-value="dark">Escuro</button>
                  <button type="button" data-interface-setting="theme" data-interface-value="light">Claro</button>
                </div>
              </div>
              <div class="ctg-setting">
                <div><h3>Densidade</h3><p>Controle o espaço vertical entre cartões e seções sem remover conteúdo.</p></div>
                <div class="ctg-setting__choices" role="group" aria-label="Densidade da interface">
                  <button type="button" data-interface-setting="density" data-interface-value="comfortable">Confortável</button>
                  <button type="button" data-interface-setting="density" data-interface-value="compact">Compacta</button>
                </div>
              </div>
            </section>

            <section class="ctg-preference-panel" data-preference-panel="accessibility" hidden>
              <div class="ctg-preference-intro"><strong>Leitura e movimento</strong><span>Ajustes funcionais para legibilidade e previsibilidade.</span></div>
              <div class="ctg-setting">
                <div><h3>Tamanho do texto</h3><p>A versão ampliada aumenta a escala tipográfica sem aplicar zoom nas imagens.</p></div>
                <div class="ctg-setting__choices" role="group" aria-label="Tamanho do texto">
                  <button type="button" data-interface-setting="textSize" data-interface-value="standard">Padrão</button>
                  <button type="button" data-interface-setting="textSize" data-interface-value="large">Ampliado</button>
                </div>
              </div>
              <div class="ctg-setting">
                <div><h3>Contraste</h3><p>O contraste alto reforça textos secundários, bordas e estados de foco.</p></div>
                <div class="ctg-setting__choices" role="group" aria-label="Nível de contraste">
                  <button type="button" data-interface-setting="contrast" data-interface-value="standard">Padrão</button>
                  <button type="button" data-interface-setting="contrast" data-interface-value="high">Alto</button>
                </div>
              </div>
              <div class="ctg-setting">
                <div><h3>Animações</h3><p>Reduzido remove movimentos decorativos e mantém somente mudanças de estado essenciais.</p></div>
                <div class="ctg-setting__choices" role="group" aria-label="Intensidade das animações">
                  <button type="button" data-interface-setting="motion" data-interface-value="full">Completas</button>
                  <button type="button" data-interface-setting="motion" data-interface-value="reduced">Reduzidas</button>
                </div>
              </div>
            </section>

            <section class="ctg-preference-panel" data-preference-panel="media" hidden>
              <div class="ctg-preference-intro"><strong>Reprodução de mídia</strong><span>Controle imediatamente os vídeos automáticos e silenciosos do site.</span></div>
              <div class="ctg-setting">
                <div><h3>Vídeos automáticos</h3><p>Quando desligados, todos os vídeos são pausados; imagens de pôster permanecem visíveis.</p></div>
                <div class="ctg-setting__choices" role="group" aria-label="Reprodução automática">
                  <button type="button" data-interface-setting="autoplay" data-interface-value="on">Ativada</button>
                  <button type="button" data-interface-setting="autoplay" data-interface-value="off">Desativada</button>
                </div>
              </div>
              <div class="ctg-preference-summary">
                <span>Sem som automático</span><span>Sem reprodução oculta</span><span>Pôster de segurança</span>
              </div>
            </section>
          </div>

          <footer class="ctg-consent-dialog-footer">
            <button class="ctg-consent-button ctg-consent-button--plain" type="button" data-consent-action="reset-interface">Restaurar interface</button>
            <span>Alterações aplicadas automaticamente</span>
            <button class="ctg-consent-button ctg-consent-button--primary" type="button" data-consent-action="close">Concluir</button>
          </footer>
        </section>
      </div>
      <div class="ctg-consent-notice" id="ctg-consent-notice" role="status" aria-live="polite" hidden>Escolha aplicada.</div>`;
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
  const updateConsentControls = (consent) => {
    ['analytics', 'marketing', 'preferences'].forEach((key) => {
      const input = document.getElementById(`ctg-consent-${key}`);
      if (input) input.checked = Boolean(consent[key]);
    });
  };
  const showNotice = (message = 'Escolha aplicada.') => {
    const notice = getNotice();
    if (!notice) return;
    notice.textContent = message;
    notice.hidden = false;
    window.clearTimeout(showNotice.timer);
    showNotice.timer = window.setTimeout(() => { notice.hidden = true; }, 1900);
  };

  const persistConsent = (categories, source, { close = false, notify = true } = {}) => {
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
    updateConsentControls(currentConsent);
    hideBanner();
    if (close) closeSettings({ restoreFocus: false, immediate: true });
    if (notify) showNotice(source === 'accept-all' ? 'Tecnologias opcionais autorizadas.' : 'Escolha aplicada imediatamente.');
    window.dispatchEvent(new CustomEvent('carthage:consent-updated', { detail: { ...currentConsent } }));
  };

  const openSettings = (tab = 'privacy') => {
    const modal = getModal();
    const dialog = getDialog();
    if (!modal || !dialog) return;
    window.clearTimeout(closeTimer);
    lastFocusedElement = document.activeElement;
    settingsOpenedFromBanner = Boolean(getBanner() && !getBanner().hidden);
    updateConsentControls(currentConsent);
    applyInterfacePreferences(interfacePreferences);
    hideBanner();
    modal.hidden = false;
    document.documentElement.classList.add('ctg-consent-lock');
    switchTab(tab);
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

  const switchTab = (name) => {
    document.querySelectorAll('[data-preference-tab]').forEach((button) => {
      button.setAttribute('aria-selected', String(button.dataset.preferenceTab === name));
    });
    document.querySelectorAll('[data-preference-panel]').forEach((panel) => {
      const active = panel.dataset.preferencePanel === name;
      panel.hidden = !active;
      panel.classList.toggle('is-active', active);
    });
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
        openSettings(settingsButton.dataset.openPrivacySettings || 'privacy');
        return;
      }
      const tab = event.target.closest('[data-preference-tab]');
      if (tab) {
        event.preventDefault();
        switchTab(tab.dataset.preferenceTab);
        return;
      }
      const interfaceButton = event.target.closest('[data-interface-setting]');
      if (interfaceButton) {
        event.preventDefault();
        const next = {
          ...interfacePreferences,
          [interfaceButton.dataset.interfaceSetting]: interfaceButton.dataset.interfaceValue
        };
        applyInterfacePreferences(next, { persist: true });
        if (!currentConsent.preferences) {
          persistConsent({ ...currentConsent, preferences: true }, 'interface-preference', { notify: false });
        }
        showNotice('Preferência de interface aplicada.');
        return;
      }
      const actionButton = event.target.closest('[data-consent-action]');
      if (actionButton) {
        event.preventDefault();
        const action = actionButton.dataset.consentAction;
        if (action === 'accept') persistConsent({ analytics: true, marketing: true, preferences: true }, 'accept-all', { close: true });
        else if (action === 'reject') persistConsent(DEFAULT_CONSENT, 'reject-optional', { close: true });
        else if (action === 'customize') openSettings();
        else if (action === 'close') closeSettings();
        else if (action === 'reset-interface') {
          try { localStorage.removeItem(INTERFACE_KEY); } catch {}
          applyInterfacePreferences(DEFAULT_INTERFACE);
          showNotice('Interface restaurada ao padrão.');
        }
        return;
      }
      const modal = getModal();
      if (modal && event.target === modal) closeSettings();
    });

    document.addEventListener('change', (event) => {
      const input = event.target.closest('#ctg-consent-analytics, #ctg-consent-marketing, #ctg-consent-preferences');
      if (!input) return;
      const key = input.id.replace('ctg-consent-', '');
      persistConsent({ ...currentConsent, [key]: input.checked }, `instant-${key}`, { notify: true });
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
    interfacePreferences = readInterfacePreferences();
    applyInterfacePreferences(interfacePreferences);
    renderUi();
    bindEvents();
    const stored = readStoredConsent();
    hasStoredDecision = Boolean(stored);
    currentConsent = stored || { ...DEFAULT_CONSENT };
    updateConsentControls(currentConsent);
    applyConsent(currentConsent);
    applyInterfacePreferences(interfacePreferences);
    if (stored) hideBanner(); else showBanner();
    window.CARTHAGE_PRIVACY = Object.freeze({
      openSettings,
      getConsent: () => ({ ...currentConsent }),
      getInterfacePreferences: () => ({ ...interfacePreferences }),
      reset: () => {
        try {
          localStorage.removeItem(STORAGE_KEY);
          localStorage.removeItem(INTERFACE_KEY);
        } catch {}
        window.location.reload();
      }
    });
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})();
