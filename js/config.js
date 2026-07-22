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
    appUrl: '', // PENDÊNCIA: inserir URL oficial do aplicativo.
    promotionEnabled: true
  });

  window.PROMOTION_CONFIG = Object.freeze({
    enabled: true,
    originalPrice: 925,
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
    appVideo: Object.freeze({
      slug: 'aplicativo-video',
      landingPage: 'aplicativo.html',
      defaultUtmCampaign: 'app_video'
    }),
    portfolioPromotion: Object.freeze({
      slug: 'promocao-portfolio',
      landingPage: 'promocao.html',
      defaultUtmCampaign: 'promocao_3_projetos'
    })
  });

  window.CARTHAGE_PRIVACY_CONFIG = Object.freeze({
    version: '2026-07-20',
    storageKey: 'carthage_privacy_consent_v2',
    googleAnalyticsId: '', // PENDÊNCIA: inserir um ID GA4 real no formato G-XXXXXXXXXX.
    metaPixelId: '1570216137830619',
    policyUrl: 'politica-de-privacidade.html',
    cookiesUrl: 'politica-de-cookies.html',
    debug: false
  });

  window.PROJECTS_CONFIG = Object.freeze({
    darcioEloiPublished: true // Projeto publicado com mídia fornecida e sem dados de negociação.
  });

  window.MEDIA_CONFIG = Object.freeze({
    appVideoMp4: '', // PENDÊNCIA: inserir vídeo autorizado e comprimido.
    appVideoWebm: '',
    appVideoPoster: 'assets/images/aplicativo-poster-mobile.webp'
  });
})();
