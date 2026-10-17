# GearTrack Feature Backlog

Complete GT-101 to GT-104 and select 2 from GT-105 to GT-108

## [GT-101] Feature: Checkout Form Modal (Complexity: Low)
**Description:**
Add a "Checkout Equipment" button next to available equipment items. Clicking this button opens a simple form modal allowing department staff to initiate a loan.

**Acceptance Criteria:**
- Each equipment item marked status: 'available' displays a "Checkout" button.
- Clicking "Checkout" opens a modal containing fields for Borrower Name, Borrower Email, and Return Date.
- Submitting the form calls dataService.saveLoan().
- On successful submit, the modal closes, and both the Equipment List and Active Loans sections refresh without a page reload.

## [GT-102] Feature: Equipment Category Filtering (Complexity: Low)
**Description:**
Add a category dropdown at the top of the Equipment section so staff can filter items.

**Acceptance Criteria:**
- Dropdown includes options: All, Cameras, Laptops, Accessories.
- Selecting an option instantly filters the displayed list without page reload.
- The system dynamically generates categories from available data rather than hardcoding values in HTML.

## [GT-103] Security Refactor: DOM-based XSS Mitigation (Complexity: Medium)
**Description:**
The current UI rendering in app.js uses raw template literals injected directly into innerHTML. If user input contains malicious HTML or script tags (e.g., in borrowerName or equipment.name), it will execute in the browser. Refactor the rendering logic to prevent DOM-based XSS.

**Acceptance Criteria:**
- Replace raw string interpolation in innerHTML with textContent nodes, document.createElement(), or a sanitised string helper.
- Entering ```<script>alert('xss')</script>``` or ```<img src="x" onerror="alert(1)">``` into borrower details or equipment titles displays the literal string on screen without executing code.
- Add a section to your walkthrough explaining why innerHTML interpolation with unsanitised user input poses a security risk.

## [GT-104] Feature: Return Equipment Flow (Complexity: Medium)
**Description:**
Implement a "Return" action on active loan items to mark equipment as returned and free it up for future loans.

**Acceptance Criteria:**
- Add a returnLoan(loanId) method to dataService.js.
- Each active loan card features a "Mark Returned" button.
- Clicking "Mark Returned" updates the loan's status to returned and sets the corresponding equipment's status back to available.
- The card moves out of the Active Loans view immediately.

## [GT-105] Feature: Overdue Loan Highlight & Notification (Complexity: Medium-High)
**Description:**
Visually flag active loans past their return date and display an overdue warning counter on the dashboard.

**Acceptance Criteria:**
- Compare dueDate against the current date on render.
- If dueDate is earlier than today, add an .overdue class to the loan card (styled with red border/background tint).
- Display an status summary pill at the top of the Active Loans panel showing X Overdue Loans.


## [GT-106] Feature: Live Inventory Search & Debouncing (Complexity: Medium)
**Description:**
Add a real-time search bar above the equipment list so staff can quickly locate specific euipment by name or ID without reloading the page.

**Acceptance Criteria:**
- A search input field is added above the equipment list.
- As the user types, the equipment list filters immediately based on matching `name` or `id` (case-insensitive).
- Implement a simple debounce helper (e.g., 250ms-300ms delay) to ensure filtering logic doesn't fire excessively on every keystroke.
- If no items match the query, display an inline empty-state message (e.g., *"No equipment matching your search"*).

---

## [GT-107] Feature: Department Usage Stats Dashboard (Complexity: High)
**Description:**
Add an analytics summary bar at the top of the application to give staff immediate visibility into department inventory utilisation.

**Acceptance Criteria:**

- Display three summary metric cards: **Total Items**, **Currently Loaned (%)**, and **Overdue Items**.
- Add a `getStats()` method in `dataService.js` that calculates these metrics dynamically from the current equipment and loan records.
- The stats bar updates automatically whenever a loan is created or checked in.

---

## [GT-108] Feature: Export Active Loans to CSV (Complexity: High)
**Description:**
Provide an "Export to CSV" action on the Active Loans panel allowing staff to download a local snapshot of current active loans for record-keeping.

**Acceptance Criteria:**

- A "Export CSV" button is added to the Active Loans header.
- Clicking the button generates a CSV-formatted string in memory containing: `Loan ID`, `Equipment Name`, `Borrower Name`, `Borrower Email`, `Due Date`.
- Triggers a browser file download programmatically using a dynamic Data URI or `Blob` URL (e.g., file named `geartrack-loans-YYYY-MM-DD.csv`).
- Handled entirely on the client side without relying on external libraries or backend API endpoints.

---

