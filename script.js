// Short safe script for register.html and login.html — prevents real POST (avoids 405)
(function(){
  'use strict';
  if (window.__registerScriptInitialized) return;
  window.__registerScriptInitialized = true;

  const CONFIG = {
    redirectOnSuccess: 'https://rjjohnvillanueva-netizen.github.io/login_portfolio/',
    demoStorageKey: 'demo_users'
  };

  document.addEventListener('DOMContentLoaded', () => {
    const regForm = document.getElementById('registerForm');
    const loginForm = document.getElementById('loginForm');

    // password toggle works on either page — run regardless
    document.querySelectorAll('.toggle-password').forEach(b => {
      if (b.dataset.init) return; b.dataset.init = '1';
      const target = b.getAttribute('data-target') ? document.querySelector(b.getAttribute('data-target')) : b.previousElementSibling;
      if (!target) return;
      const icon = b.querySelector('i');
      const set = s => { b.setAttribute('aria-pressed', String(!!s)); if (icon) { icon.classList.toggle('fa-eye', !s); icon.classList.toggle('fa-eye-slash', s); } };
      set(false);
      b.addEventListener('click', e => { e.preventDefault(); const showing = target.type !== 'password'; target.type = showing ? 'password' : 'text'; set(!showing); target.focus(); });
    });

    // demo save (never store passwords)
    const demoSave = (fd, type = 'register') => {
      const arr = JSON.parse(localStorage.getItem(CONFIG.demoStorageKey) || '[]');
      const entry = {
        type,
        email: fd.get('email') || '',
        name: fd.get('name') || '',
        createdAt: new Date().toISOString()
      };
      arr.push(entry);
      localStorage.setItem(CONFIG.demoStorageKey, JSON.stringify(arr));
      return true;
    };

    // Helper to redirect or show saved message
    const handleSuccess = (form) => {
      if (CONFIG.redirectOnSuccess) {
        window.location.href = CONFIG.redirectOnSuccess;
      } else {
        alert('Saved (demo).');
        form.reset();
      }
    };

    // REGISTER FORM
    if (regForm) {
      const pw = document.getElementById('password');
      const pw2 = document.getElementById('confirm-password');
      const btn = document.getElementById('registerBtn');

      let err = document.getElementById('password-error');
      if (!err) {
        err = document.createElement('div');
        err.id = 'password-error';
        err.className = 'text-sm text-red-300 hidden';
        const submit = regForm.querySelector('button[type="submit"]') || btn;
        (submit && submit.parentNode ? submit.parentNode : regForm).insertBefore(err, submit);
      }
      const show = m => { err.textContent = m; err.classList.remove('hidden'); };
      const hide = () => { err.textContent = ''; err.classList.add('hidden'); };

      if (btn) {
        btn.addEventListener('click', () => {
          hide();
          if (pw && pw2) {
            if (pw.value !== pw2.value) { show('Passwords do not match.'); pw2.focus(); return; }
            const min = parseInt(pw.getAttribute('minlength')||'0',10);
            if (min>0 && pw.value.length < min) { show(`Password must be ≥ ${min} chars.`); pw.focus(); return; }
          }

          const fd = new FormData(regForm);
          demoSave(fd, 'register');
          handleSuccess(regForm);
        });
      }
    }

    // LOGIN FORM
    if (loginForm) {
      loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = loginForm.querySelector('#email');
        const pw = loginForm.querySelector('#password');
        if (email && !email.value) { email.focus(); return; }
        if (pw && !pw.value) { pw.focus(); return; }

        const fd = new FormData(loginForm);
        demoSave(fd, 'login');

        // ✅ Mark user as logged in
        localStorage.setItem('loggedIn', 'true');

        // ✅ Redirect immediately
        window.location.href = CONFIG.redirectOnSuccess;
      });
    }
  });
})();
