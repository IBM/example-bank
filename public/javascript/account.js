class Account extends HTMLElement {

    static get observedAttributes() {
        return ['events', 'points'];
    }

    clickaccount() {
        console.log('this is a test');
    }

    constructor() {
        // Always call super first in constructor
        super();

        let template = document.getElementById('accountview');
        let templateContent = template.content;

        const shadow = this.attachShadow({
                mode: 'open'
            })
            .appendChild(templateContent.cloneNode(true));
    }

    connectedCallback(){
        var customElement = this;
        var sr = this.shadowRoot;

        /* where to make a data call for points/events */

        this.eventsattended = sr.getElementById('eventsattended');
        this.eventsattended.innerHTML = customElement.getAttribute('events');
        this.pointearned = sr.getElementById('pointearned');
        this.pointearned.innerHTML = customElement.getAttribute('points');
        this.name = sr.getElementById('name');
        this.name.innerHTML = customElement.getAttribute('name');
    }
}

try {
    customElements.define('account-element', Account);
} catch (err) {
    const h3 = document.createElement('h3')
    h3.innerHTML = err
    document.body.appendChild(h3)
}