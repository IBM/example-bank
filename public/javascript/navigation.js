class Navigation extends HTMLElement {

    ACCOUNT = 0
    RESERVATION = 1
    EVENTS = 2

    SELECTEDVIEW = 0;

    clickAccount() {
        console.log('click account');
        
        var accountimg = this.accountsbutton.childNodes[0];
        accountimg.src = './images/account-selected.svg';

        var resimg = this.reservationsbutton.childNodes[0];
        resimg.src = './images/reservation-deselected.svg';

        var eventimg = this.eventsbutton.childNodes[0];
        eventimg.src = './images/eventlist-deselected.svg';

        this.SELECTEDVIEW = this.ACCOUNT;
    }

    clickReservation(){

        var accountimg = this.accountsbutton.childNodes[0];
        accountimg.src = './images/account-deselected.svg';

        var resimg = this.reservationsbutton.childNodes[0];
        resimg.src = './images/reservation-selected.svg';

        var eventimg = this.eventsbutton.childNodes[0];
        eventimg.src = './images/eventlist-deselected.svg';

        console.log('click reservation');

        this.SELECTEDVIEW = this.RESERVATION;
    }

    clickEvents(){
        console.log('click events');

        var accountimg = this.accountsbutton.childNodes[0];
        accountimg.src = './images/account-deselected.svg';

        var resimg = this.reservationsbutton.childNodes[0];
        resimg.src = './images/reservation-deselected.svg';

        var eventimg = this.eventsbutton.childNodes[0];
        eventimg.src = './images/eventlist-selected.svg';

        this.SELECTEDVIEW = this.EVENTS;
    }

    constructor() {
        // Always call super first in constructor
        super();

        let template = document.getElementById('navigationview');
        let templateContent = template.content;

        const shadow = this.attachShadow({
                mode: 'open'
            })
            .appendChild(templateContent.cloneNode(true));

        var sr = this.shadowRoot;

        this.accountsbutton = sr.getElementById('accountbutton');
        this.reservationsbutton = sr.getElementById('reservationsbutton');
        this.eventsbutton = sr.getElementById('eventsbutton');

        this.accountsbutton.addEventListener('click', e => {
            this.clickAccount();
        });

        this.reservationsbutton.addEventListener('click', e => {
            this.clickReservation();
        });

        this.eventsbutton.addEventListener('click', e => {
            this.clickEvents();
        });
    }
}

try {
    customElements.define('navigation-element', Navigation);
} catch (err) {
    const h3 = document.createElement('h3')
    h3.innerHTML = err
    document.body.appendChild(h3)
}