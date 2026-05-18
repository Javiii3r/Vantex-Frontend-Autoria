// src/views/perfil.view.js
import api from '../lib/api.js';
import { clearAuthData, getUser } from '../lib/auth.js';
import { notify, setText } from '../lib/ui.js';

export async function initProfileView() {
    setupProfileData();
    setupEventListeners();
}

function setupProfileData() {
    const user = JSON.parse(localStorage.getItem('user') || sessionStorage.getItem('user'));
    if (!user) return;

    const nameInput = document.getElementById('full_name');
    const emailInput = document.getElementById('email');
    
    if (nameInput) nameInput.value = user.full_name || '';
    if (emailInput) emailInput.value = user.email || '';

    setText('profile-name-display', user.full_name);
    setText('profile-email-display', user.email);
}

function setupEventListeners() {
    const form = document.getElementById('form-update-profile');
    if (form) {
        form.addEventListener('submit', async function(evento) {
            evento.preventDefault();
            
            const submitBtn = form.querySelector('button[type="submit"]');
            submitBtn.disabled = true;

            try {
                const data = {
                    full_name: document.getElementById('full_name').value,
                    email: document.getElementById('email').value
                };

                await api.updateProfile(data);
                
                const user = getUser();
                if (user) {
                    user.full_name = data.full_name;
                    user.email = data.email;
                    localStorage.setItem('user', JSON.stringify(user));
                }

                notify.success("Profile updated successfully");
                
                setTimeout(() => {
                    window.location.reload();
                }, 1000);
                
            } catch (error) {
                notify.error("Update error: " + error.message);
            } finally {
                submitBtn.disabled = false;
            }
        });
    }

    const logoutBtn = document.getElementById('btn-logout');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            clearAuthData();
            window.location.href = '/login';
        });
    }
}