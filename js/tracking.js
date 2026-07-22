(() => {
  'use strict';

  const ATTRIBUTION_KEY = 'carthage_attribution_v1';
  const allowedParams = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'fbclid'];

  const safeStorage = {
    get(key) {
      try { return sessionStorage.getItem(key); } catch { return null; }
    },
    set(key, value) {
      try { sessionStorage.setItem(key, value); } catch {}
    }
  };

  const parseJson = (value) => {
    try { return JSON.parse(value); } catch { return null; }
  };

  const captureAttribution = () => {
    const current = parseJson(safeStorage.get(ATTRIBUTION_KEY)) || {};
    const params = new URLSearchParams(window.location.search);
    const next = { ...current };
    let changed = false;

    allowedParams.forEach((key) => {
      const value = params.get(key);
      if (value) {
        next[key] = value.slice(0, 180);
        changed = true;
      }
    });

    if (!next.firstLandingPage) {
      next.firstLandingPage = window.location.pathname;
      next.firstSeenAt = new Date().toISOString();
      changed = true;
    }

    if (changed) safeStorage.set(ATTRIBUTION_KEY, JSON.stringify(next));
    return next;
  };

  const getAttribution = () => parseJson(safeStorage.get(ATTRIBUTION_KEY)) || captureAttribution();

  const hasMarketingConsent = () => {
    const consent = window.CARTHAGE_PRIVACY?.getConsent?.();
    return Boolean(consent?.marketing);
  };

  const trackEvent = (eventName, parameters = {}) => {
    const payload = {
      page: document.body?.dataset.page || 'unknown',
      path: window.location.pathname,
      ...parameters
    };

    if (hasMarketingConsent() && typeof window.fbq === 'function') {
      window.fbq('trackCustom', eventName, payload);
    }

    window.dispatchEvent(new CustomEvent('carthage:track', {
      detail: { eventName, parameters: payload }
    }));
  };

  const attributionLabel = () => {
    const data = getAttribution();
    const campaign = data.utm_campaign || document.body?.dataset.campaign || '';
    return campaign ? `\nOrigem: ${campaign}` : '';
  };

  const openWhatsApp = (message, context = 'site') => {
    const config = window.SITE_CONFIG;
    if (!config?.whatsappNumber) return;

    const completeMessage = `${String(message || '').trim()}${attributionLabel()}`;
    trackEvent('WhatsAppClick', { context });
    trackEvent('Contact', { channel: 'whatsapp', context });
    window.open(`https://wa.me/${config.whatsappNumber}?text=${encodeURIComponent(completeMessage)}`, '_blank', 'noopener,noreferrer');
  };

  const bindWhatsApp = () => {
    document.addEventListener('click', (event) => {
      const button = event.target.closest('[data-whatsapp-message]');
      if (!button) return;
      event.preventDefault();
      openWhatsApp(button.dataset.whatsappMessage, button.dataset.whatsappContext || document.body?.dataset.page || 'site');
    });
  };

  captureAttribution();
  bindWhatsApp();

  window.CARTHAGE_TRACKING = Object.freeze({
    captureAttribution,
    getAttribution,
    trackEvent,
    openWhatsApp
  });
})();
