
export const util = {

    renderElement: function({tag,text, classes = [], attributes = {}, children = []} ) {

        const element = document.createElement(tag);

        if (text !== undefined) {
            element.textContent = text;
        }
        element.classList.add(...classes);
        element.append(...children);
        for (const [key, value] of Object.entries(attributes)) {
            element.setAttribute(key, value);
        }
        return element;
    }
}
