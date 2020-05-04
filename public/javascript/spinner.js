class LoadingSpinner extends HTMLElement {

    static get observedAttributes() { return ['status']; }

    constructor() {
        // Always call super first in constructor
        super();

        let template = document.getElementById('loadingspinner');
        let templateContent = template.content;

        console.log('INITIALIZING SPINNER')

        const shadow = this.attachShadow({
                mode: 'open'
            })
            .appendChild(templateContent.cloneNode(true));
    }

    attributeChangedCallback(name, oldValue, newValue) {
        // if status attribute is set, change to custom status
        console.log("ATTRIBUTE CHANGED")
        if (name == "status") {
            this.shadowRoot.getElementById("status").innerHTML = newValue
        }
    }
}

try {
    customElements.define('loading-spinner-element', LoadingSpinner);
} catch (err) {
    const h3 = document.createElement('h3')
    h3.innerHTML = err
    document.body.appendChild(h3)
}
