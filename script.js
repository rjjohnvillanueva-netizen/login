(function () {
  'use strict';

  // Guard to avoid double initialization
  if (window.__registerScriptInitialized) return;
  window.__registerScriptInitialized = true;

  document.addEventListener('DOMContentLoaded', function () {
    try {
      // Find the register form; if absent, do nothing (safe for other pages)
      const form = document.getElementById('registerForm');
      if (!form) return;

      // Elements we expect to work with
      const passwordInput = document.getElementById('password');
      const confirmInput = document.getElementById('confirm-password');

      // Ensure we have at least the two inputs. If not, still try to wire toggles if present.
      // Setup or locate the error box for password mismatch messages.
      let errBox = document.getElementById('password-error');
      if (!errBox) {
        // Create one in a non-invasive place (before the submit button) so layout remains predictable
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
        if (!errBox) return;
        errBox.textContent = msg;
        errBox.classList.remove('hidden');
      }
      function hideError() {
        if (!errBox) return;
        errBox.textContent = '';
        errBox.classList.add('hidden');
      }

      // Password visibility toggles (per-button, per-target)
      const toggleButtons = Array.from(document.querySelectorAll('.toggle-password'));
      toggleButtons.forEach(btn => {
        // Avoid re-initializing the same button
        if (btn.dataset.pwToggleInit === '1') return;
        btn.dataset.pwToggleInit = '1';

        // Find the target input via data-target attribute, or fallback to previousElementSibling
        const targetSelector = btn.getAttribute('data-target');
        const input = targetSelector ? document.querySelector(targetSelector) : btn.previousElementSibling;

        // If target isn't an <input>, don't attach anything
        if (!input || input.tagName !== 'INPUT') {
          return;
        }

        // Setup a small helper to update icon/text. Non-destructive: if no icon is found we just update aria-pressed.
        function updateIcon(isShown) {
          btn.setAttribute('aria-pressed', String(!!isShown));
          const icon = btn.querySelector('i');
          if (icon && icon.classList) {
            // Use Font Awesome classes if present
            icon.classList.toggle('fa-eye', !isShown);
            icon.classList.toggle('fa-eye-slash', isShown);
          } else {
            // Fallback text (keeps it accessible)
            btn.textContent = isShown ? 'Hide' : 'Show';
          }
        }

        // Initialize icon state to hidden (password not shown)
        updateIcon(false);

        // Add the click listener
        btn.addEventListener('click', function (ev) {
          ev.preventDefault();
          // Toggle the type safely (only 'password' <-> 'text')
          try {
            const currentlyPassword = input.getAttribute('type') === 'password';
            input.setAttribute('type', currentlyPassword ? 'text' : 'password');
            updateIcon(currentlyPassword);
            // Keep focus on the input for keyboard users
            input.focus();
          } catch (err) {
            // If anything unexpected happens, fail silently so we don't break the page
            // (no-op)
          }
        });
      });

      // Form submit validation: check passwords match. Don't override other submit handlers.
      form.addEventListener('submit', function (ev) {
        // Only validate if both inputs exist; otherwise, allow submission to proceed
        if (!passwordInput || !confirmInput) {
          hideError();
          return;
        }

        hideError();
        // Basic check: equality and non-empty
        if (passwordInput.value !== confirmInput.value) {
          ev.preventDefault();
          showError('Passwords do not match. Please check and try again.');
          // Focus the confirm field to help the user fix the issue
          try { confirmInput.focus(); } catch (e) {}
          return false;
        }

        // Optionally, enforce minimum length client-side (mirrors HTML minlength but is helpful)
        const minLen = parseInt(passwordInput.getAttribute('minlength') || '0', 10);
        if (minLen > 0 && passwordInput.value.length < minLen) {
          ev.preventDefault();
          showError(`Password must be at least ${minLen} characters.`);
          try { passwordInput.focus(); } catch (e) {}
          return false;
        }

        // If validation passes, hide error and allow other submit handlers (and default submit) to run.
        hideError();
        return true;
      });

      // Clear error as user types so they get real-time feedback
      [passwordInput, confirmInput].forEach(el => {
        if (!el) return;
        el.addEventListener('input', function () {
          if (!errBox.classList.contains('hidden') && passwordInput && confirmInput && passwordInput.value === confirmInput.value) {
            hideError();
          }
        });
      });
    } catch (e) {
      // Defensive: Never throw from this script. If something goes wrong, fail silently.
      // This prevents this script from breaking other page scripts.
      // Optionally you can uncomment the next line during development:
      // console.warn('register script error:', e);
    }
  });
})();
