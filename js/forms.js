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
    const enhancedSelect = field.closest('.enhanced-select');
    enhancedSelect?.classList.toggle('has-error', Boolean(message));
    enhancedSelect?.querySelector('.enhanced-select__trigger')?.setAttribute('aria-invalid', String(Boolean(message)));
    const error = wrapper?.querySelector('.field-error');
    if (error) error.textContent = message;
    return !message;
  };

  const closeEnhancedSelect = (shell, restoreFocus = false) => {
    if (!shell) return;
    window.clearTimeout(shell._ctgSelectCloseTimer);
    shell.classList.remove('is-open');
    shell.classList.add('is-closing');
    const trigger = shell.querySelector('.enhanced-select__trigger');
    const list = shell.querySelector('.enhanced-select__list');
    trigger?.setAttribute('aria-expanded', 'false');
    shell._ctgSelectCloseTimer = window.setTimeout(() => {
      if (list && !shell.classList.contains('is-open')) list.hidden = true;
      shell.classList.remove('is-closing');
    }, 135);
    if (restoreFocus) trigger?.focus();
  };

  const initEnhancedSelects = () => {
    const shells = [];
    const closeTimers = new WeakMap();
    const hoverCapable = window.matchMedia('(hover: hover) and (pointer: fine)');

    const clearCloseTimer = (shell) => {
      const timer = closeTimers.get(shell);
      if (timer) window.clearTimeout(timer);
      closeTimers.delete(shell);
    };

    const closeAll = (except = null) => {
      shells.forEach((shell) => {
        clearCloseTimer(shell);
        if (shell !== except) closeEnhancedSelect(shell);
      });
    };

    const scheduleClose = (shell, delay = 170) => {
      clearCloseTimer(shell);
      closeTimers.set(shell, window.setTimeout(() => {
        closeEnhancedSelect(shell);
        closeTimers.delete(shell);
      }, delay));
    };

    document.querySelectorAll('.form-card select').forEach((select, selectIndex) => {
      if (select.dataset.enhanced === 'true') return;
      select.dataset.enhanced = 'true';

      const shell = document.createElement('div');
      shell.className = 'enhanced-select';
      const listId = `${select.id || `select-${selectIndex}`}-options`;
      const label = select.id ? document.querySelector(`label[for="${CSS.escape(select.id)}"]`) : null;
      const labelId = `${select.id || `select-${selectIndex}`}-label`;
      if (label && !label.id) label.id = labelId;

      const trigger = document.createElement('button');
      trigger.className = 'enhanced-select__trigger';
      trigger.type = 'button';
      trigger.setAttribute('aria-expanded', 'false');
      trigger.setAttribute('aria-haspopup', 'listbox');
      trigger.setAttribute('aria-controls', listId);
      if (label) trigger.setAttribute('aria-labelledby', `${label.id} ${listId}-value`);

      const value = document.createElement('span');
      value.id = `${listId}-value`;
      value.className = 'enhanced-select__value';
      trigger.append(value);
      trigger.insertAdjacentHTML('beforeend', '<svg aria-hidden="true" viewBox="0 0 24 24"><path d="m7 9 5 5 5-5"></path></svg>');

      const list = document.createElement('div');
      list.className = 'enhanced-select__list';
      list.id = listId;
      list.setAttribute('role', 'listbox');
      list.hidden = true;

      const optionButtons = [...select.options].map((option, optionIndex) => {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'enhanced-select__option';
        button.setAttribute('role', 'option');
        button.dataset.value = option.value;
        button.dataset.optionIndex = String(optionIndex);
        button.textContent = option.textContent.trim();
        button.tabIndex = -1;
        list.append(button);
        return button;
      });

      const sync = () => {
        const selectedIndex = Math.max(0, select.selectedIndex);
        const selected = select.options[selectedIndex];
        value.textContent = selected?.textContent.trim() || 'Selecione';
        optionButtons.forEach((button, index) => {
          const active = index === selectedIndex;
          button.setAttribute('aria-selected', String(active));
          button.classList.toggle('is-selected', active);
        });
      };

      const open = (focusSelected = false) => {
        clearCloseTimer(shell);
        closeAll(shell);
        window.clearTimeout(shell._ctgSelectCloseTimer);
        shell.classList.remove('is-closing');
        shell.classList.add('is-open');
        list.hidden = false;
        trigger.setAttribute('aria-expanded', 'true');
        if (focusSelected) {
          optionButtons[Math.max(0, select.selectedIndex)]?.focus();
        }
      };

      const choose = (button) => {
        select.selectedIndex = Number(button.dataset.optionIndex);
        select.dispatchEvent(new Event('input', { bubbles: true }));
        select.dispatchEvent(new Event('change', { bubbles: true }));
        sync();
        closeEnhancedSelect(shell, true);
      };

      trigger.addEventListener('click', () => {
        if (shell.classList.contains('is-open')) closeEnhancedSelect(shell);
        else open(false);
      });
      shell.addEventListener('pointerenter', (event) => {
        if (!hoverCapable.matches || event.pointerType === 'touch') return;
        clearCloseTimer(shell);
        open(false);
      });
      shell.addEventListener('pointerleave', (event) => {
        if (!hoverCapable.matches || event.pointerType === 'touch') return;
        scheduleClose(shell);
      });
      shell.addEventListener('focusin', () => clearCloseTimer(shell));
      shell.addEventListener('focusout', (event) => {
        if (!shell.contains(event.relatedTarget)) scheduleClose(shell, 80);
      });
      trigger.addEventListener('keydown', (event) => {
        if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(event.key)) {
          event.preventDefault();
          open(true);
        }
        if (event.key === 'Escape') closeEnhancedSelect(shell);
      });

      optionButtons.forEach((button) => {
        button.addEventListener('click', () => choose(button));
        button.addEventListener('keydown', (event) => {
          const current = Number(button.dataset.optionIndex);
          let next = current;
          if (event.key === 'ArrowDown') next = Math.min(optionButtons.length - 1, current + 1);
          else if (event.key === 'ArrowUp') next = Math.max(0, current - 1);
          else if (event.key === 'Home') next = 0;
          else if (event.key === 'End') next = optionButtons.length - 1;
          else if (event.key === 'Escape') {
            event.preventDefault();
            closeEnhancedSelect(shell, true);
            return;
          } else if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            choose(button);
            return;
          } else {
            return;
          }
          event.preventDefault();
          optionButtons[next]?.focus();
        });
      });

      select.classList.add('enhanced-select__native');
      select.before(shell);
      shell.append(select, trigger, list);
      select.addEventListener('change', sync);
      sync();
      shells.push(shell);
    });

    document.addEventListener('pointerdown', (event) => {
      shells.forEach((shell) => {
        if (!shell.contains(event.target)) {
          clearCloseTimer(shell);
          closeEnhancedSelect(shell);
        }
      });
    });
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') closeAll();
    });
  };

  const initDeadlineFields = () => {
    document.querySelectorAll('[data-deadline-field]').forEach((root) => {
      const input = root.querySelector('[data-deadline-input]');
      const suggestions = [...root.querySelectorAll('[data-deadline-value]')];
      if (!input || !suggestions.length) return;

      const sync = () => {
        suggestions.forEach((button) => {
          button.setAttribute('aria-pressed', String(button.dataset.deadlineValue === input.value.trim()));
        });
      };

      suggestions.forEach((button) => {
        button.addEventListener('click', () => {
          input.value = button.dataset.deadlineValue;
          input.dispatchEvent(new Event('input', { bubbles: true }));
          input.focus();
          sync();
        });
      });
      input.addEventListener('input', sync);
      sync();
    });
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
          const firstInvalid = fields.find(field => field.getAttribute('aria-invalid') === 'true');
          if (firstInvalid?.matches('select.enhanced-select__native')) {
            firstInvalid.closest('.enhanced-select')?.querySelector('.enhanced-select__trigger')?.focus();
          } else {
            firstInvalid?.focus();
          }
          return;
        }
        status.textContent = 'Abrindo o WhatsApp com o diagnóstico preenchido.';
        window.CARTHAGE_TRACKING?.trackEvent('FormPrepared', { form: form.id || 'diagnostic' });
        window.CARTHAGE_TRACKING?.openWhatsApp(buildMessage(form), form.dataset.context || 'formulario');
      });
    });
  };

  window.CARTHAGE_UI = Object.freeze({ showToast });
  initEnhancedSelects();
  initDeadlineFields();
  initForms();
})();
