(() => {
  'use strict';

  const initDiagnosis = () => {
    const root = document.querySelector('[data-diagnosis]');
    if (!root) return;
    const result = root.querySelector('[data-diagnosis-result]');
    const title = result?.querySelector('[data-result-title]');
    const copy = result?.querySelector('[data-result-copy]');
    const reason = result?.querySelector('[data-result-reason]');
    const deliverables = result?.querySelector('[data-result-deliverables]');
    const link = result?.querySelector('[data-result-link]');
    const options = {
      new: {
        title: 'Criação de site institucional',
        copy: 'Construa uma presença própria para explicar a empresa, organizar serviços, sustentar confiança e transformar interesse em uma conversa.',
        reason: 'Indicado quando ainda não existe uma base digital controlada pela empresa ou quando tudo depende de redes sociais e mensagens dispersas.',
        items: ['Arquitetura de páginas', 'Conteúdo e hierarquia', 'Experiência responsiva', 'Contato pelo WhatsApp'],
        href: 'criacao-de-sites.html',
        label: 'Explorar criação de sites'
      },
      outdated: {
        title: 'Reformulação responsável',
        copy: 'Preserve o conteúdo útil e reconstrua o que limita leitura, credibilidade, responsividade, desempenho e conversão.',
        reason: 'Indicado quando o site ainda tem valor, mas a experiência visual ou técnica já não representa a empresa nem funciona bem em todos os dispositivos.',
        items: ['Auditoria do que existe', 'Mapa de preservação', 'Nova interface', 'Validação e migração'],
        href: 'reformulacao-de-sites.html',
        label: 'Entender a reformulação'
      },
      ads: {
        title: 'Landing page de campanha',
        copy: 'Concentre mensagem, oferta, prova, resposta a objeções e uma única chamada para ação em uma rota mensurável.',
        reason: 'Indicado para anúncios, lançamentos, condições comerciais e iniciativas que perdem força quando enviadas para uma página genérica.',
        items: ['Mensagem específica', 'Jornada curta', 'Rastreamento consentido', 'Contato contextual'],
        href: 'landing-pages.html',
        label: 'Planejar uma landing page'
      },
      presence: {
        title: 'Estrutura de presença digital',
        copy: 'Conecte domínio, site, canais, campanhas, dados e rotina de evolução sem depender de uma plataforma isolada.',
        reason: 'Indicado quando a empresa já produz conteúdo e atende clientes, mas seus ativos digitais não formam um sistema coerente e controlável.',
        items: ['Domínio e propriedade', 'Mapa de canais', 'Medição responsável', 'Plano de evolução'],
        href: 'presenca-digital.html',
        label: 'Organizar a presença digital'
      },
      system: {
        title: 'Diagnóstico de produto digital',
        copy: 'Portais, sistemas, SaaS, aplicativos, automações e APIs começam pela definição de usuários, regras, dados, permissões e integrações.',
        reason: 'Indicado quando o produto precisa executar tarefas, manter estados, autenticar pessoas ou conectar processos — e não apenas publicar conteúdo.',
        items: ['Fluxos e perfis', 'Regras de negócio', 'Dados e integrações', 'Escopo por etapas'],
        href: 'iniciar-projeto.html',
        label: 'Solicitar diagnóstico de produto'
      },
      recurring: {
        title: 'Operação recorrente ou painel próprio',
        copy: 'Compare a manutenção assistida com a criação de um ambiente em que a própria equipe cadastra, publica, atualiza e remove conteúdos.',
        reason: 'Indicado para catálogos, cardápios, ofertas, portfólios e páginas que mudam com frequência e precisam de governança.',
        items: ['Rotina de atualização', 'Papéis e permissões', 'Painel administrativo', 'Suporte proporcional'],
        href: 'contato.html#diagnostico',
        label: 'Comparar modelos de operação'
      }
    };
    root.querySelectorAll('[data-diagnosis-option]').forEach(button => {
      button.addEventListener('click', () => {
        root.querySelectorAll('[data-diagnosis-option]').forEach(item => item.setAttribute('aria-pressed', 'false'));
        button.setAttribute('aria-pressed', 'true');
        const selected = options[button.dataset.diagnosisOption];
        if (!selected || !result) return;
        title.textContent = selected.title;
        copy.textContent = selected.copy;
        if (reason) reason.textContent = selected.reason;
        if (deliverables) {
          deliverables.replaceChildren(...selected.items.map((item) => {
            const listItem = document.createElement('li');
            listItem.textContent = item;
            return listItem;
          }));
        }
        link.href = selected.href;
        link.textContent = selected.label;
        link.hidden = false;
        result.hidden = false;
        result.classList.remove('is-updating');
        requestAnimationFrame(() => result.classList.add('is-updating'));
        if (window.matchMedia('(max-width: 760px)').matches) {
          result.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      });
    });
  };

  const initBeforeAfter = () => {
    document.querySelectorAll('.before-after-wrap').forEach((wrap) => {
      const control = wrap.querySelector('[data-before-after-range]');
      const frame = wrap.querySelector('[data-before-after]');
      if (!control || !frame) return;

      const beforeLabel = frame.querySelector('.before-after__media--before .before-after__label');
      const afterLabel = frame.querySelector('.before-after__media--after .before-after__label');
      let dragging = false;
      let activePointerId = null;
      let hasInteracted = false;
      let animationFrame = 0;
      let observer = null;
      const clampValue = (rawValue, fallback = 50) => {
        const parsed = Number.parseFloat(rawValue);
        const value = Number.isFinite(parsed) ? parsed : fallback;
        return Math.max(0, Math.min(100, value));
      };
      const cancelIntro = () => {
        hasInteracted = true;
        frame.classList.remove('is-intro');
        if (animationFrame) cancelAnimationFrame(animationFrame);
        animationFrame = 0;
        observer?.disconnect();
      };
      const media = [...frame.querySelectorAll('img')];
      media.forEach((image) => {
        image.draggable = false;
        image.addEventListener('dragstart', (event) => event.preventDefault());
      });
      const update = () => {
        const value = clampValue(control.value);
        control.value = String(Math.round(value));
        frame.style.setProperty('--split', `${value}%`);
        control.setAttribute('aria-valuetext', `${value}% da simulação anterior visível e ${100 - value}% da interface publicada visível`);

        const frameWidth = frame.getBoundingClientRect().width || frame.clientWidth || 1000;
        const requiredSpace = (label) => {
          const measuredWidth = label?.getBoundingClientRect().width || label?.scrollWidth || 220;
          return Math.min(frameWidth * .48, measuredWidth + 44);
        };
        const beforeHidden = (frameWidth * value / 100) < requiredSpace(beforeLabel);
        const afterHidden = (frameWidth * (100 - value) / 100) < requiredSpace(afterLabel);
        frame.classList.toggle('is-before-label-hidden', beforeHidden);
        frame.classList.toggle('is-after-label-hidden', afterHidden);
        beforeLabel?.setAttribute('aria-hidden', String(beforeHidden));
        afterLabel?.setAttribute('aria-hidden', String(afterHidden));
      };
      const setFromPointer = (event) => {
        const rect = frame.getBoundingClientRect();
        if (!rect.width) return;
        const pointerX = Math.max(rect.left, Math.min(rect.right, event.clientX));
        const value = ((pointerX - rect.left) / rect.width) * 100;
        control.value = String(Math.round(clampValue(value)));
        update();
      };

      control.addEventListener('input', (event) => {
        if (event.isTrusted) cancelIntro();
        update();
      });
      control.addEventListener('pointerdown', cancelIntro);
      control.addEventListener('keydown', (event) => {
        if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End', 'PageUp', 'PageDown'].includes(event.key)) {
          cancelIntro();
        }
      });
      frame.addEventListener('dragstart', (event) => event.preventDefault());
      frame.addEventListener('selectstart', (event) => event.preventDefault());
      frame.addEventListener('pointerdown', (event) => {
        if (event.pointerType === 'mouse' && event.button !== 0) return;
        event.preventDefault();
        cancelIntro();
        dragging = true;
        activePointerId = event.pointerId;
        frame.classList.add('is-dragging');
        frame.setPointerCapture?.(event.pointerId);
        setFromPointer(event);
      });
      frame.addEventListener('pointermove', (event) => {
        if (!dragging || event.pointerId !== activePointerId) return;
        event.preventDefault();
        setFromPointer(event);
      });
      const stopDragging = (event) => {
        if (!dragging || (activePointerId !== null && event.pointerId !== activePointerId)) return;
        dragging = false;
        frame.classList.remove('is-dragging');
        if (frame.hasPointerCapture?.(event.pointerId)) frame.releasePointerCapture(event.pointerId);
        activePointerId = null;
      };
      frame.addEventListener('pointerup', stopDragging);
      frame.addEventListener('pointercancel', stopDragging);
      frame.addEventListener('lostpointercapture', () => {
        dragging = false;
        activePointerId = null;
        frame.classList.remove('is-dragging');
      });
      update();

      const animateToCenter = () => {
        if (hasInteracted) return;
        const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (reducedMotion) {
          control.value = '50';
          update();
          return;
        }
        const from = clampValue(control.value, 8);
        const startedAt = performance.now();
        const duration = 1080;
        frame.classList.add('is-intro');
        const step = (now) => {
          if (hasInteracted) return;
          const progress = Math.min(1, (now - startedAt) / duration);
          const eased = progress * progress * (3 - (2 * progress));
          control.value = String(Math.round(from + (50 - from) * eased));
          update();
          if (progress < 1) {
            animationFrame = requestAnimationFrame(step);
          } else {
            animationFrame = 0;
            frame.classList.remove('is-intro');
          }
        };
        animationFrame = requestAnimationFrame(step);
      };

      if ('IntersectionObserver' in window) {
        observer = new IntersectionObserver(([entry]) => {
          if (!entry.isIntersecting) return;
          observer.disconnect();
          window.setTimeout(animateToCenter, 180);
        }, { threshold: 0.28 });
        observer.observe(frame);
      } else {
        window.setTimeout(animateToCenter, 220);
      }
    });
  };

  const initResponsiveDemo = () => {
    document.querySelectorAll('[data-device-stage]').forEach((stage) => {
      const section = stage.closest('section') || document;
      const buttons = [...section.querySelectorAll('[data-device-switch]')];
      const image = stage.querySelector('[data-device-image]');
      const status = section.querySelector('[data-device-status]');
      const statusCopy = {
        desktop: 'Desktop · captura panorâmica real do projeto publicado',
        tablet: 'Tablet · captura intermediária real do projeto publicado',
        mobile: 'Celular · captura vertical real do projeto publicado'
      };

      const showDevice = (device) => {
        if (!image || !device) return;
        const nextSource = image.getAttribute(`data-${device}-src`);
        const nextAlt = image.getAttribute(`data-${device}-alt`);
        buttons.forEach((item) => item.setAttribute('aria-pressed', String(item.dataset.deviceSwitch === device)));
        stage.dataset.device = device;
        if (status) status.textContent = statusCopy[device] || '';
        if (!nextSource || image.getAttribute('src') === nextSource) {
          if (nextAlt) image.alt = nextAlt;
          return;
        }

        stage.classList.add('is-switching');
        const preload = new Image();
        preload.src = nextSource;
        const ready = preload.decode
          ? preload.decode().catch(() => {})
          : new Promise((resolve) => {
              preload.addEventListener('load', resolve, { once: true });
              preload.addEventListener('error', resolve, { once: true });
            });
        ready.finally(() => {
          image.src = nextSource;
          if (nextAlt) image.alt = nextAlt;
          requestAnimationFrame(() => requestAnimationFrame(() => stage.classList.remove('is-switching')));
        });
      };

      buttons.forEach((button) => {
      button.addEventListener('click', () => {
        showDevice(button.dataset.deviceSwitch);
      });
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
      const ended = document.querySelector('[data-promotion-ended]');
      if (config.enabled) {
        if (ended) ended.hidden = true;
      } else {
        document.querySelectorAll('main > section:not([data-promotion-ended])').forEach(section => { section.hidden = true; });
        if (ended) ended.hidden = false;
      }
    }
    document.querySelectorAll('[data-promotion-click]').forEach(button => button.addEventListener('click', () => {
      window.CARTHAGE_TRACKING?.trackEvent('PromotionClick', { remainingSlots: config.remainingSlots });
    }));
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
  initProjectGate();
  initServiceTracking();
})();
