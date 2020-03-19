class Reservations extends HTMLElement {

    UPCOMINGVIEW = 0;
    PASTVIEW = 1;

    selectedView = this.UPCOMINGVIEW;

    pastEvents(){
        console.log('pastEvents');
        this.selectedView = this.PASTVIEW;
        var sr = this.shadowRoot;
        var upcomingcomponent = sr.getElementById('UPCOMINGEVENTS');
        upcomingcomponent.style.display = 'none';
        var pastcomponent = sr.getElementById('PASTEVENTS');
        pastcomponent.style.display = '';
        this.pastButton.className = 'rescontrol';
        this.upcomingButton.className = 'rescontroldim';
    }

    upcomingEvents(){
        console.log('upcomingEvents');
        this.selectedView = this.UPCOMINGVIEW;
        var sr = this.shadowRoot;
        var eventscomponent = sr.getElementById('UPCOMINGEVENTS');
        var upcomingcomponent = sr.getElementById('UPCOMINGEVENTS');
        upcomingcomponent.style.display = '';
        var pastcomponent = sr.getElementById('PASTEVENTS');
        pastcomponent.style.display = 'none';
        this.pastButton.className = 'rescontroldim';
        this.upcomingButton.className = 'rescontrol';
    }

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

    connectedCallback() {

        var sr = this.shadowRoot;
        var eventscomponent = sr.getElementById('UPCOMINGEVENTS');
        var pasteventscomponent = sr.getElementById('PASTEVENTS');
        var eventid = eventscomponent.getAttribute('eventid');

        this.pastButton = sr.getElementById('pastbutton');
        this.upcomingButton = sr.getElementById('upcomingbutton');

        this.pastButton.addEventListener('click', e => {
            this.pastEvents();
        });

        this.upcomingButton.addEventListener('click', e => {
            this.upcomingEvents();
        });

        console.log('EVENTID: ' + eventid);

        eventscomponent.addEventListener(eventid, e => {
            console.log('received custom event from ' + eventid);
            console.log("Checking in - " + e.detail.eventData.eventId)
            checkInEvent(loyalty.getCookie('access_token'), e.detail.eventData.eventId, bool => {
                if (bool) {
                    // remove event item
                    let eventItemElement = e.detail.element()
                    eventItemElement.parentNode.removeChild(eventItemElement)
                    // remove event from local storage too
                    removeStoredEvent(loyalty.parseJwt(loyalty.getCookie('id_token')).sub, e.detail.eventData.eventId)

                    // re-attach the past event to trigger new data from server
                    let pasteventelementparent = pasteventscomponent.parentNode
                    let pasteventelement = pasteventscomponent
                    pasteventelementparent.removeChild(pasteventelement)
                    pasteventelementparent.appendChild(pasteventelement)

                }
            })
        });
    }
}

try {
    customElements.define('reservations-element', Reservations);
} catch (err) {
    const h3 = document.createElement('h3')
    h3.innerHTML = err
    document.body.appendChild(h3)
}
