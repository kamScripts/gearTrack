
/**
 * Application entry point for rendering equipment and loan data.
 * @module app
 */

import { dataService } from './dataService.js';
import { util } from './util.js'

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

    const equipment = items.map(item => {
    
        const content = [
            util.renderElement({tag: "h3", text: item.name}),
            util.renderElement({tag: "span", text: item.category, classes: ["badge"]}),
            util.renderElement({tag: "p",
                                text: "Status: ",
                                children: [
                                    util.renderElement({tag: "span", text: item.status, classes: ["bold-text"]})                    
                                ]
                            }), 
        ];

        if (item.status === "available") {
        content.push(util.renderElement({
            tag: "button",
            text: "Checkout",
            classes: ["btn"],
            attributes: {"data-item": item.id}
        }));        
        }

        return util.renderElement({
            tag: "li",
            classes: ["equipment-card", `status-${item.status}`],
            children: content
        });
    });
    container.replaceChildren(...equipment);

    container.addEventListener("click", (e)=> {        
        const button = e.target.closest("button[data-item]");

        if(!button) return;
        
        document.querySelector("#checkout-dialog").showModal();
        document.querySelector("#checkout-item-id").value = button.dataset.item;
    });
   


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
