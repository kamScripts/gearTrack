
export const util = {

    renderElement: function({tag,text, classes, attributes = {}, children = []} = {} ) {

        const element = document.createElement(tag);

        if (text !== undefined) {
            element.textContent = text;
        }
        if (classes) element.classList = classes.join(" ").trim();
        // check type of child and if string createTextNode otherwise .append throws TypeError
        for (const child of children) {
            const c = typeof child === "string" ? document.createTextNode(child) : this.renderElement(child);
            element.appendChild(c)
        }
   
        for (const [key, value] of Object.entries(attributes)) {
            element.setAttribute(key, value);
        }
        return element;
    },
    isOverdue: function(date) {
        const today = new Date(Date.now());
        const returnDate = new Date(date);
        return returnDate < today;
    },

}
