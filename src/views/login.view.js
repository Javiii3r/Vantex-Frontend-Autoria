// src/views/login.view.js
import api from '../lib/api.js';
import { setAuthData, redirectIfAuthenticated } from '../lib/auth.js';
import { notify } from '../lib/ui.js';

export function initLoginView() {
    redirectIfAuthenticated();

    const form = document.getElementById('login-form');
    if (!form) return;

    form.addEventListener('submit', async function(evento) {
        
        evento.preventDefault(); 

        const submitBtn = form.querySelector('button[type="submit"]');
        if (submitBtn) submitBtn.disabled = true;

        try {
            const emailValue = form.querySelector('[name="email"]').value;
            const passwordValue = form.querySelector('[name="password"]').value;

            const response = await api.login(emailValue, passwordValue);
            
            const result = response.data || response;
            
            setAuthData(result.user, result.token);
            
            notify.success(`Welcome back, ${result.user.full_name}!`);
            
            setTimeout(() => {
                window.location.href = '/dashboard';
            }, 800);

        } catch (error) {
            notify.error("Login error: " + error.message);
        } finally {
            if (submitBtn) submitBtn.disabled = false;
        }
    });
}