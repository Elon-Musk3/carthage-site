/**
 * Configuração central de privacidade da Carthage.
 *
 * IMPORTANTE:
 * - O Meta Pixel só é carregado depois do consentimento para publicidade.
 * - O Google Analytics só é carregado depois do consentimento para analytics.
 * - Para ativar o GA4, substitua a string vazia pelo seu ID no formato G-XXXXXXXXXX.
 * - Não cole scripts brutos de Analytics ou Pixel diretamente no index.html.
 */
(() => {
  const isLegalPage = /(?:^|\/)legal(?:\/|$)/.test(window.location.pathname);

  window.CARTHAGE_PRIVACY_CONFIG = Object.freeze({
    version: '2026-07-03',
    storageKey: 'carthage_privacy_consent_v1',
    googleAnalyticsId: '',
    metaPixelId: '1066622929266871',
    policyUrl: isLegalPage ? 'privacidade.html' : 'legal/privacidade.html',
    cookiesUrl: isLegalPage ? 'cookies.html' : 'legal/cookies.html',
    debug: false
  });
})();
