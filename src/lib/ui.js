import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';
import { ROLE_LABELS } from './auth.js';

const commonToastStyle = {
    borderRadius: '12px',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    padding: '12px 24px',
    fontWeight: '500',
    fontSize: '14px',
    border: '1px solid rgba(255, 255, 255, 0.2)'
};

export const notify = {
    success: (mensaje) => {
        Toastify({ 
            text: mensaje, 
            duration: 3000,
            gravity: "top",
            position: "right",
            style: { background: '#22c55e', color: '#fff', ...commonToastStyle } 
        }).showToast();
    },
    error: (mensaje) => {
        Toastify({ 
            text: mensaje, 
            duration: 4000,
            gravity: "top",
            position: "right",
            style: { background: '#ef4444', color: '#fff', ...commonToastStyle } 
        }).showToast();
    },
    info: (mensaje) => {
        Toastify({ 
            text: mensaje, 
            duration: 3000,
            gravity: "top",
            position: "right",
            style: { background: '#eab308', color: '#000', ...commonToastStyle } 
        }).showToast();
    }
};

export function setText(id, texto) {
    const elemento = document.getElementById(id);
    if (elemento !== null) {
        elemento.textContent = texto;
    }
}



export function askConfirm(title, message) {
    return new Promise((resolve) => {
        const overlay = document.createElement('div');
        overlay.className = "fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 animate-in fade-in duration-200";
        
        overlay.innerHTML = `
            <div class="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden border border-zinc-200 dark:border-zinc-800 scale-100 transition-transform">
                <div class="p-6">
                    <h3 class="text-lg font-bold text-zinc-900 dark:text-zinc-100 mb-2">${title}</h3>
                    <p class="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">${message}</p>
                </div>
                <div class="p-4 bg-zinc-50 dark:bg-zinc-800/50 border-t border-zinc-100 dark:border-zinc-800 flex gap-3 justify-end">
                    <button id="btn-cancel-confirm" class="px-5 py-2 text-sm font-bold text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors rounded-xl hover:bg-zinc-200 dark:hover:bg-zinc-800">Cancel</button>
                    <button id="btn-ok-confirm" class="px-5 py-2 text-sm font-bold bg-red-600 hover:bg-red-700 text-white rounded-xl shadow-md transition-all active:scale-95">Delete</button>
                </div>
            </div>
        `;

        document.body.appendChild(overlay);

        const closeAndResolve = (result) => {
            overlay.remove();
            resolve(result);
        };

        overlay.querySelector('#btn-cancel-confirm').addEventListener('click', () => closeAndResolve(false));
        overlay.querySelector('#btn-ok-confirm').addEventListener('click', () => closeAndResolve(true));
        
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) closeAndResolve(false);
        });
    });
}

export function applyRoleProtections(user) {
    if (user === null) return;

    if (user.role === 'technician') {
        const elementosAdmin = document.querySelectorAll('.admin-only');
        elementosAdmin.forEach(function(elemento) {
            elemento.remove();
        });
    }
}

export function setupUserUI(user) {
    if (user === null) return;
    
    let inicial = "U";
    if (user.full_name !== undefined && user.full_name !== "") {
        inicial = user.full_name.charAt(0).toUpperCase();
    }
    
    const nombreRol = ROLE_LABELS[user.role] || user.role;

    // Cabecera
    setText('header-name', user.full_name);
    setText('header-avatar', inicial);
    setText('header-role', nombreRol);

    // Sidebar
    setText('user-name', user.full_name);
    setText('user-avatar', inicial);
    setText('user-role', nombreRol);
}

export function initTheme() {
    if (typeof window === 'undefined') return;
    
    const theme = localStorage.getItem('theme');
    if (theme === 'dark') {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }
}

export function toggleTheme() {
    const isDark = document.documentElement.classList.contains('dark');
    
    if (isDark === true) {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('theme', 'light');
    } else {
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
    }
}