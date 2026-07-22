(() => {
  'use strict';

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const initRevealAnimations = () => {
    const elements = [...document.querySelectorAll('[data-reveal]')];
    if (!elements.length) return;
    if (reducedMotion || !('IntersectionObserver' in window)) {
      elements.forEach(element => element.classList.add('is-visible'));
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    elements.forEach((element, index) => {
      element.style.setProperty('--reveal-delay', `${Math.min((index % 6) * 60, 300)}ms`);
      observer.observe(element);
    });
  };

  const initHeroExperience = () => {
    if (reducedMotion || !window.matchMedia('(pointer:fine)').matches) return;
    const stages = document.querySelectorAll('[data-hero-stage]');
    stages.forEach((stage) => {
      stage.addEventListener('pointermove', (event) => {
        const rect = stage.getBoundingClientRect();
        const x = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
        const y = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
        stage.style.setProperty('--pointer-x', x.toFixed(3));
        stage.style.setProperty('--pointer-y', y.toFixed(3));
      });
      stage.addEventListener('pointerleave', () => {
        stage.style.setProperty('--pointer-x', '0');
        stage.style.setProperty('--pointer-y', '0');
      });
    });
  };

  const initProgressLine = () => {
    const line = document.querySelector('[data-scroll-progress]');
    if (!line) return;
    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      line.style.transform = `scaleX(${max > 0 ? window.scrollY / max : 0})`;
    };
    window.addEventListener('scroll', update, { passive: true });
    update();
  };

  initRevealAnimations();
  initHeroExperience();
  initProgressLine();
})();
