import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';
import { ROLE_LABELS } from './auth.js';

export const notify = {
    success: (mensaje) => {
        Toastify({ text: mensaje, duration: 3000, style: { background: '#22c55e' } }).showToast();
    },
    error: (mensaje) => {
        Toastify({ text: mensaje, duration: 4000, style: { background: '#ef4444' } }).showToast();
    },
    info: (mensaje) => {
        Toastify({ text: mensaje, duration: 3000, style: { background: '#eab308', color: '#000' } }).showToast();
    }
};

export function setText(id, texto) {
    const elemento = document.getElementById(id);
    if (elemento !== null) {
        elemento.textContent = texto;
    }
}

