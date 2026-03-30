// Simula��o de backend leve usando localStorage

const storageKey = 'auxilioTecnologiaApp';

function getAppData() {
    return JSON.parse(localStorage.getItem(storageKey) || '{"users": [], "newsletter": []}');
}

function setAppData(data) {
    localStorage.setItem(storageKey, JSON.stringify(data));
}

function signUp(email, password) {
    const data = getAppData();
    if (data.users.find(u => u.email === email)) {
        throw new Error('E-mail ja cadastrado. Use outro e-mail ou fa�a login.');
    }
    data.users.push({ email, password });
    setAppData(data);
}

function login(email, password) {
    const data = getAppData();
    const user = data.users.find(u => u.email === email && u.password === password);
    if (!user) {
        throw new Error('Usuario ou senha invalidos.');
    }
    localStorage.setItem('loggedInUser', email);
}

function logout() {
    localStorage.removeItem('loggedInUser');
}

function getLoggedUser() {
    return localStorage.getItem('loggedInUser');
}

function subscribeNewsletter(email) {
    const data = getAppData();
    if (!data.newsletter.includes(email)) {
        data.newsletter.push(email);
        setAppData(data);
    }
}

function getNewsletterPeople() {
    return getAppData().newsletter;
}

function initAuthUi() {
    const painel = document.getElementById('authPanel');
    const info = document.getElementById('authInfo');
    const loggedUser = getLoggedUser();

    if (!painel || !info) return;

    if (loggedUser) {
        painel.style.display = 'none';
        info.style.display = 'block';
        info.querySelector('span').textContent = loggedUser;
    } else {
        painel.style.display = 'block';
        info.style.display = 'none';
    }
}

function setupAuthHandlers() {
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    const logoutBtn = document.getElementById('logoutBtn');

    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            try {
                const email = loginForm.email.value.trim();
                const password = loginForm.password.value;
                login(email, password);
                alert('Login efetuado com sucesso.');
                location.reload();
            } catch (error) {
                alert(error.message);
            }
        });
    }

    if (signupForm) {
        signupForm.addEventListener('submit', (e) => {
            e.preventDefault();
            try {
                const email = signupForm.email.value.trim();
                const password = signupForm.password.value;
                signUp(email, password);
                alert('Cadastro realizado com sucesso. Fa�a login.');
                signupForm.reset();
            } catch (error) {
                alert(error.message);
            }
        });
    }

    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            logout();
            location.reload();
        });
    }
}

window.addEventListener('DOMContentLoaded', () => {
    initAuthUi();
    setupAuthHandlers();
});
