// ================= PARTICLES, EYE TOGGLE & LOGIN =================
// All DOM-dependent code runs after DOMContentLoaded to avoid
// timing issues when script is placed in <head> or loaded async.

document.addEventListener("DOMContentLoaded", () => {
    // ================= PARTICLES =================
    const particleContainer = document.getElementById('particles');
    if (particleContainer) {
        // inject particle styles
        const style = document.createElement("style");
        style.innerHTML = `
.particle {
    position: fixed;
    top: 0;
    width: 4px;
    height: 4px;
    background: white;
    border-radius: 50%;
    box-shadow: 0 0 6px white;
    animation: fall linear forwards;
    pointer-events: none;
}
@keyframes fall {
    from { transform: translateY(-10px); }
    to { transform: translateY(110vh); }
}
`;
        document.head.appendChild(style);

        function createParticle() {
            const p = document.createElement("div");
            p.classList.add("particle");
            p.style.left = Math.random() * window.innerWidth + "px";

            // animation duration between 3s and 8s
            const durationSec = 3 + Math.random() * 5;
            p.style.animationDuration = durationSec.toFixed(3) + "s";

            // random opacity but keep visible
            p.style.opacity = (0.3 + Math.random() * 0.7).toString();

            particleContainer.appendChild(p);

            // remove after the animation finishes (with small buffer)
            const removeAfter = Math.ceil(durationSec * 1000) + 1000;
            setTimeout(() => p.remove(), removeAfter);
        }

        // Only create particles while there's a container
        const particleInterval = setInterval(() => {
            if (!document.body.contains(particleContainer)) {
                clearInterval(particleInterval);
                return;
            }
            createParticle();
        }, 150);
    }

    // ================= EYE TOGGLE =================
    // Safer lookup: find the related input inside the same parent container
    document.querySelectorAll('.toggle-password').forEach(button => {
        button.addEventListener('click', () => {
            // look for an input (password or text) in the same parent node
            const parent = button.parentElement || document;
            const input = parent.querySelector('input[type="password"], input[type="text"]');
            const icon = button.querySelector('i');

            if (!input) return;

            if (input.type === 'password') {
                input.type = 'text';
                if (icon) {
                    icon.classList.remove('fa-eye');
                    icon.classList.add('fa-eye-slash');
                }
            } else {
                input.type = 'password';
                if (icon) {
                    icon.classList.remove('fa-eye-slash');
                    icon.classList.add('fa-eye');
                }
            }
        });
    });

    // ================= LOGIN =================
    const loginForm = document.getElementById('loginForm');

    // STOP if this is NOT the login page
    if (!loginForm) return;

    loginForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const emailEl = document.getElementById('email');
        const passEl = document.getElementById('password');
        const card = document.getElementById('login-card');

        const email = emailEl ? emailEl.value.trim() : '';
        const pass = passEl ? passEl.value.trim() : '';

        let accounts = [];
        try {
            accounts = JSON.parse(localStorage.getItem('accounts')) || [];
            if (!Array.isArray(accounts)) accounts = [];
        } catch (err) {
            // malformed data in localStorage
            console.warn('Failed to parse accounts from localStorage:', err);
            accounts = [];
        }

        const account = accounts.find(
            acc => acc && acc.email === email && acc.password === pass
        );

        if (!account) {
            alert("Invalid login!");
            if (card) {
                card.classList.add('shake');
                setTimeout(() => card.classList.remove('shake'), 500);
            }
            return;
        }

        // SAVE SESSION (simple client-side session)
        localStorage.setItem("loggedIn", "true");
        // prefer name when available, fallback to email
        localStorage.setItem("currentUser", account.name || account.email || '');

        // REDIRECT to the portfolio / dashboard
        window.location.href =
            "https://rjjohnvillanueva-netizen.github.io/login_portfolio/";
    });
});
