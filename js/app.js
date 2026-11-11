
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
    renderCategories()

    document.querySelector("#checkout-form").addEventListener("submit", submitLoan);    //loan checkout form
    document.querySelector("#category-form").addEventListener("submit", (e) => {        //select category form
        e.preventDefault();        
        activeCategory = e.target.elements.category.value;
        reloadUI();
    });
    document.querySelector("#equipment-list").addEventListener("click", openCheckoutDialog); // delegate event
    
}
function reloadUI() {
    renderEquipmentList();
    renderActiveLoans();
}

let activeCategory = "All" //visible equipment filtering.
/**
 * Render the equipment list into the page.
 * This loads all equipment items from localStorage via dataService,
 * then creates HTML cards for each item.
 */
async function renderEquipmentList() {

    const container = document.getElementById('equipment-list');
    const items = await dataService.getEquipment();
    const visible = activeCategory === "All" ? items : items.filter(item=>item.category === activeCategory); //category filter.

    const equipment = visible.map(item => {
        // Content of product-card
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
        // Add checkout button
        if (item.status === "available") {
        content.push(util.renderElement({
            tag: "button",
            text: "Checkout",
            classes: ["btn"],
            attributes: {"data-item": item.id}
        }));        
        }
        // return product-card
        return util.renderElement({
            tag: "li",
            classes: ["equipment-card", `status-${item.status}`],
            children: content
        });
    });
    container.replaceChildren(...equipment);// replace container - nodes to avoid duplicates
    
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

    const loansList = loans.map(loan => {
        const item = equipment.find(e => e.id === loan.equipmentId);
        return util.renderElement({tag: "div", classes: ["loan-card"], attributes: {"data-loan-id": loan.id}, children: [
            util.renderElement({tag: "h4", text: (item ? item.name : 'Unknown Equipment')}),
            util.renderElement({tag:"p", children:
                 [
                    util.renderElement({tag:"span",text: "Borrower: ", classes: ["bold-text"], children: `${loan.borrowerName} (${loan.borrowerEmail})`})
                ]}),
            util.renderElement({tag:"p", children:
                 [
                    util.renderElement({tag:"span",text: "Due Date: ", classes: ["bold-text"], children: `${loan.dueDate}`})
                ]}),
        ]});
    });
    container.replaceChildren(...loansList);
}

function openCheckoutDialog(e) {
    const button = e.target.closest("button[data-item]");

    if(!button) return;
        
    document.querySelector("#checkout-dialog").showModal();// display checkout modal
    document.querySelector("#checkout-item-id").value = button.dataset.item;// fill equipment-id hidden input

}

async function submitLoan() {
   const data = Object.fromEntries(new FormData(document.querySelector("#checkout-form"))); // loan data

   await dataService.saveLoan(data);

   //update ui
   reloadUI();
   
}

async function renderCategories() {
    const dropdown = document.querySelector("#category-filtering");

    const equipment = await dataService.getEquipment();
    const categories = Array.from(new Set(equipment.map(item => item.category)));
    
    const options = [util.renderElement({
        tag: "option",
        text: "All",
        attributes: {"selected": true, "value": "All"}
        }),
        ...categories.map(
            cat => util.renderElement({tag: "option", text: cat, attributes: {value: cat}})
        )
    ];

    
    dropdown.replaceChildren(...options);  

}



