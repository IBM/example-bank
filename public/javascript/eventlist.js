class EventList extends HTMLElement {

    static get observedAttributes() {
        return ['buttonname', 'dataendpoint', 'eventid'];
    }

    createLabel(classname, content) {
        var label = document.createElement('label');
        label.className = classname;
        label.innerHTML = content;
        return label;
    }

    buttonName = ""

    eventid = ""

    showEvents(eventdata) {

        var sr = this.shadowRoot;
        var anchor = sr.getElementById('eventanchor');
        var component = this;

        eventdata.forEach(function (event) {



            const date = new Date(event.startTime)
            const year = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(date)
            const month = new Intl.DateTimeFormat('en', { month: 'short' }).format(date)
            const day = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(date)

            var evt = document.createElement('div');
            evt.className = 'eventblock';
            evt.appendChild(component.createLabel('eventname', event.eventName));
            evt.appendChild(component.createLabel('eventdate', `${month} ${day} ${year}`));
            evt.appendChild(component.createLabel('eventpoints', event.pointValue + ' EVENT POINTS'));
            evt.appendChild(component.createLabel('eventaddress', event.eventLocation));

            if (component.buttonName != null) {
                var button = document.createElement('button');
                button.className = 'signup';
                button.innerHTML = component.buttonName;
                button.eventdata = event;
                button.onclick = function () {
                    var customEvent = new CustomEvent(component.eventid, {
                        detail: {
                            eventData: event,
                            element: () => evt
                        },
                        bubbles: true
                    });
                    component.dispatchEvent(customEvent);
                    console.log(event);
                }

                evt.appendChild(button);
            }

            anchor.appendChild(evt);
        })
    }

    constructor() {
        super();

        let template = document.getElementById('eventlist');
        let templateContent = template.content;

        console.log('events view')

        const shadow = this.attachShadow({
                mode: 'open'
            })
            .appendChild(templateContent.cloneNode(true));
    }

    connectedCallback() {

        /* first retrieve the event data here*/

        var customElement = this;
        var sr = this.shadowRoot;

        /* where to make a data call for points/events */

        this.buttonName = customElement.getAttribute('buttonname');
        this.eventid = customElement.getAttribute('eventid');

        switch (this.id) {
            case 'UPCOMINGEVENTS':
                let arrayOfEvents = getStoredEvents(loyalty.parseJwt(loyalty.getCookie('id_token')).sub)

                if (arrayOfEvents == null) arrayOfEvents = []
                // sort
                let sortedArray = arrayOfEvents.sort((a, b) => (new Date(a.startTime) > new Date(b.startTime)) ? 1 : -1)

                this.showEvents(sortedArray)
                break
            case 'ALLEVENTS':
                getUserEvents(loyalty.getCookie('access_token'), (err, checkedInUserEvents) => {
                    getEvents(loyalty.getCookie('access_token'), (err, events) => {
                        let eventsOfArray = []
                        let storedEvents = getStoredEvents(loyalty.parseJwt(loyalty.getCookie('id_token')).sub)
                        // map array into eventIds only
                        if (storedEvents != null) {
                            storedEvents = storedEvents.map(e => e.eventId)
                        } else {
                            storedEvents = []
                        }
                        for (var i in events) {
                            // dont show events that user has checked in already or stored already
                            if (!checkedInUserEvents.includes(i) && !storedEvents.includes(i)) {
                                // add event id in body
                                events[i].eventId = i
                                eventsOfArray.push(events[i])
                            }
                        }

                        let sortedArray = eventsOfArray.sort((a, b) => (new Date(a.startTime) > new Date(b.startTime)) ? 1 : -1)
                        // console.log(sortedArray)
                        this.showEvents(sortedArray)
                    })
                })
                break
            case 'PASTEVENTS':
                getUserEventsWithData(loyalty.getCookie('access_token'), (err, events) => {
                    let eventsOfArray = []

                    for (var i in events ) {
                        // add event id in body
                        events[i].eventId = i
                        eventsOfArray.push(events[i])
                    }

                    let sortedArray = eventsOfArray.sort((a, b) => (new Date(a.startTime) > new Date(b.startTime)) ? 1 : -1)
                    this.showEvents(sortedArray)
                })
                break
            default:
                break
        }

        // var sampledata = [{
        //     "title": "CITYJSCONF",
        //     "date": "MARCH 27, 2020",
        //     "points": 15,
        //     "address": "REGENT STREET THEATRE, LONDON"
        // }, {
        //     "title": "BINARY DISTRICT ZERO PROOFS WORKSHOP",
        //     "date": "JUNE 12, 2020",
        //     "points": 15,
        //     "address": "TRUMAN BREWERY, BRICK LANE, E1"
        // }, {
        //     "title": "CITYJSCONF",
        //     "date": "MARCH 27, 2020",
        //     "points": 15,
        //     "address": "REGENT STREET THEATRE, LONDON"
        // }, {
        //     "title": "BINARY DISTRICT ZERO PROOFS WORKSHOP",
        //     "date": "JUNE 12, 2020",
        //     "points": 15,
        //     "address": "TRUMAN BREWERY, BRICK LANE, E1"
        // }]

        // this.showEvents(sampledata);
    }
}

try {
    customElements.define('event-list', EventList);
} catch (err) {
    const h3 = document.createElement('h3')
    h3.innerHTML = err
    document.body.appendChild(h3)
}
