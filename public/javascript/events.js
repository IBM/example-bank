class Events extends HTMLElement {

    createLabel(classname, content) {
        var label = document.createElement('label');
        label.className = classname;
        label.innerHTML = content;
        return label;
    }

    showEvents(eventdata) {

        var sr = this.shadowRoot;
        var anchor = sr.getElementById('eventanchor');
        var component = this;

        eventdata.forEach(function (event) {
            var evt = document.createElement('div');
            evt.className = 'eventblock';
            evt.appendChild(component.createLabel('eventname', event.title));
            evt.appendChild(component.createLabel('eventdate', event.date));
            evt.appendChild(component.createLabel('eventpoints', event.points + ' EVENT POINTS'));
            evt.appendChild(component.createLabel('eventaddress', event.address));
            anchor.appendChild(evt);
        })
    }

    constructor() {
        super();

        let template = document.getElementById('eventview');
        let templateContent = template.content;

        console.log('events view')

        const shadow = this.attachShadow({
                mode: 'open'
            })
            .appendChild(templateContent.cloneNode(true));
    }

    connectedCallback() {

        /* first retrieve the event data here*/

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
    customElements.define('events-element', Events);
} catch (err) {
    const h3 = document.createElement('h3')
    h3.innerHTML = err
    document.body.appendChild(h3)
}