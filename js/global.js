(() => {
  'use strict';

  document.documentElement.classList.add('js');
  document.querySelectorAll('[data-current-year]').forEach(node => node.textContent = String(new Date().getFullYear()));

  const email = window.SITE_CONFIG?.email;
  const phone = window.SITE_CONFIG?.phoneDisplay;
  const instagram = window.SITE_CONFIG?.instagramHandle;
  const facebookUrl = window.SITE_CONFIG?.facebookUrl;
  document.querySelectorAll('[data-site-email]').forEach(node => { node.textContent = email; if (node.tagName === 'A') node.href = `mailto:${email}`; });
  document.querySelectorAll('[data-site-phone]').forEach(node => node.textContent = phone);
  document.querySelectorAll('[data-site-instagram]').forEach(node => node.textContent = instagram);

  document.querySelectorAll('.footer-column').forEach((column) => {
    const heading = column.querySelector('h2');
    if (heading?.textContent.trim().toLowerCase() !== 'carthage') return;
    const nav = column.querySelector('nav');
    if (!nav) return;

    const contact = [...nav.querySelectorAll('a')].find((link) => link.getAttribute('href') === 'contato.html');
    if (contact) {
      contact.href = `https://wa.me/${window.SITE_CONFIG?.whatsappNumber || '5562999810066'}`;
      contact.target = '_blank';
      contact.rel = 'noopener';
      contact.textContent = 'Contato pelo WhatsApp';
    }

    if (facebookUrl && !nav.querySelector('a[data-footer-facebook]')) {
      const facebook = document.createElement('a');
      facebook.href = facebookUrl;
      facebook.target = '_blank';
      facebook.rel = 'noopener';
      facebook.dataset.footerFacebook = '';
      facebook.textContent = 'Facebook';
      nav.appendChild(facebook);
    }
  });

  document.querySelectorAll('details[data-exclusive]').forEach((details) => {
    details.addEventListener('toggle', () => {
      if (!details.open) return;
      document.querySelectorAll('details[data-exclusive]').forEach(other => {
        if (other !== details) other.open = false;
      });
    });
  });

  /*
   * Proteção editorial seletiva.
   *
   * Impede o arraste nativo de arquivos e a seleção acidental de títulos,
   * menus e controles, sem interferir na seleção dos textos explicativos,
   * no preenchimento dos formulários ou nos controles por ponteiro/teclado.
   */
  const mediaSelector = 'img, picture, video, canvas, svg, [data-protected-media]';
  const protectedSelectionSelector = [
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    '.eyebrow',
    '.brand',
    '.breadcrumbs',
    'nav',
    '.mega-panel',
    '.btn',
    'button',
    'summary',
    'label',
    'legend',
    '[role="button"]',
    '[role="tab"]',
    '[role="menuitem"]',
    '[data-copy-protected]'
  ].join(', ');
  const editableSelector = [
    'input',
    'textarea',
    'select',
    'option',
    '[contenteditable="true"]',
    '[data-copy-allowed]'
  ].join(', ');

  const eventElement = (target) => {
    if (target instanceof Element) return target;
    return target?.parentElement instanceof Element ? target.parentElement : null;
  };

  document.querySelectorAll(mediaSelector).forEach((media) => {
    media.setAttribute('draggable', 'false');
    if ('draggable' in media) media.draggable = false;
    media.dataset.protectedMedia = '';

    const mediaLink = media.closest('a');
    if (mediaLink) {
      mediaLink.setAttribute('draggable', 'false');
      if ('draggable' in mediaLink) mediaLink.draggable = false;
    }
  });

  document.querySelectorAll(protectedSelectionSelector).forEach((element) => {
    element.dataset.copyProtected = '';
  });

  document.addEventListener('dragstart', (event) => {
    event.preventDefault();
  }, { capture: true });

  document.addEventListener('contextmenu', (event) => {
    const element = eventElement(event.target);
    if (element?.closest(`${mediaSelector}, .brand`)) event.preventDefault();
  }, { capture: true });

  document.addEventListener('selectstart', (event) => {
    const element = eventElement(event.target);
    if (!element || element.closest(editableSelector)) return;
    if (element.closest(protectedSelectionSelector)) event.preventDefault();
  }, { capture: true });

  window.addEventListener('load', () => document.body.classList.add('is-loaded'), { once: true });
})();
