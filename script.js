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


// ================= ✅ LOGIN =================
document.getElementById('loginForm')?.addEventListener('submit', function(e) {
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

    // ✅ SAVE LOGIN SESSION
    localStorage.setItem("loggedIn", "true");
    localStorage.setItem("currentUser", account.name);

    alert(`Welcome ${account.name}`);

    // ✅ REDIRECT TO PORTFOLIO
    window.location.href = "../HTML/index.html"; 
});


// ================= ✅ REGISTER =================
document.getElementById('registerForm')?.addEventListener('submit', function(e) {
    e.preventDefault();

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const pass = document.getElementById('password').value.trim();
    const confirm = document.getElementById('confirm-password').value.trim();
    const card = document.getElementById('register-card');

    if (pass !== confirm) {
        alert("Passwords do not match!");
        card.classList.add('shake');
        setTimeout(() => card.classList.remove('shake'), 500);
        return;
    }

    accounts.push({ name, email, password: pass });
    localStorage.setItem('accounts', JSON.stringify(accounts));

    // ✅ AUTO LOGIN AFTER REGISTER
    localStorage.setItem("loggedIn", "true");
    localStorage.setItem("currentUser", name);

    alert(`Account created for ${name}`);

    // ✅ REDIRECT TO PORTFOLIO
    window.location.href = "../HTML/index.html"; 
});
