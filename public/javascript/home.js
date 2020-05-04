class Home extends HTMLElement {

    mode = 'DEVMODE';
    // mode = 'INTEGRATED';

    constructor() {
        super();

        console.log('INITIALIZING HOMESCREEN');

        let template = document.getElementById('homescreen');
        let templateContent = template.content;
        const shadow = this.attachShadow({
                mode: 'open'
            })
            .appendChild(templateContent.cloneNode(true));            
    }

    connectedCallback() {
       
        var sr = this.shadowRoot;

        var tiles = sr.getElementById('APPTILES');

        tiles.addEventListener('APPTILE', e => {
            console.log('HOMESCREEN RECIEVED EVENT FROM TILE: ' + e.detail.eventData.toLocaleUpperCase());
            
            switch(e.detail.eventData){

                case 'bank':
                    // var frame = sr.parentElement.parentElement
                    // var mobilenav = frame.getElementById('mobilenavigation');
                    // mobilenav.style.display = 'none';
                    sr.host.parentElement.innerHTML = '<welcome-element mode="' + this.mode + '"></welcome-element>';
                    break;

                default:
                    break;
            }
        });
    }
}

try {
    customElements.define('homescreen-element', Home);
} catch (err) {
    const h3 = document.createElement('h3')
    h3.innerHTML = err
    document.body.appendChild(h3)
}
