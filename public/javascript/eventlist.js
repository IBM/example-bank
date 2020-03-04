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

            var button = document.createElement('button');
            button.className = 'signup';
            button.innerHTML = component.buttonName;
            button.eventdata = event;
            button.onclick = function(){
                var event = new Event(component.eventid, {
                    detail: {
                        issuedBy: this.buttonName,
                        eventData: this.eventdata
                    },
                    bubbles: true
                });
                this.dispatchEvent(event);
                console.log(this.eventdata);
            }

            var evt = document.createElement('div');
            evt.className = 'eventblock';
            evt.appendChild(component.createLabel('eventname', event.title));
            evt.appendChild(component.createLabel('eventdate', event.date));
            evt.appendChild(component.createLabel('eventpoints', event.points + ' EVENT POINTS'));
            evt.appendChild(component.createLabel('eventaddress', event.address));
            evt.appendChild(button);
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

        var sampledata = [{
            "title": "CITYJSCONF",
            "date": "MARCH 27, 2020",
            "points": 15,
            "address": "REGENT STREET THEATRE, LONDON"
        }, {
            "title": "BINARY DISTRICT ZERO PROOFS WORKSHOP",
            "date": "JUNE 12, 2020",
            "points": 15,
            "address": "TRUMAN BREWERY, BRICK LANE, E1"
        }, {
            "title": "CITYJSCONF",
            "date": "MARCH 27, 2020",
            "points": 15,
            "address": "REGENT STREET THEATRE, LONDON"
        }, {
            "title": "BINARY DISTRICT ZERO PROOFS WORKSHOP",
            "date": "JUNE 12, 2020",
            "points": 15,
            "address": "TRUMAN BREWERY, BRICK LANE, E1"
        }]

        this.showEvents(sampledata);
    }
}

try {
    customElements.define('event-list', EventList);
} catch (err) {
    const h3 = document.createElement('h3')
    h3.innerHTML = err
    document.body.appendChild(h3)
}