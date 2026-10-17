
/**
 * Application entry point for rendering equipment and loan data.
 * @module app
 */

import { dataService } from './dataService.js';

window.addEventListener("DOMContentLoaded", start);

/**
 * Render the equipment and loans.
 */

function start() {
    renderEquipmentList();
    renderActiveLoans();
}

/**
 * Render the equipment list into the page.
 * This loads all equipment items from localStorage via dataService,
 * then creates HTML cards for each item.
 */
async function renderEquipmentList() {
    const container = document.getElementById('equipment-list');
    const items = await dataService.getEquipment();

    container.innerHTML = items.map(item => `
    <li class="equipment-card status-${item.status}">
        <h3>${item.name}</h3>
        <span class="badge">${item.category}</span>
        <p>Status: <strong>${item.status}</strong></p>
    </li>`).join('');
}

/**
 * Render the list of active loans into the page.
 * It also looks up the equipment name for each loan.
 */
async function renderActiveLoans() {
    const container = document.getElementById('active-loans-list');
    const loans = await dataService.getLoans();
    const equipment = await dataService.getEquipment();

    if (loans.length === 0) {
        container.innerHTML = '<p>No active loans.</p>';
        return;
    }

    container.innerHTML = loans.map(loan => {
        const item = equipment.find(e => e.id === loan.equipmentId);
        return `
    <div class="loan-card" data-loan-id="${loan.id}">
        <h4>${item ? item.name : 'Unknown Equipment'}</h4>
        <p><strong>Borrower:</strong> ${loan.borrowerName} (${loan.borrowerEmail})</p>
        <p><strong>Due Date:</strong> ${loan.dueDate}</p>
    </div>
    `;
    }).join('');
}
