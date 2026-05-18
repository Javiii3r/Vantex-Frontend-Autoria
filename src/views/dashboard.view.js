// src/views/dashboard.view.js
import api from '../lib/api.js';
import { setText, notify } from '../lib/ui.js';

export async function initDashboardView() {
    setText('current-date', new Date().toLocaleDateString('en-US', { 
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
    }));

    await loadDashboardData();
}

async function loadDashboardData() {
    let workOrders = [];
    let machines = [];
    let lowStock = [];

    try { workOrders = await api.workOrders.getAll(); } catch (e) {}
    try { machines = await api.machines.getAll(); } catch (e) {}
    try { lowStock = await api.spareParts.getLowStock(); } catch (e) {}

    const woList = Array.isArray(workOrders) ? workOrders : (workOrders.data || []);
    const machineList = machines.data || (Array.isArray(machines) ? machines : []);
    const lowStockList = lowStock.data || (Array.isArray(lowStock) ? lowStock : []);

    updateDashboardStats(woList, machineList, lowStockList);
    renderWorkOrdersTable('wo-table-body', woList.slice(0, 8));
}

function updateDashboardStats(woList, machineList, lowStockList) {
    const openCount = woList.filter(wo => wo.status === 'open').length;
    const inProgress = woList.filter(wo => wo.status === 'in_progress').length;
    const activeMachines = machineList.filter(m => m.status === 'operational').length;

    setText('stat-pending', String(openCount));
    setText('stat-progress', String(inProgress));
    setText('stat-machines', `${activeMachines} / ${machineList.length}`);
    setText('stat-lowstock', String(lowStockList.length));
    
    setText('wo-count', `${woList.length} ${woList.length === 1 ? 'order' : 'orders'}`);
}

function renderWorkOrdersTable(containerId, woList) {
    const container = document.getElementById(containerId);
    if (!container) return;

    if (woList.length === 0) {
        container.innerHTML = `<div class="p-8 text-center text-zinc-500">No recent orders</div>`;
        return;
    }

    const statusColors = {
        'open': 'bg-yellow-50 text-yellow-700 dark:bg-yellow-500/10 dark:text-yellow-400',
        'in_progress': 'bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400',
        'closed': 'bg-green-50 text-green-700 dark:bg-green-500/10 dark:text-green-400'
    };

    const statusLabels = {
        'open': 'Pending',
        'in_progress': 'In Progress',
        'closed': 'Completed'
    };

    const leftLineColors = {
        'open': 'bg-yellow-500',
        'in_progress': 'bg-blue-500',
        'closed': 'bg-green-500'
    };

    container.innerHTML = woList.map(wo => {
        const date = new Date(wo.opened_at || new Date()).toLocaleDateString('en-US');
        const color = statusColors[wo.status] || 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300';
        const label = statusLabels[wo.status] || wo.status;
        const leftLineColor = leftLineColors[wo.status] || 'bg-zinc-300 dark:bg-zinc-700';

        return `
            <div class="relative overflow-hidden grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4 p-4 items-center text-sm hover:md:bg-zinc-50 dark:hover:md:bg-zinc-800/50 transition-colors bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl md:border-0 md:bg-transparent dark:md:bg-transparent md:rounded-none shadow-sm md:shadow-none">
                <div class="absolute left-0 top-0 bottom-0 w-1 ${leftLineColor}"></div>
                <div class="col-span-1 font-medium text-zinc-900 dark:text-zinc-100 pl-4 md:pl-2 pt-2 md:pt-0">#${wo.id}</div>
                <div class="col-span-2 text-zinc-600 dark:text-zinc-400 truncate pl-4 md:pl-0">${wo.machine_name || 'Unknown'}</div>
                <div class="col-span-3 text-zinc-600 dark:text-zinc-400 truncate pl-4 md:pl-0">${wo.issue_description || 'No description'}</div>
                <div class="col-span-2 pl-4 md:pl-0">
                    <span class="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide ${color}">
                        ${label}
                    </span>
                </div>
                <div class="col-span-4 text-zinc-600 dark:text-zinc-400 truncate pl-4 md:pl-0">${wo.technician_name || 'Unassigned'} • <span class="text-zinc-500 text-xs">${date}</span></div>
            </div>
        `;
    }).join('');
}