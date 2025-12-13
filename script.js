// script.js (updated to redirect to your portfolio after demo save)
// Safe behavior:
// - Does NOT POST to your portfolio URL (that would 405).
// - Uses demo saving (only name & email) and then redirects to the provided portfolio URL.
// - If you later provide a real API endpoint, set CONFIG.apiEndpoint to that URL.

(function () {
  'use strict';

  if (window.__registerScriptInitialized) return;
  window.__registerScriptInitialized = true;

  const CONFIG = {
    apiEndpoint: '', // leave empty for demo/local behavior
    demoSaveToLocalStorage: true,
    demoStorageKey: 'demo_users',
    // Redirect target after successful demo/save. (You provided this public page.)
    redirectOnSuccess: 'https://rjjohnvillanueva-netizen.github.io/login_portfolio/'
  };

  document.addEventListener('DOMContentLoaded', function () {
    try {
      const form = document.getElementById('registerForm');
      if (!form) return;

      const passwordInput = document.getElementById('password');
      const confirmInput = document.getElementById('confirm-password');
      let errBox = document.getElementById('password-error');

      if (!errBox) {
        const submitBtn = form.querySelector('button[type="submit"]') || form.lastElementChild;
        errBox = document.createElement('div');
        errBox.id = 'password-error';
        errBox.setAttribute('role', 'alert');
        errBox.setAttribute('aria-live', 'polite');
        errBox.className = 'text-sm text-red-300 hidden';
        if (submitBtn && submitBtn.parentNode) {
          submitBtn.parentNode.insertBefore(errBox, submitBtn);
        } else {
          form.appendChild(errBox);
        }
      }

      function showError(msg) {
        errBox.textContent = msg;
        errBox.classList.remove('hidden');
      }
      function hideError() {
        errBox.textContent = '';
        errBox.classList.add('hidden');
      }

      // Toggle wiring (safe, idempotent)
      const toggleButtons = Array.from(document.querySelectorAll('.toggle-password'));
      toggleButtons.forEach(btn => {
        if (btn.dataset.pwToggleInit === '1') return;
        btn.dataset.pwToggleInit = '1';
        const targetSelector = btn.getAttribute('data-target');
        const input = targetSelector ? document.querySelector(targetSelector) : btn.previousElementSibling;
        if (!input || input.tagName !== 'INPUT') return;

        function updateIcon(isShown) {
          btn.setAttribute('aria-pressed', String(!!isShown));
          const icon = btn.querySelector('i');
          if (icon && icon.classList) {
            icon.classList.toggle('fa-eye', !isShown);
            icon.classList.toggle('fa-eye-slash', isShown);
          } else {
            btn.textContent = isShown ? 'Hide' : 'Show';
          }
        }
        updateIcon(false);
        btn.addEventListener('click', function (ev) {
          ev.preventDefault();
          try {
            const currentlyPassword = input.getAttribute('type') === 'password';
            input.setAttribute('type', currentlyPassword ? 'text' : 'password');
            updateIcon(currentlyPassword);
            input.focus();
          } catch (_) {}
        });
      });

      function isPostingToSelf(formEl) {
        const method = (formEl.getAttribute('method') || 'get').toLowerCase();
        const action = (formEl.getAttribute('action') || '').trim();
        if (method !== 'post') return false;
        if (!action || action === '#') return true;
        try {
          const actionUrl = new URL(action, window.location.href);
          const currentUrl = new URL(window.location.href);
          return actionUrl.origin === currentUrl.origin && actionUrl.pathname === currentUrl.pathname;
        } catch (_) {
          return true;
        }
      }

      async function demoHandleSubmit(formData) {
        if (!CONFIG.demoSaveToLocalStorage) return { ok: true, message: 'Demo ignored.' };
        const name = formData.get('name') || '';
        const email = formData.get('email') || '';
        const key = CONFIG.demoStorageKey;
        const existing = JSON.parse(localStorage.getItem(key) || '[]');
        existing.push({ name, email, createdAt: new Date().toISOString() });
        localStorage.setItem(key, JSON.stringify(existing));
        return { ok: true, message: 'Saved to local demo storage.' };
      }

      form.addEventListener('submit', async function (ev) {
        hideError();

        if (passwordInput && confirmInput) {
          if (passwordInput.value !== confirmInput.value) {
            ev.preventDefault();
            showError('Passwords do not match. Please check and try again.');
            try { confirmInput.focus(); } catch (_) {}
            return false;
          }
          const minLen = parseInt(passwordInput.getAttribute('minlength') || '0', 10);
          if (minLen > 0 && passwordInput.value.length < minLen) {
            ev.preventDefault();
            showError(`Password must be at least ${minLen} characters.`);
            try { passwordInput.focus(); } catch (_) {}
            return false;
          }
        }

        // If this would POST to the same page, prevent and handle via JS (avoids 405)
        if (isPostingToSelf(form)) {
          ev.preventDefault();
          const formData = new FormData(form);

          if (CONFIG.apiEndpoint) {
            // If you later set apiEndpoint, this will POST there.
            try {
              const resp = await fetch(CONFIG.apiEndpoint, {
                method: 'POST',
                body: formData,
                // If your API expects JSON, update this section to send JSON instead.
              });
              if (!resp.ok) {
                const text = await resp.text().catch(()=>null);
                showError('Submission failed: ' + (text || resp.statusText));
                return false;
              }
              // Successful server response -> redirect if configured
              if (CONFIG.redirectOnSuccess) window.location.href = CONFIG.redirectOnSuccess;
              else form.reset();
              return true;
            } catch (err) {
              showError('Network error when sending data.');
              return false;
            }
          } else {
            // Demo local save (safe): only saves name & email, never passwords.
            const result = await demoHandleSubmit(formData);
            if (result.ok) {
              // redirect to your portfolio URL (demo flow)
              if (CONFIG.redirectOnSuccess) {
                window.location.href = CONFIG.redirectOnSuccess;
                return true;
              } else {
                alert('Demo registration saved locally.');
                form.reset();
                return true;
              }
            } else {
              showError(result.message || 'Demo save failed');
              return false;
            }
          }
        }

        // Not posting to self: allow default submit (e.g., if action is a real endpoint)
        return true;
      });

      [passwordInput, confirmInput].forEach(el => {
        if (!el) return;
        el.addEventListener('input', function () {
          if (!errBox.classList.contains('hidden') && passwordInput && confirmInput && passwordInput.value === confirmInput.value) {
            hideError();
          }
        });
      });

    } catch (e) {
      // Fail silently so other page scripts aren't affected.
    }
  });
})();
      // Fail silently so we do not break other scripts
      // console.warn('register script error', e);
    }
  });
})();
