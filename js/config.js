(() => {
  'use strict';

  window.SITE_CONFIG = Object.freeze({
    companyName: 'Carthage',
    domain: 'https://www.carthage.com.br',
    email: 'carthage.incorporated@gmail.com',
    phoneDisplay: '(62) 99981-0066',
    phoneInternational: '+55 62 99981-0066',
    whatsappNumber: '5562999810066',
    instagramHandle: '@carthage.inc',
    instagramUrl: 'https://www.instagram.com/carthage.inc',
    facebookLabel: 'Carthage Inc no Facebook',
    facebookUrl: 'https://www.facebook.com/profile.php?id=61591788260760',
    promotionEnabled: true
  });

  window.PROMOTION_CONFIG = Object.freeze({
    enabled: true,
    originalPrice: '925–1.499',
    promotionalPrice: 300,
    totalSlots: 3,
    remainingSlots: 3,
    label: 'Condição especial de portfólio'
  });

  window.CAMPAIGNS = Object.freeze({
    whatsappDirect: Object.freeze({
      slug: 'whatsapp-direto',
      landingPage: 'iniciar-projeto.html',
      defaultUtmCampaign: 'contato_direto'
    }),
    portfolioPromotion: Object.freeze({
      slug: 'promocao-portfolio',
      landingPage: 'promocao.html',
      defaultUtmCampaign: 'promocao_3_projetos'
    })
  });

  window.CARTHAGE_PRIVACY_CONFIG = Object.freeze({
    version: '2026-07-27',
    storageKey: 'carthage_privacy_consent_v3',
    googleAnalyticsId: '', // Ativar somente com um ID GA4 real no formato G-XXXXXXXXXX.
    metaPixelId: '1570216137830619',
    policyUrl: 'politica-de-privacidade.html',
    cookiesUrl: 'politica-de-cookies.html',
    debug: false
  });

  window.PROJECTS_CONFIG = Object.freeze({
    darcioEloiPublished: true // Projeto publicado com mídia fornecida e sem dados de negociação.
  });

})();
