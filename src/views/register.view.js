// src/views/register.view.js
import api from '../lib/api.js';
import { redirectIfAuthenticated } from '../lib/auth.js';
import { notify } from '../lib/ui.js';

export function initRegisterView() {
    redirectIfAuthenticated();

    const form = document.getElementById('register-form');
    if (!form) return;

    form.addEventListener('submit', async function(evento) {
        evento.preventDefault(); 

        const submitBtn = form.querySelector('button[type="submit"]');
        if (submitBtn) submitBtn.disabled = true;

        try {
            const data = {
                full_name: document.getElementById('full_name')?.value || form.querySelector('[name="full_name"]').value,
                email: document.getElementById('email')?.value || form.querySelector('[name="email"]').value,
                password: document.getElementById('password')?.value || form.querySelector('[name="password"]').value
            };

            await api.register(data);
            
            notify.success("Account created successfully! Redirecting to login...");
            
            setTimeout(() => {
                window.location.href = '/login';
            }, 1500);

        } catch (error) {
            notify.error("Error creating account: " + error.message);
        } finally {
            if (submitBtn) submitBtn.disabled = false;
        }
    });
}