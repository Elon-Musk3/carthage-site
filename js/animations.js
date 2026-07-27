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
    '.compatibility-card'
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
    '.legal-icon-cluster a'
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
    '.funnel-visual',
    '.process-timeline'
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
    '.contact-channels'
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

    [...copyElements, ...cardElements, ...mediaElements].forEach((element) => {
      if (!element.hasAttribute('data-reveal') && !element.closest('[data-reveal]')) {
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
  };

  const initRevealAnimations = () => {
    const elements = [...document.querySelectorAll('[data-reveal]')];
    if (!elements.length) return;

    if (motionQuery.matches || !('IntersectionObserver' in window)) {
      elements.forEach((element) => element.classList.add('is-visible'));
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -7% 0px'
    });

    elements.forEach((element) => {
      const rect = element.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.94 && rect.bottom > 0) {
        element.classList.add('is-visible');
      } else {
        observer.observe(element);
      }
    });
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
    const saveData = Boolean(navigator.connection?.saveData);

    videos.forEach((video) => {
      let profile = '';
      let inViewport = false;

      video.muted = true;
      video.defaultMuted = true;
      video.controls = false;

      const mayAutoplay = () => !motionQuery.matches && !saveData;

      const playVideo = async () => {
        if (!mayAutoplay() || !inViewport || document.hidden) return;
        try {
          await video.play();
        } catch (_) {
          // O pôster permanece visível quando o navegador recusa a reprodução.
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
        video.preload = mayAutoplay() ? 'metadata' : 'none';

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
        playVideo();
      };

      if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver(([entry]) => {
          inViewport = entry.isIntersecting;
          if (inViewport) playVideo();
          else video.pause();
        }, { threshold: 0.2 });
        observer.observe(video);
      } else {
        inViewport = true;
      }

      const handleProfileChange = () => setProfile();
      const handleMotionChange = () => {
        video.autoplay = mayAutoplay();
        if (motionQuery.matches) video.pause();
        else playVideo();
      };
      if (mobileQuery.addEventListener) mobileQuery.addEventListener('change', handleProfileChange);
      else mobileQuery.addListener?.(handleProfileChange);
      if (motionQuery.addEventListener) motionQuery.addEventListener('change', handleMotionChange);
      else motionQuery.addListener?.(handleMotionChange);

      document.addEventListener('visibilitychange', () => {
        if (document.hidden) video.pause();
        else playVideo();
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
