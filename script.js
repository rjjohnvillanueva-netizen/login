// Short, safe script for register.html
(function(){
  'use strict';
  if (window.__registerScriptInitialized) return;
  window.__registerScriptInitialized = true;

  const CONFIG = {
    apiEndpoint: '', // set if you have a real API
    demoStorageKey: 'demo_users',
    redirectOnSuccess: 'https://rjjohnvillanueva-netizen.github.io/login_portfolio/'
  };

  document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('registerForm');
    if (!form) return;

    const pw = document.getElementById('password');
    const pw2 = document.getElementById('confirm-password');

    const err = (() => {
      let e = document.getElementById('password-error');
      if (!e) {
        e = document.createElement('div');
        e.id = 'password-error';
        e.className = 'text-sm text-red-300 hidden';
        const submit = form.querySelector('button[type="submit"]') || form.lastElementChild;
        (submit && submit.parentNode ? submit.parentNode : form).insertBefore(e, submit);
      }
      return e;
    })();

    function show(msg){ err.textContent = msg; err.classList.remove('hidden'); }
    function hide(){ err.textContent = ''; err.classList.add('hidden'); }

    // toggle buttons (idempotent)
    document.querySelectorAll('.toggle-password').forEach(btn => {
      if (btn.dataset.init) return; btn.dataset.init = '1';
      const target = btn.getAttribute('data-target') ? document.querySelector(btn.getAttribute('data-target')) : btn.previousElementSibling;
      if (!target) return;
      const icon = btn.querySelector('i');
      function setIcon(shown){ btn.setAttribute('aria-pressed', String(!!shown)); if (icon) { icon.classList.toggle('fa-eye', !shown); icon.classList.toggle('fa-eye-slash', shown); } }
      setIcon(false);
      btn.addEventListener('click', e => { e.preventDefault(); const showing = target.type !== 'password'; target.type = showing ? 'password' : 'text'; setIcon(!showing); target.focus(); });
    });

    function isPostingToSelf(f){
      const method = (f.getAttribute('method')||'get').toLowerCase();
      const action = (f.getAttribute('action')||'').trim();
      if (method !== 'post') return false;
      if (!action || action === '#') return true;
      try {
        const a = new URL(action, location.href), c = new URL(location.href);
        return a.origin === c.origin && a.pathname === c.pathname;
      } catch { return true; }
    }

    async function demoSave(fd){
      // save only name/email for demo (never store passwords)
      const name = fd.get('name')||'', email = fd.get('email')||'';
      const key = CONFIG.demoStorageKey;
      const arr = JSON.parse(localStorage.getItem(key)||'[]');
      arr.push({name,email,createdAt:new Date().toISOString()});
      localStorage.setItem(key, JSON.stringify(arr));
      return { ok:true };
    }

    form.addEventListener('submit', async e => {
      hide();
      if (pw && pw2) {
        if (pw.value !== pw2.value) { e.preventDefault(); show('Passwords do not match.'); pw2.focus(); return false; }
        const min = parseInt(pw.getAttribute('minlength')||'0',10);
        if (min>0 && pw.value.length<min) { e.preventDefault(); show(`Password must be ≥ ${min} chars.`); pw.focus(); return false; }
      }

      if (isPostingToSelf(form)) {
        e.preventDefault();
        const fd = new FormData(form);
        if (CONFIG.apiEndpoint) {
          try {
            const res = await fetch(CONFIG.apiEndpoint, { method:'POST', body: fd });
            if (!res.ok) { show('Submission failed.'); return false; }
            if (CONFIG.redirectOnSuccess) location.href = CONFIG.redirectOnSuccess; else form.reset();
            return true;
          } catch { show('Network error.'); return false; }
        } else {
          const r = await demoSave(fd);
          if (r.ok) { if (CONFIG.redirectOnSuccess) location.href = CONFIG.redirectOnSuccess; else { alert('Saved (demo).'); form.reset(); } return true; }
          show('Demo save failed.');
          return false;
        }
      }
      return true; // allow normal submit if not posting to self
    });
  });
})();
