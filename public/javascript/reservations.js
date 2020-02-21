class Reservations extends HTMLElement {


    constructor() {
        // Always call super first in constructor
        super();

        let template = document.getElementById('reservationview');
        let templateContent = template.content;

        console.log('reservations view')

        const shadow = this.attachShadow({
                mode: 'open'
            })
            .appendChild(templateContent.cloneNode(true));
    }
}

try {
    customElements.define('reservations-element', Reservations);
} catch (err) {
    const h3 = document.createElement('h3')
    h3.innerHTML = err
    document.body.appendChild(h3)
}