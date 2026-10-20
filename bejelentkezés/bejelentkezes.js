document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const errorMessage = document.getElementById('errorMessage');

    loginForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const usernameInput = document.getElementById('username').value;
        const passwordInput = document.getElementById('password').value;

        const HELYES_USER = "admin";
        const HELYES_PASS = "12345";

        if (usernameInput === HELYES_USER && passwordInput === HELYES_PASS) {
            window.location.href = "/foglalások/foglalasok.html";
        } else {
            errorMessage.classList.remove('d-none');
        }
    });
});