(() => {
  'use strict';

  const showToast = (message, type = 'info') => {
    let region = document.querySelector('[data-toast-region]');
    if (!region) {
      region = document.createElement('div');
      region.className = 'toast-region';
      region.dataset.toastRegion = '';
      region.setAttribute('aria-live', 'polite');
      document.body.appendChild(region);
    }
    const toast = document.createElement('div');
    toast.className = `toast toast--${type}`;
    toast.textContent = message;
    region.appendChild(toast);
    requestAnimationFrame(() => toast.classList.add('is-visible'));
    window.setTimeout(() => {
      toast.classList.remove('is-visible');
      window.setTimeout(() => toast.remove(), 220);
    }, 4200);
  };

  const normalizePhone = (value) => value.replace(/\D/g, '').slice(0, 13);

  const validateField = (field) => {
    const wrapper = field.closest('.field');
    let message = '';
    if (field.required && !field.value.trim()) message = 'Preencha este campo.';
    if (!message && field.type === 'email' && field.value && !field.validity.valid) message = 'Informe um e-mail válido.';
    if (!message && field.name === 'whatsapp' && normalizePhone(field.value).length < 10) message = 'Informe um WhatsApp com DDD.';
    if (!message && field.type === 'checkbox' && field.required && !field.checked) message = 'Confirme esta opção para continuar.';
    field.setAttribute('aria-invalid', String(Boolean(message)));
    const error = wrapper?.querySelector('.field-error');
    if (error) error.textContent = message;
    return !message;
  };

  const buildMessage = (form) => {
    const data = new FormData(form);
    const entries = [...data.entries()].filter(([, value]) => String(value).trim() && value !== 'on');
    const labels = {
      name: 'Nome', company: 'Empresa', whatsapp: 'WhatsApp', email: 'E-mail', segment: 'Segmento',
      situation: 'Situação atual', objective: 'Objetivo', projectType: 'Tipo de projeto', deadline: 'Prazo aproximado',
      investment: 'Faixa de investimento', message: 'Mensagem'
    };
    const intro = form.dataset.messageIntro || 'Olá! Conheci a Carthage pelo site e gostaria de conversar sobre um projeto.';
    const details = entries.map(([key, value]) => `${labels[key] || key}: ${String(value).trim()}`).join('\n');
    return details ? `${intro}\n\n${details}` : intro;
  };

  const initForms = () => {
    document.querySelectorAll('[data-whatsapp-form]').forEach((form) => {
      let started = false;
      form.addEventListener('input', (event) => {
        if (!started) {
          started = true;
          window.CARTHAGE_TRACKING?.trackEvent('FormStart', { form: form.id || 'diagnostic' });
        }
        validateField(event.target);
      });
      form.addEventListener('change', (event) => validateField(event.target));
      form.addEventListener('submit', (event) => {
        event.preventDefault();
        const fields = [...form.querySelectorAll('input, select, textarea')].filter(field => !field.disabled);
        const valid = fields.map(validateField).every(Boolean);
        const status = form.querySelector('[data-form-status]');
        if (!valid) {
          status.textContent = 'Revise os campos destacados.';
          fields.find(field => field.getAttribute('aria-invalid') === 'true')?.focus();
          return;
        }
        status.textContent = 'Abrindo o WhatsApp com o diagnóstico preenchido.';
        window.CARTHAGE_TRACKING?.trackEvent('FormSubmit', { form: form.id || 'diagnostic' });
        window.CARTHAGE_TRACKING?.trackEvent('Lead', { source: 'whatsapp-form', form: form.id || 'diagnostic' });
        window.CARTHAGE_TRACKING?.openWhatsApp(buildMessage(form), form.dataset.context || 'formulario');
      });
    });
  };

  window.CARTHAGE_UI = Object.freeze({ showToast });
  initForms();
})();
