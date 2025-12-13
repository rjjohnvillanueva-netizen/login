// Short safe script for register.html — prevents real POST (avoids 405)
(function(){
  'use strict';
  if (window.__registerScriptInitialized) return;
  window.__registerScriptInitialized = true;

  const CONFIG = {
    redirectOnSuccess: 'https://rjjohnvillanueva-netizen.github.io/login_portfolio/',
    demoStorageKey: 'demo_users'
  };

  document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('registerForm');
    if (!form) return;

    const nameEl = document.getElementById('name');
    const emailEl = document.getElementById('email');
    const pw = document.getElementById('password');
    const pw2 = document.getElementById('confirm-password');
    const btn = document.getElementById('registerBtn');

    let err = document.getElementById('password-error');
    if (!err) {
      err = document.createElement('div');
      err.id = 'password-error';
      err.className = 'text-sm text-red-300 hidden';
      const submit = form.querySelector('button[type="submit"]') || btn;
      (submit && submit.parentNode ? submit.parentNode : form).insertBefore(err, submit);
    }
    const show = m => { err.textContent = m; err.classList.remove('hidden'); };
    const hide = () => { err.textContent = ''; err.classList.add('hidden'); };

    // toggle password buttons
    document.querySelectorAll('.toggle-password').forEach(b => {
      if (b.dataset.init) return; b.dataset.init = '1';
      const target = b.getAttribute('data-target') ? document.querySelector(b.getAttribute('data-target')) : b.previousElementSibling;
      if (!target) return;
      const icon = b.querySelector('i');
      const set = s => { b.setAttribute('aria-pressed', String(!!s)); if (icon) { icon.classList.toggle('fa-eye', !s); icon.classList.toggle('fa-eye-slash', s); } };
      set(false);
      b.addEventListener('click', e => { e.preventDefault(); const showing = target.type !== 'password'; target.type = showing ? 'password' : 'text'; set(!showing); target.focus(); });
    });

    // demo save (only name & email)
    const demoSave = fd => {
      const arr = JSON.parse(localStorage.getItem(CONFIG.demoStorageKey) || '[]');
      arr.push({ name: fd.get('name')||'', email: fd.get('email')||'', createdAt: new Date().toISOString() });
      localStorage.setItem(CONFIG.demoStorageKey, JSON.stringify(arr));
      return true;
    };

    // handle click instead of real submit
    if (btn) {
      btn.addEventListener('click', () => {
        hide();
        if (pw && pw2) {
          if (pw.value !== pw2.value) { show('Passwords do not match.'); pw2.focus(); return; }
          const min = parseInt(pw.getAttribute('minlength')||'0',10);
          if (min>0 && pw.value.length < min) { show(`Password must be ≥ ${min} chars.`); pw.focus(); return; }
        }

        // collect form data
        const fd = new FormData(form);
        // demo save (never store passwords)
        demoSave(fd);
        // redirect to portfolio
        if (CONFIG.redirectOnSuccess) location.href = CONFIG.redirectOnSuccess;
        else { alert('Saved (demo).'); form.reset(); }
      });
    }
  });
})();
