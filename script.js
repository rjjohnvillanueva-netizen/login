// ================= PARTICLES =================
const particleContainer = document.getElementById('particles');

function createParticle() {
    if (!particleContainer) return;
    const p = document.createElement("div");
    p.classList.add("particle");
    p.style.left = Math.random() * window.innerWidth + "px";
    p.style.animationDuration = 3 + Math.random() * 5 + "s";
    p.style.opacity = Math.random();
    particleContainer.appendChild(p);
    setTimeout(() => p.remove(), 8000);
}

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
}
@keyframes fall {
    from { transform: translateY(-10px); }
    to { transform: translateY(110vh); }
}
`;
document.head.appendChild(style);
setInterval(createParticle, 150);

// ================= EYE TOGGLE =================
document.querySelectorAll('.toggle-password').forEach(button => {
    button.addEventListener('click', () => {
        const input = button.previousElementSibling;
        const icon = button.querySelector('i');
        if (input.type === 'password') {
            input.type = 'text';
            icon.classList.replace('fa-eye', 'fa-eye-slash');
        } else {
            input.type = 'password';
            icon.classList.replace('fa-eye-slash', 'fa-eye');
        }
    });
});

// ================= LOCAL STORAGE =================
const accounts = JSON.parse(localStorage.getItem('accounts')) || [];

// ================= LOGIN =================
document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById('loginForm');

    if (!form) {
        console.error("loginForm not found");
        return;
    }

    form.addEventListener('submit', function(e) {
        e.preventDefault();

        const email = document.getElementById('email').value.trim();
        const pass = document.getElementById('password').value.trim();
        const card = document.getElementById('login-card');

        const account = accounts.find(acc => acc.email === email && acc.password === pass);

        if (!account) {
            alert("Invalid login!");
            card.classList.add('shake');
            setTimeout(() => card.classList.remove('shake'), 500);
            return;
        }

        // SAVE LOGIN SESSION
        localStorage.setItem("loggedIn", "true");
        localStorage.setItem("currentUser", account.name);

        console.log("Login submitted"); // DEBUG

        // REDIRECT TO PORTFOLIO
        window.location.href = "https://rjjohnvillanueva-netizen.github.io/login_portfolio/";
    });
});
