
//Completed gt-101,gt-102,gt-103,gt-104,gt105,gt-106
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
    renderCategories();

    document.querySelector("#checkoutForm").addEventListener("submit", submitLoan);    //loan checkout form
    document.querySelector("#categoryForm").addEventListener("submit", (e) => {        //select category form
        e.preventDefault();        
        activeCategory = e.target.elements.category.value;
        reloadUI();
    });

    //Debounce search results output
    let timer;
    document.querySelector("#item-name").addEventListener("input",  () => {
        const {item, category} = Object.fromEntries(new FormData(document.querySelector("#categoryForm")));

        clearTimeout(timer);

        timer = setTimeout(() => {return filterContent({item, category})}, 400);

    })
    // delegate events
    document.querySelector("#equipment-list").addEventListener("click", openCheckoutDialog); 
    document.querySelector("#active-loans-list").addEventListener("click", returnLoan); 
}
// Reload equipment and loan lists
function reloadUI() {
    renderEquipmentList();
    renderActiveLoans();
}
// Filter items based on name/id and category
async function filterContent({item="", category=""} = {}) {
    const items  = await dataService.getEquipment();
    const re = new RegExp("^"+item+".*", "i");
    
    const filtered =items.filter((item => (re.test(item.name) || re.test(item.id)) && (!category || item.category == category)));
    filtered.length > 0 ?
     equipmentView(filtered, document.querySelector("#equipment-list")) 
     : document.querySelector("#equipment-list").innerHTML = "<p>No equipment matching your search</p>";
}

let activeCategory = ""; //visible equipment filtering.
/**
 * Render the equipment list into the page.
 * This loads all equipment items from localStorage via dataService,
 * then creates HTML cards for each item.
 */
async function renderEquipmentList() {

    const container = document.getElementById('equipment-list');
    const items = await dataService.getEquipment();
    const visible = !activeCategory ? items : items.filter(item=>item.category === activeCategory);//category filter.

    equipmentView(visible, container);
    
}
function equipmentView(eq=[], container) {
    
    const equipment = eq.map(item => {
        // Content of product-card
        const content = [
            {tag: "h3", text: item.name},
            {tag: "span", text: item.category, classes: ["badge"]},
            {tag: "p",
             text: "Status: ",
            children: [{tag: "span", text: item.status, classes: ["bold-text"]}]
                            }, 
        ];
        // Add checkout button
        if (item.status === "available") {
        content.push({
            tag: "button",
            text: "Checkout",
            classes: ["btn"],
            attributes: {"data-item": item.id}
        });        
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
    //Both promises need to be fulfilled to render list
    const [loans, equipment] = await Promise.all([dataService.getLoans(), dataService.getEquipment()]);

    if (loans.length === 0) {
        container.innerHTML = '<p>No active loans.</p>';
        return;
    }
    loanView(loans,equipment, container);
}

function loanView(loans, equipment, container) {

    let overdueLoans = 0; // overdue loans counter

    const loansList = loans.map(loan => {

        
        if (loan.status === "active") {

            let checkOverdue = util.isOverdue(loan.dueDate);
            if (checkOverdue) overdueLoans++; //increment total count
            const item = equipment.find(e => e.id === loan.equipmentId);

            return util.renderElement({tag: "div", classes: ["loan-card", `${checkOverdue?"overdue":""}`], children: [
            {tag: "h3", text: (item ? item.name : 'Unknown Equipment')},
            {
             tag:"p",
             children: 
                [
                    {tag:"span",text: "Borrower: ", classes: ["bold-text"]},
                    `${loan.borrowerName} (${loan.borrowerEmail})`
            ]},
            {
             tag:"p",
             children:
                 [
                    {tag:"span",text: "Due Date: ", classes: ["bold-text"]},
                    `${loan.dueDate}`
            ]},
            {tag:"button", text: "Mark returned", classes: ["btn"], attributes: {"data-loan": loan.id}}
        ]});
        }
        return ""; // to prevent rendering undefined 
    });
    document.querySelector("#summary-pill").innerHTML = `<p>${overdueLoans} Overdue Loans`;
    container.replaceChildren(...loansList);
}
// Modal
function openCheckoutDialog(e) {
    const button = e.target.closest("button[data-item]");

    if(!button) return;
        
    document.querySelector("#checkout-dialog").showModal();// display checkout modal
    document.querySelector("#checkout-item-id").value = button.dataset.item;// fill equipment-id hidden input
    

}

async function submitLoan() {
   const data = Object.fromEntries(new FormData(document.querySelector("#checkoutForm"))); // loan data

   await dataService.saveLoan(data);

   //update ui
   reloadUI();
   
}
async function returnLoan(e) {
    const button = e.target.closest("button[data-loan]");

    if (!button) return;
    console.log(button.dataset.loan)
    const res = await dataService.returnLoan(button.dataset.loan);

    console.log(res);
    reloadUI();
}



async function renderCategories() {
    const dropdown = document.querySelector("#category-filtering");

    const equipment = await dataService.getEquipment();
    const categories = Array.from(new Set(equipment.map(item => item.category)));// Extract categories
    
    const options = [util.renderElement({
        tag: "option",
        text: "All",
        attributes: {"selected": true, "value": ""}
        }),
        ...categories.map(
            cat => util.renderElement({tag: "option", text: cat, attributes: {value: cat}})
        )
    ];

    
    dropdown.replaceChildren(...options);  

}



