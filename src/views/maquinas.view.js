// src/views/maquinas.view.js
import api from '../lib/api.js';
import { notify, setText, askConfirm } from '../lib/ui.js';

let machinesList = [];

export async function initMachinesView() {
    await loadMachines();
    setupEventListeners();
}

async function loadMachines() {
    const container = document.getElementById('machines-grid');
    if (container) container.innerHTML = `<div class="col-span-full p-8 text-center text-zinc-500 dark:text-zinc-400">Loading machines...</div>`;

    try {
        const response = await api.machines.getAll();
        machinesList = response.data || response || []; 
        updateStats();
        renderTable();
    } catch (error) {
        notify.error("Error loading machines");
    }
}

function updateStats() {
    const operational = machinesList.filter(m => m.status === 'operational').length;
    const broken = machinesList.filter(m => m.status === 'broken').length; 
    const maintenance = machinesList.filter(m => m.status === 'maintenance').length;

    setText('stat-total', machinesList.length);
    setText('stat-operational', operational);
    setText('stat-maintenance', maintenance);
    setText('stat-down', broken);
}

function renderTable() {
    const container = document.getElementById('machines-grid');
    if (!container) return;

    const searchTerm = document.getElementById('machine-search')?.value.toLowerCase() || '';

    const statusConfig = {
        'operational': { color: 'text-green-600 bg-green-50 ring-green-600/20 dark:bg-green-500/10 dark:text-green-400 dark:ring-green-500/20', label: 'Operational' },
        'maintenance': { color: 'text-blue-600 bg-blue-50 ring-blue-600/20 dark:bg-blue-500/10 dark:text-blue-400 dark:ring-blue-500/20', label: 'In Maintenance' },
        'broken': { color: 'text-red-600 bg-red-50 ring-red-600/20 dark:bg-red-500/10 dark:text-red-400 dark:ring-red-500/20', label: 'Down' }
    };

    const filteredMachines = machinesList.filter(m => 
        m.name.toLowerCase().includes(searchTerm) || 
        m.asset_code.toLowerCase().includes(searchTerm)
    );

    container.innerHTML = filteredMachines.map(m => {
        const status = statusConfig[m.status] || { color: 'text-zinc-600 bg-zinc-50 dark:bg-zinc-800 dark:text-zinc-400', label: m.status };
        const leftLineColors = {
            'operational': 'bg-green-500',
            'maintenance': 'bg-blue-500',
            'broken': 'bg-red-500'
        };
        const leftLineColor = leftLineColors[m.status] || 'bg-zinc-300 dark:bg-zinc-700';

        return `
            <div class="relative overflow-hidden bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all">
                <div class="absolute left-0 top-0 bottom-0 w-1 ${leftLineColor}"></div>
                <span class="inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${status.color}">${status.label}</span>
                <h3 class="text-lg font-bold dark:text-zinc-100 mt-2">${m.name}</h3>
                <p class="text-xs text-zinc-500 font-mono">${m.asset_code}</p>
                <div class="mt-4 pt-4 border-t border-zinc-100 dark:border-zinc-800 space-y-1 text-sm">
                    <p class="text-zinc-500">Location: <span class="text-zinc-900 dark:text-zinc-100">${m.location || 'N/A'}</span></p>
                    <p class="text-zinc-500">Cost: <span class="text-zinc-900 dark:text-zinc-100">${m.downtime_hourly_cost} €/h</span></p>
                </div>
                <div class="mt-6 flex gap-2 admin-only">
                    <button onclick="window.editMachine(${m.id})" class="flex-1 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800/50 dark:hover:bg-zinc-800 dark:text-zinc-100 py-2 rounded-lg font-bold text-sm transition-colors">Edit</button>
                    <button onclick="window.deleteMachine(${m.id})" class="flex-1 bg-red-50 hover:bg-red-100 text-red-600 dark:bg-red-500/10 dark:hover:bg-red-500/20 dark:text-red-400 py-2 rounded-lg font-bold text-sm transition-colors">Delete</button>
                </div>
            </div>
        `;
    }).join('');
}

function setupEventListeners() {
    document.getElementById('machine-search')?.addEventListener('input', renderTable);

    const form = document.getElementById('form-machine');
    form?.addEventListener('submit', async function(e) {
        e.preventDefault();
        const id = document.getElementById('machine-id').value;
        const data = {
            asset_code: document.getElementById('asset_code').value,
            status: document.getElementById('status').value,
            name: document.getElementById('name').value,
            location: document.getElementById('location').value,
            downtime_hourly_cost: parseFloat(document.getElementById('downtime_hourly_cost').value) || 0
        };

        try {
            if (id) {
                await api.machines.update(id, data);
                notify.success("Machine updated");
            } else {
                await api.machines.create(data);
                notify.success("Machine created");
            }
            document.getElementById('modal-machine').classList.add('hidden');
            loadMachines();
        } catch (err) { notify.error(err.message); }
    });

    document.getElementById('btn-new-machine')?.addEventListener('click', () => {
        form.reset();
        document.getElementById('machine-id').value = '';
        setText('modal-title', 'New Machine');
        document.getElementById('modal-machine').classList.remove('hidden');
    });
}

window.editMachine = (id) => {
    const m = machinesList.find(x => x.id === id);
    if (!m) return;
    document.getElementById('machine-id').value = m.id;
    document.getElementById('asset_code').value = m.asset_code;
    document.getElementById('name').value = m.name;
    document.getElementById('location').value = m.location;
    document.getElementById('status').value = m.status;
    document.getElementById('downtime_hourly_cost').value = m.downtime_hourly_cost;
    setText('modal-title', 'Edit Machine');
    document.getElementById('modal-machine').classList.remove('hidden');
};

window.deleteMachine = async (id) => {
    if (await askConfirm("Delete machine?", "The equipment and its history will be removed from the system.")) {
        try {
            await api.machines.delete(id);
            loadMachines();
            notify.success("Machine deleted");
        } catch (error) {
            notify.error("Cannot delete this machine — it likely has associated work orders.");
        }
    }
};