class Events extends HTMLElement {


    constructor() {
        // Always call super first in constructor
        super();

        let template = document.getElementById('eventview');
        let templateContent = template.content;

        console.log('events view')

        const shadow = this.attachShadow({
                mode: 'open'
            })
            .appendChild(templateContent.cloneNode(true));
    }
}

try {
    customElements.define('events-element', Events);
} catch (err) {
    const h3 = document.createElement('h3')
    h3.innerHTML = err
    document.body.appendChild(h3)
}