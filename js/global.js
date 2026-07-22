(() => {
  'use strict';

  document.documentElement.classList.add('js');
  document.querySelectorAll('[data-current-year]').forEach(node => node.textContent = String(new Date().getFullYear()));

  const email = window.SITE_CONFIG?.email;
  const phone = window.SITE_CONFIG?.phoneDisplay;
  const instagram = window.SITE_CONFIG?.instagramHandle;
  document.querySelectorAll('[data-site-email]').forEach(node => { node.textContent = email; if (node.tagName === 'A') node.href = `mailto:${email}`; });
  document.querySelectorAll('[data-site-phone]').forEach(node => node.textContent = phone);
  document.querySelectorAll('[data-site-instagram]').forEach(node => node.textContent = instagram);

  document.querySelectorAll('details[data-exclusive]').forEach((details) => {
    details.addEventListener('toggle', () => {
      if (!details.open) return;
      document.querySelectorAll('details[data-exclusive]').forEach(other => {
        if (other !== details) other.open = false;
      });
    });
  });

  window.addEventListener('load', () => document.body.classList.add('is-loaded'), { once: true });
})();
