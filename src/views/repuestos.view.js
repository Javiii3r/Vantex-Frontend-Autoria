// src/views/repuestos.view.js
import api from '../lib/api.js';
import { notify, setText, askConfirm } from '../lib/ui.js';
import QRCode from 'qrcode';

let partsList = [];

export async function initSparePartsView() {
    await loadSpareParts();
    setupEventListeners();
}

async function loadSpareParts() {
    const container = document.getElementById('spare-parts-grid');
    if (container) container.innerHTML = `<div class="col-span-full p-8 text-center text-zinc-500 dark:text-zinc-400">Loading spare parts...</div>`;

    try {
        const response = await api.spareParts.getAll();
        partsList = response.data || response || [];
        updateStats();
        renderTable();
    } catch (error) { notify.error("Error loading spare parts"); }
}

function updateStats() {
    const out = partsList.filter(p => p.current_stock <= 0).length;
    const low = partsList.filter(p => p.current_stock > 0 && p.current_stock <= p.minimum_stock).length;
    setText('stat-total', partsList.length);
    setText('stat-optimal', partsList.length - out - low);
    setText('stat-low', low);
    setText('stat-out', out);
}

function renderTable() {
    const container = document.getElementById('spare-parts-grid');
    if (!container) return;

    const searchTerm = document.getElementById('spare-search')?.value.toLowerCase() || '';
    const filteredParts = partsList.filter(p => 
        p.name.toLowerCase().includes(searchTerm) || 
        p.sku.toLowerCase().includes(searchTerm)
    );

    container.innerHTML = filteredParts.map(p => {
        let leftLineColor = 'bg-green-500';
        if (p.current_stock <= 0) leftLineColor = 'bg-red-500';
        else if (p.current_stock <= p.minimum_stock) leftLineColor = 'bg-yellow-500';

        return `
        <div class="relative overflow-hidden bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all">
            <div class="absolute left-0 top-0 bottom-0 w-1 ${leftLineColor}"></div>
            <div class="flex justify-between items-start pl-2">
                <div>
                    <h3 class="text-lg font-bold dark:text-zinc-100">${p.name}</h3>
                    <p class="text-xs text-zinc-500 font-mono">${p.sku}</p>
                </div>
                <div class="text-right">
                    <p class="text-2xl font-black dark:text-zinc-100">${p.current_stock}</p>
                    <p class="text-[10px] font-bold text-zinc-500 uppercase">In stock</p>
                </div>
            </div>
            <div class="mt-4 pt-4 border-t border-zinc-100 dark:border-zinc-800 text-sm space-y-1 pl-2">
                <p class="text-zinc-500">Price: <span class="text-zinc-900 dark:text-zinc-100">${p.unit_price} €</span></p>
                <p class="text-zinc-500">Minimum: <span class="text-zinc-900 dark:text-zinc-100">${p.minimum_stock}</span></p>
            </div>
            <div class="mt-4 pl-2">
                <button onclick="window.printLabel('${p.sku}', '${p.name.replace(/'/g, "\\'")}')"
                    class="w-full flex items-center justify-center gap-2 bg-yellow-500 hover:bg-yellow-400 text-zinc-950 py-2 rounded-lg font-bold text-sm transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2Z"/><path d="M7 7h.01"/></svg> Label
                </button>
            </div>
            <div class="mt-2 flex gap-2 admin-only pl-2">
                <button onclick="window.editPart(${p.id})" class="flex-1 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800/50 dark:hover:bg-zinc-800 dark:text-zinc-100 py-2 rounded-lg font-bold text-sm transition-colors">Edit</button>
                <button onclick="window.deletePart(${p.id})" class="flex-1 bg-red-50 hover:bg-red-100 text-red-600 dark:bg-red-500/10 dark:hover:bg-red-500/20 dark:text-red-400 py-2 rounded-lg font-bold text-sm transition-colors">Delete</button>
            </div>
        </div>
        `;
    }).join('');
}

function setupEventListeners() {
    document.getElementById('spare-search')?.addEventListener('input', renderTable);

    const form = document.getElementById('form-spare');
    form?.addEventListener('submit', async function(e) {
        e.preventDefault();
        const id = document.getElementById('spare-id').value;
        const data = {
            sku: document.getElementById('sku').value,
            name: document.getElementById('name').value,
            current_stock: parseInt(document.getElementById('stock').value, 10),
            minimum_stock: parseInt(document.getElementById('minimum_stock').value, 10),
            unit_price: parseFloat(document.getElementById('unit_price').value)
        };
        try {
            if (id) {
                await api.spareParts.update(id, data);
                notify.success("Spare part updated");
            } else {
                await api.spareParts.create(data);
                notify.success("Spare part created");
            }
            document.getElementById('modal-spare').classList.add('hidden');
            loadSpareParts();
        } catch (err) { notify.error(err.message); }
    });

    document.getElementById('btn-new-spare')?.addEventListener('click', () => {
        form.reset();
        document.getElementById('spare-id').value = '';
        setText('modal-title', 'New Spare Part');
        document.getElementById('modal-spare').classList.remove('hidden');
    });
}

window.editPart = (id) => {
    const p = partsList.find(x => x.id === id);
    if (!p) return;
    document.getElementById('spare-id').value = p.id;
    document.getElementById('sku').value = p.sku;
    document.getElementById('name').value = p.name;
    document.getElementById('stock').value = p.current_stock;
    document.getElementById('minimum_stock').value = p.minimum_stock;
    document.getElementById('unit_price').value = p.unit_price;
    setText('modal-title', 'Edit Spare Part');
    document.getElementById('modal-spare').classList.remove('hidden');
};

window.deletePart = async (id) => {
    if (await askConfirm("Delete spare part?", "The material will disappear from the virtual inventory. This action cannot be undone.")) {
        try {
            await api.spareParts.delete(id);
            loadSpareParts();
            notify.success("Spare part deleted");
        } catch (error) {
            notify.error("Cannot delete this spare part — check it is not used in any work order.");
        }
    }
};

window.printLabel = async (sku, name) => {
    const canvas = document.getElementById('qr-canvas');
    await QRCode.toCanvas(canvas, sku, { width: 180, margin: 1 });
    document.getElementById('label-sku').textContent = sku;
    document.getElementById('label-name').textContent = name;
    document.getElementById('modal-label').classList.remove('hidden');
};