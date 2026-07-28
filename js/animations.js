(() => {
  'use strict';

  const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  const finePointerQuery = window.matchMedia('(hover: hover) and (pointer: fine)');
  const desktopQuery = window.matchMedia('(min-width: 901px)');
  const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));

  const copySelector = [
    '.hero__copy',
    '.section-heading',
    '.project-feature__copy',
    '.footer-cta__content',
    '.campaign-content',
    '.compatibility-card',
    '.experience-hero__copy',
    '.experience-story__copy',
    '.experience-audit > div',
    '.hero-case-proof__body',
    '.legal-hero > .container'
  ].join(',');

  const cardSelector = [
    '.card',
    '.portfolio-card',
    '.related-path',
    '.contact-channel',
    '.scope-item',
    '.process-step__content',
    '.faq-item',
    '.service-preview',
    '.principle-system article',
    '.legal-icon-cluster a',
    '.capability-card',
    '.commercial-card',
    '.experience-detail-grid article',
    '.experience-next-grid a',
    '.mobile-flow article',
    '.legal-toc'
  ].join(',');

  const mediaSelector = [
    '.hero-stage',
    '.hero-showreel',
    '.service-visual',
    '.media-figure',
    '.project-feature__media',
    '.before-after-wrap',
    '.device-stage',
    '.responsive-showcase',
    '.architecture-stage',
    '.diagnostic-stage',
    '.solution-orbit',
    '.decision-map',
    '.principle-stage',
    '.ecosystem-map',
    '.ecosystem-flow',
    '.presence-system',
    '.presence-journey',
    '.funnel-visual',
    '.process-timeline',
    '.experience-device',
    '.experience-map',
    '.orientation-lab',
    '.thumb-map'
  ].join(',');

  const revealGroupSelector = [
    '.grid',
    '.stack',
    '.faq-list',
    '.portfolio-grid',
    '.funnel-visual',
    '.process-timeline',
    '.project-feature',
    '.icon-list',
    '.related-grid',
    '.contact-channels',
    '.capability-grid',
    '.commercial-grid',
    '.experience-detail-grid',
    '.experience-next-grid',
    '.mobile-flow',
    '.legal-content'
  ].join(',');

  const copyChildSelector = [
    '.breadcrumbs',
    '.eyebrow',
    'h1',
    'h2',
    'h3',
    '.lead',
    ':scope > p',
    '.hero__actions',
    '.hero__proof',
    ':scope > .cluster',
    ':scope > .icon-list',
    ':scope > ul:not(.breadcrumbs)'
  ].join(',');

  const getOutermost = (elements) => elements.filter((element) => (
    !elements.some((candidate) => candidate !== element && candidate.contains(element))
  ));

  const prepareMotionModel = () => {
    const copyElements = [...document.querySelectorAll(copySelector)];
    const cardElements = [...document.querySelectorAll(cardSelector)];
    const mediaElements = getOutermost([...document.querySelectorAll(mediaSelector)]);

    /*
     * Documentos longos e blocos estruturais sem marcação manual também entram
     * no sistema. Primeiro registramos as seções internas; depois só marcamos
     * contêineres diretos que ainda não possuem revelações descendentes.
     */
    document.querySelectorAll('main .legal-section').forEach((element) => {
      if (!element.closest('[data-reveal]')) element.setAttribute('data-reveal', '');
    });

    [...copyElements, ...cardElements, ...mediaElements].forEach((element) => {
      if (!element.hasAttribute('data-reveal') && !element.closest('[data-reveal]')) {
        element.setAttribute('data-reveal', '');
      }
    });

    document.querySelectorAll('main > section > .container > *').forEach((element) => {
      if (
        !element.hasAttribute('data-reveal')
        && !element.closest('[data-reveal]')
        && !element.querySelector('[data-reveal]')
      ) {
        element.setAttribute('data-reveal', '');
      }
    });

    document.querySelectorAll('[data-reveal]').forEach((element) => {
      if (!element.dataset.motion) {
        if (element.matches(copySelector)) element.dataset.motion = 'copy';
        else if (element.matches(cardSelector)) element.dataset.motion = 'card';
        else if (element.matches(mediaSelector) || element.querySelector(':scope > img, :scope > video')) {
          element.dataset.motion = 'media';
        } else {
          element.dataset.motion = 'rise';
        }
      }

      if (element.dataset.motion === 'copy') {
        const children = [...element.querySelectorAll(copyChildSelector)]
          .filter((child) => child.parentElement === element);
        children.forEach((child, index) => {
          child.dataset.motionChild = '';
          child.style.setProperty('--motion-child-index', String(index));
          child.style.setProperty('--motion-child-delay', `${index * 58}ms`);
        });
      }
    });

    const revealElements = [...document.querySelectorAll('[data-reveal]')];
    const processedGroups = new Set();

    revealElements.forEach((element) => {
      const group = element.closest(revealGroupSelector);
      if (!group || processedGroups.has(group)) return;
      processedGroups.add(group);
      const siblings = revealElements.filter((candidate) => (
        candidate.closest(revealGroupSelector) === group
      ));
      siblings.forEach((candidate, index) => {
        candidate.style.setProperty('--motion-delay', `${Math.min(index * 58, 290)}ms`);
      });
    });

    revealElements.forEach((element) => {
      if (!element.style.getPropertyValue('--motion-delay')) {
        element.style.setProperty('--motion-delay', '0ms');
      }
    });

    const depthElements = getOutermost([...document.querySelectorAll(mediaSelector)]);
    depthElements.forEach((element, index) => {
      element.dataset.motionDepth = String((index % 3) + 1);
    });

    document.querySelectorAll(cardSelector).forEach((element) => {
      element.dataset.motionCard = '';
    });

    document.querySelectorAll('.hero, main .section').forEach((section) => {
      section.dataset.motionSection = '';
    });

    /*
     * A classe só é aplicada depois que todo o modelo de movimento existe.
     * Isso evita esconder conteúdo quando o JavaScript não carrega e garante
     * que o navegador consiga pintar um estado inicial antes da entrada.
     */
    document.documentElement.classList.add('motion-ready');
  };

  const initRevealAnimations = () => {
    const elements = [...document.querySelectorAll('[data-reveal]')];
    if (!elements.length) return;

    if (motionQuery.matches || !('IntersectionObserver' in window)) {
      elements.forEach((element) => element.classList.add('is-visible'));
      return;
    }

    const pending = new Set(elements);
    let fallbackFrame = 0;

    const reveal = (element) => {
      if (!pending.has(element)) return;
      pending.delete(element);
      element.dataset.motionState = 'visible';
      element.classList.add('is-visible');
      observer.unobserve(element);
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        reveal(entry.target);
      });
    }, {
      threshold: 0.025,
      rootMargin: '0px 0px -12% 0px'
    });

    const revealVisible = () => {
      fallbackFrame = 0;
      const viewportHeight = window.innerHeight || document.documentElement.clientHeight;

      pending.forEach((element) => {
        const rect = element.getBoundingClientRect();

        /*
         * Elementos acima do ponto restaurado pelo navegador não devem ficar
         * invisíveis. Os demais entram quando cruzam 86% da janela.
         */
        if (rect.bottom <= 0 || (rect.top <= viewportHeight * 0.86 && rect.bottom >= viewportHeight * 0.06)) {
          reveal(element);
        }
      });
    };

    const scheduleFallback = () => {
      if (fallbackFrame || !pending.size) return;
      fallbackFrame = window.requestAnimationFrame(revealVisible);
    };

    const start = () => {
      elements.forEach((element) => {
        element.dataset.motionState = 'queued';
        observer.observe(element);
      });
      revealVisible();
      window.addEventListener('scroll', scheduleFallback, { passive: true });
      window.addEventListener('resize', scheduleFallback, { passive: true });
      window.addEventListener('pageshow', scheduleFallback);
    };

    /*
     * Dois quadros garantem que opacity/transform iniciais sejam pintados.
     * Sem essa separação, páginas muito rápidas podiam receber is-visible no
     * mesmo frame e aparentar não possuir animação.
     */
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(start);
    });

    const handleMotionPreference = () => {
      if (!motionQuery.matches) return;
      pending.forEach(reveal);
    };
    motionQuery.addEventListener?.('change', handleMotionPreference);
  };

  const initScrollMotion = () => {
    const sections = [...document.querySelectorAll('[data-motion-section]')];
    if (!sections.length) return;

    let frameRequested = false;
    let active = false;

    const clearMotion = () => {
      sections.forEach((section) => {
        section.classList.remove('is-motion-active');
        section.style.removeProperty('--section-progress');
        section.style.removeProperty('--section-focus');
        section.style.removeProperty('--section-travel');
        section.querySelectorAll('[data-motion-depth]').forEach((element) => {
          element.style.removeProperty('--motion-depth-y');
          element.style.removeProperty('--motion-depth-scale');
        });
      });
    };

    const update = () => {
      frameRequested = false;
      if (motionQuery.matches || !desktopQuery.matches) {
        if (active) clearMotion();
        active = false;
        return;
      }

      active = true;
      const viewportHeight = window.innerHeight;

      sections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        const progress = clamp((viewportHeight - rect.top) / (viewportHeight + rect.height));
        const focus = clamp(1 - Math.abs(progress - 0.5) * 2);
        const travel = (progress - 0.5) * 2;
        const nearViewport = rect.bottom > -viewportHeight * 0.15 && rect.top < viewportHeight * 1.15;

        section.classList.toggle('is-motion-active', nearViewport);
        section.style.setProperty('--section-progress', progress.toFixed(4));
        section.style.setProperty('--section-focus', focus.toFixed(4));
        section.style.setProperty('--section-travel', travel.toFixed(4));

        section.querySelectorAll('[data-motion-depth]').forEach((element) => {
          const strength = Number(element.dataset.motionDepth) || 1;
          const y = travel * (-5 - strength * 2.5);
          const scale = 1 + focus * (0.0025 + strength * 0.0015);
          element.style.setProperty('--motion-depth-y', `${y.toFixed(2)}px`);
          element.style.setProperty('--motion-depth-scale', scale.toFixed(4));
        });
      });
    };

    const schedule = () => {
      if (frameRequested) return;
      frameRequested = true;
      window.requestAnimationFrame(update);
    };

    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule, { passive: true });
    motionQuery.addEventListener?.('change', schedule);
    desktopQuery.addEventListener?.('change', schedule);
    update();
  };

  const initPointerLight = () => {
    if (motionQuery.matches || !finePointerQuery.matches) return;

    document.querySelectorAll('[data-motion-card]').forEach((card) => {
      let pointerFrame = 0;
      let pendingX = 50;
      let pendingY = 50;

      const render = () => {
        pointerFrame = 0;
        card.style.setProperty('--spot-x', `${pendingX.toFixed(2)}%`);
        card.style.setProperty('--spot-y', `${pendingY.toFixed(2)}%`);
      };

      card.addEventListener('pointerenter', () => card.classList.add('is-spotlit'));
      card.addEventListener('pointermove', (event) => {
        const rect = card.getBoundingClientRect();
        pendingX = clamp((event.clientX - rect.left) / rect.width) * 100;
        pendingY = clamp((event.clientY - rect.top) / rect.height) * 100;
        if (!pointerFrame) pointerFrame = window.requestAnimationFrame(render);
      });
      card.addEventListener('pointerleave', () => {
        card.classList.remove('is-spotlit');
        card.style.removeProperty('--spot-x');
        card.style.removeProperty('--spot-y');
      });
    });
  };

  const initMagneticActions = () => {
    if (motionQuery.matches || !finePointerQuery.matches) return;

    document.querySelectorAll('.btn--primary, .header-cta').forEach((button) => {
      button.dataset.magnetic = '';
      button.addEventListener('pointermove', (event) => {
        const rect = button.getBoundingClientRect();
        const x = ((event.clientX - rect.left) / rect.width - 0.5) * 10;
        const y = ((event.clientY - rect.top) / rect.height - 0.5) * 8;
        button.style.setProperty('--magnetic-x', `${x.toFixed(2)}px`);
        button.style.setProperty('--magnetic-y', `${y.toFixed(2)}px`);
      });
      button.addEventListener('pointerleave', () => {
        button.style.setProperty('--magnetic-x', '0px');
        button.style.setProperty('--magnetic-y', '0px');
      });
    });
  };

  const initHeroExperience = () => {
    if (motionQuery.matches || !finePointerQuery.matches) return;

    document.querySelectorAll('[data-hero-stage]').forEach((stage) => {
      stage.addEventListener('pointermove', (event) => {
        const rect = stage.getBoundingClientRect();
        const x = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
        const y = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
        stage.style.setProperty('--pointer-x', x.toFixed(3));
        stage.style.setProperty('--pointer-y', y.toFixed(3));
        stage.style.setProperty('--hero-rotate-x', `${(-y * 2).toFixed(3)}deg`);
        stage.style.setProperty('--hero-rotate-y', `${(x * 3).toFixed(3)}deg`);
        stage.style.setProperty('--hero-logo-x', `${(x * 7).toFixed(2)}px`);
        stage.style.setProperty('--hero-logo-y', `${(y * 7).toFixed(2)}px`);
      });
      stage.addEventListener('pointerleave', () => {
        stage.style.setProperty('--pointer-x', '0');
        stage.style.setProperty('--pointer-y', '0');
        stage.style.setProperty('--hero-rotate-x', '0deg');
        stage.style.setProperty('--hero-rotate-y', '0deg');
        stage.style.setProperty('--hero-logo-x', '0px');
        stage.style.setProperty('--hero-logo-y', '0px');
      });
    });
  };

  const initProgressLine = () => {
    const line = document.querySelector('[data-scroll-progress]');
    if (!line) return;

    let frameRequested = false;
    const update = () => {
      frameRequested = false;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      line.style.transform = `scaleX(${max > 0 ? clamp(window.scrollY / max) : 0})`;
    };
    const schedule = () => {
      if (frameRequested) return;
      frameRequested = true;
      window.requestAnimationFrame(update);
    };

    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule, { passive: true });
    update();
  };

  const initResponsiveVideos = () => {
    const videos = [...document.querySelectorAll('[data-responsive-video]')];
    if (!videos.length) return;

    const mobileQuery = window.matchMedia('(max-width: 700px)');
    videos.forEach((video) => {
      let profile = '';
      const initialRect = video.getBoundingClientRect();
      let inViewport = initialRect.bottom > 0 && initialRect.top < window.innerHeight;

      video.muted = true;
      video.defaultMuted = true;
      video.controls = false;
      video.loop = true;
      video.playsInline = true;
      video.disablePictureInPicture = true;
      video.setAttribute('muted', '');
      video.setAttribute('playsinline', '');
      video.setAttribute('disablepictureinpicture', '');
      video.setAttribute('disableremoteplayback', '');
      video.setAttribute('controlslist', 'nodownload nofullscreen noremoteplayback');
      video.tabIndex = -1;

      /*
       * O vídeo é uma demonstração funcional, silenciosa e sem controles.
       * "Movimento reduzido" continua desativando parallax e entradas
       * decorativas, mas não troca esta prova real por uma imagem estática.
       * Os arquivos são locais, comprimidos e existem em versões próprias para
       * desktop e mobile; portanto a reprodução não é condicionada a APIs
       * opcionais do navegador, como Network Information/saveData.
       */
      const mayAutoplay = () => true;

      const playVideo = async () => {
        if (!mayAutoplay() || !inViewport || document.hidden) return;
        try {
          await video.play();
          video.dataset.playing = 'true';
        } catch (_) {
          // O pôster permanece visível quando o navegador recusa a reprodução.
          delete video.dataset.playing;
        }
      };

      const setProfile = () => {
        const nextProfile = mobileQuery.matches ? 'mobile' : 'desktop';
        if (nextProfile === profile) return;
        profile = nextProfile;
        video.pause();
        video.replaceChildren();
        video.poster = video.dataset[`${profile}Poster`];
        video.autoplay = mayAutoplay();
        video.preload = mayAutoplay() ? 'auto' : 'none';

        [
          [video.dataset[`${profile}Webm`], 'video/webm'],
          [video.dataset[`${profile}Mp4`], 'video/mp4']
        ].forEach(([src, type]) => {
          if (!src) return;
          const source = document.createElement('source');
          source.src = src;
          source.type = type;
          video.append(source);
        });
        video.load();
        if (video.readyState >= 2) playVideo();
        else {
          video.addEventListener('loadeddata', playVideo, { once: true });
          video.addEventListener('canplay', playVideo, { once: true });
        }
      };

      if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver(([entry]) => {
          inViewport = entry.isIntersecting;
          if (inViewport) playVideo();
          else {
            video.pause();
            delete video.dataset.playing;
          }
        }, { threshold: 0.2 });
        observer.observe(video);
      } else {
        inViewport = true;
      }

      const handleProfileChange = () => setProfile();
      const handleMotionChange = () => {
        video.autoplay = mayAutoplay();
        playVideo();
      };
      if (mobileQuery.addEventListener) mobileQuery.addEventListener('change', handleProfileChange);
      else mobileQuery.addListener?.(handleProfileChange);
      if (motionQuery.addEventListener) motionQuery.addEventListener('change', handleMotionChange);
      else motionQuery.addListener?.(handleMotionChange);

      document.addEventListener('visibilitychange', () => {
        if (document.hidden) video.pause();
        else playVideo();
      });
      window.addEventListener('pageshow', playVideo);
      /*
       * Alguns navegadores restauram a página sem repetir a política de
       * autoplay. A primeira interação serve apenas como uma tentativa
       * silenciosa de recuperação; nenhum controle visual é criado.
       */
      ['pointerdown', 'touchstart', 'keydown'].forEach((eventName) => {
        document.addEventListener(eventName, playVideo, { once: true, passive: true });
      });

      setProfile();
    });
  };

  prepareMotionModel();
  initRevealAnimations();
  initScrollMotion();
  initPointerLight();
  initMagneticActions();
  initHeroExperience();
  initProgressLine();
  initResponsiveVideos();
})();
