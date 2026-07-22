(() => {
  'use strict';

  const initDiagnosis = () => {
    const root = document.querySelector('[data-diagnosis]');
    if (!root) return;
    const result = root.querySelector('[data-diagnosis-result]');
    const title = result?.querySelector('[data-result-title]');
    const copy = result?.querySelector('[data-result-copy]');
    const link = result?.querySelector('[data-result-link]');
    const options = {
      new: ['Criação de sites', 'Uma estrutura completa para apresentar a empresa, organizar serviços e facilitar o contato.', 'criacao-de-sites.html'],
      outdated: ['Reformulação de sites', 'Preserve o conteúdo útil e reconstrua experiência, responsividade, hierarquia e chamadas para ação.', 'reformulacao-de-sites.html'],
      ads: ['Landing pages', 'Uma página específica reduz distrações e conecta mensagem, oferta, rastreamento e WhatsApp.', 'landing-pages.html'],
      presence: ['Presença digital', 'Integre domínio, site, canais, dados e evolução em uma infraestrutura coerente.', 'presenca-digital.html']
    };
    root.querySelectorAll('[data-diagnosis-option]').forEach(button => {
      button.addEventListener('click', () => {
        root.querySelectorAll('[data-diagnosis-option]').forEach(item => item.setAttribute('aria-pressed', 'false'));
        button.setAttribute('aria-pressed', 'true');
        const selected = options[button.dataset.diagnosisOption];
        if (!selected || !result) return;
        title.textContent = selected[0];
        copy.textContent = selected[1];
        link.href = selected[2];
        result.hidden = false;
        result.focus({ preventScroll: false });
      });
    });
  };

  const initBeforeAfter = () => {
    document.querySelectorAll('.before-after-wrap').forEach((wrap) => {
      const control = wrap.querySelector('[data-before-after-range]');
      const frame = wrap.querySelector('[data-before-after]');
      if (!control || !frame) return;

      let dragging = false;
      const update = () => {
        const value = Math.max(0, Math.min(100, Number(control.value) || 50));
        frame.style.setProperty('--split', `${value}%`);
        control.setAttribute('aria-valuetext', `${value}% da imagem Depois visível`);
      };
      const setFromPointer = (event) => {
        const rect = frame.getBoundingClientRect();
        if (!rect.width) return;
        const value = ((event.clientX - rect.left) / rect.width) * 100;
        control.value = String(Math.round(Math.max(0, Math.min(100, value))));
        update();
      };

      control.addEventListener('input', update);
      frame.addEventListener('pointerdown', (event) => {
        if (event.pointerType === 'mouse' && event.button !== 0) return;
        dragging = true;
        frame.setPointerCapture?.(event.pointerId);
        setFromPointer(event);
      });
      frame.addEventListener('pointermove', (event) => {
        if (!dragging) return;
        setFromPointer(event);
      });
      const stopDragging = (event) => {
        if (!dragging) return;
        dragging = false;
        if (frame.hasPointerCapture?.(event.pointerId)) frame.releasePointerCapture(event.pointerId);
      };
      frame.addEventListener('pointerup', stopDragging);
      frame.addEventListener('pointercancel', stopDragging);
      frame.addEventListener('lostpointercapture', () => { dragging = false; });
      update();
    });
  };

  const initResponsiveDemo = () => {
    document.querySelectorAll('[data-device-switch]').forEach((button) => {
      button.addEventListener('click', () => {
        const stage = document.querySelector('[data-device-stage]');
        if (!stage) return;
        document.querySelectorAll('[data-device-switch]').forEach(item => item.setAttribute('aria-pressed', 'false'));
        button.setAttribute('aria-pressed', 'true');
        const device = button.dataset.deviceSwitch;
        stage.dataset.device = device;
        const image = stage.querySelector('[data-device-image]');
        const nextSource = image?.getAttribute(`data-${device}-src`);
        if (image && nextSource && image.getAttribute('src') !== nextSource) {
          image.setAttribute('src', nextSource);
        }
      });
    });
  };

  const initProcessTimeline = () => {
    document.querySelectorAll('[data-process-timeline]').forEach((timeline) => {
      const steps = [...timeline.querySelectorAll('[data-process-step]')];
      if (!steps.length) return;
      let scheduled = false;
      const update = () => {
        scheduled = false;
        const threshold = window.innerHeight * 0.62;
        let reached = 0;
        steps.forEach((step, index) => {
          const isReached = step.getBoundingClientRect().top <= threshold;
          step.classList.toggle('is-reached', isReached);
          if (isReached) reached = index + 1;
        });
        const progress = steps.length <= 1 ? 100 : Math.max(0, ((reached - 1) / (steps.length - 1)) * 100);
        timeline.style.setProperty('--timeline-progress', progress.toFixed(2));
      };
      const schedule = () => {
        if (scheduled) return;
        scheduled = true;
        requestAnimationFrame(update);
      };
      window.addEventListener('scroll', schedule, { passive: true });
      window.addEventListener('resize', schedule, { passive: true });
      update();
    });
  };

  const initPromotion = () => {
    const config = window.PROMOTION_CONFIG;
    document.querySelectorAll('[data-promotion-banner]').forEach((banner) => {
      const closed = (() => { try { return sessionStorage.getItem('carthage_promo_closed') === '1'; } catch { return false; } })();
      if (!config?.enabled || !window.SITE_CONFIG?.promotionEnabled || closed) return;
      banner.hidden = false;
      banner.querySelector('[data-promotion-close]')?.addEventListener('click', () => {
        banner.hidden = true;
        try { sessionStorage.setItem('carthage_promo_closed', '1'); } catch {}
      });
    });

    document.querySelectorAll('[data-promo-original]').forEach(node => node.textContent = `R$ ${config.originalPrice}`);
    document.querySelectorAll('[data-promo-price]').forEach(node => node.textContent = `R$ ${config.promotionalPrice}`);
    document.querySelectorAll('[data-promo-remaining]').forEach(node => node.textContent = String(config.remainingSlots));

    if (document.body.dataset.page === 'promocao') {
      window.CARTHAGE_TRACKING?.trackEvent('PromotionView', { remainingSlots: config.remainingSlots });
      if (!config.enabled) document.querySelector('[data-promotion-ended]')?.removeAttribute('hidden');
    }
    document.querySelectorAll('[data-promotion-click]').forEach(button => button.addEventListener('click', () => {
      window.CARTHAGE_TRACKING?.trackEvent('PromotionClick', { remainingSlots: config.remainingSlots });
    }));
  };

  const initAppExperience = () => {
    const appButtons = document.querySelectorAll('[data-app-open]');
    if (!appButtons.length) return;
    window.CARTHAGE_TRACKING?.trackEvent('AppView');
    appButtons.forEach((button) => {
      const appUrl = window.SITE_CONFIG?.appUrl?.trim();
      button.textContent = appUrl ? 'Abrir aplicativo' : 'Solicitar acesso à experiência';
      button.addEventListener('click', (event) => {
        event.preventDefault();
        window.CARTHAGE_TRACKING?.trackEvent('AppOpenClick', { configured: Boolean(appUrl) });
        if (appUrl) window.open(appUrl, '_blank', 'noopener,noreferrer');
        else window.CARTHAGE_TRACKING?.openWhatsApp('Olá! Acessei a página do aplicativo da Carthage e gostaria de solicitar o acesso oficial.', 'aplicativo');
      });
    });

    const video = document.querySelector('[data-app-video]');
    const sourceMp4 = window.MEDIA_CONFIG?.appVideoMp4;
    const sourceWebm = window.MEDIA_CONFIG?.appVideoWebm;
    if (video && (sourceMp4 || sourceWebm)) {
      if (sourceWebm) {
        const source = document.createElement('source'); source.src = sourceWebm; source.type = 'video/webm'; video.appendChild(source);
      }
      if (sourceMp4) {
        const source = document.createElement('source'); source.src = sourceMp4; source.type = 'video/mp4'; video.appendChild(source);
      }
      video.hidden = false;
      document.querySelector('[data-video-pending]')?.setAttribute('hidden', '');
    }
  };

  const initProjectGate = () => {
    const gated = document.querySelector('[data-project-gated="darcio-eloi"]');
    if (!gated) return;
    if (window.PROJECTS_CONFIG?.darcioEloiPublished) {
      gated.querySelector('[data-project-pending]')?.setAttribute('hidden', '');
      gated.querySelector('[data-project-content]')?.removeAttribute('hidden');
      window.CARTHAGE_TRACKING?.trackEvent('PortfolioView', { project: 'darcio-eloi' });
    } else {
      document.querySelector('meta[name="robots"]')?.setAttribute('content', 'noindex,nofollow');
    }
  };

  const initServiceTracking = () => {
    const page = document.body?.dataset.page;
    if (['solucoes', 'criacao-de-sites', 'landing-pages', 'reformulacao-de-sites', 'presenca-digital'].includes(page)) {
      window.CARTHAGE_TRACKING?.trackEvent('ServiceView', { service: page });
    }
    if (page === 'portfolio') window.CARTHAGE_TRACKING?.trackEvent('PortfolioView', { project: 'index' });
  };

  initDiagnosis();
  initBeforeAfter();
  initResponsiveDemo();
  initProcessTimeline();
  initPromotion();
  initAppExperience();
  initProjectGate();
  initServiceTracking();
})();
