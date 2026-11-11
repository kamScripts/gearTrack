
export const util = {

    renderElement: function({tag,text, classes = [], attributes = {}, children = []} = {} ) {

        const element = document.createElement(tag);

        if (text !== undefined) {
            element.textContent = text;
        }
        element.classList = classes.join(" ").trim();
        element.append(...children);
        for (const [key, value] of Object.entries(attributes)) {
            element.setAttribute(key, value);
        }
        return element;
    },
    isOverdue: function(date) {
        const today = new Date(Date.now());
        const returnDate = new Date(date);
        return returnDate < today;
    }
}
