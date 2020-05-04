class Transaction extends HTMLElement {

    observables = ['vendor', 'date', 'amount', 'points'];

    static get observedAttributes() {
        return observables;
    }

    constructor() {
        super();

        let template = document.getElementById('transaction');
        let templateContent = template.content;

        const shadow = this.attachShadow({
                mode: 'open'
            })
            .appendChild(templateContent.cloneNode(true));
    }

    connectedCallback() {

        var sr = this.shadowRoot;

        var transactionComponent = this;

        console.log('LOADING TRANSACTION DATA');

        this.observables.forEach(function(id){
            var element = sr.getElementById(id);
            element.innerHTML = transactionComponent.getAttribute(id);
        })

       

        // eventscomponent.addEventListener(eventid, e => {
        //     console.log(e.detail)
        //     let id_object = loyalty.parseJwt(loyalty.getCookie('id_token'))
        //     attendEvent(id_object.sub, e.detail.eventData)
        //     // re-attach this component
        //     let container = this.parentElement
        //     let content = container.innerHTML
        //     container.innerHTML = content
        // });
    }
}

try {
    customElements.define('transaction-element', Transaction);
} catch (err) {
    const h3 = document.createElement('h3')
    h3.innerHTML = err
    document.body.appendChild(h3)
}
