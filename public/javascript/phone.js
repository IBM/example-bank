class Phone extends HTMLElement {

    mode = 'DEVMODE';
    // mode = 'INTEGRATED';

    constructor() {
        super();

        console.log('INITIALIZING MOBILE PHONE');

        let template = document.getElementById('phone');
        let templateContent = template.content;
        const shadow = this.attachShadow({
                mode: 'open'
            })
            .appendChild(templateContent.cloneNode(true));            
    }

    getMobileView(){
        var sr = this.shadowRoot;
        var mobileview = sr.getElementById('mobileview');
        return mobileview;
    }

    showNavigation(){
        var sr = this.shadowRoot;
        var nav = sr.getElementById("mobilenavigation");
        nav.style.display = "flex";
    }

    hideNavigation(){
        var sr = this.shadowRoot;
        var nav = sr.getElementById("mobilenavigation");
        nav.style.display = "none";
    }
    
    connectedCallback() {
        var sr = this.shadowRoot;
        var basebutton = sr.getElementById('basebutton');
        var mobileview = sr.getElementById('mobileview');
        var apptiles = sr.getElementById('APPTILES');
        basebutton.addEventListener('click', e => {
            mobileview.innerHTML = '<homescreen-element id="HOMESCREEN"></homescreen-element>';
        });

        // var homescreen = sr.getElementById('HOMESCREEN');

        // homescreen.addEventListener('APPTILE', e => {
        //     console.log('HOMESCREEN RECIEVED EVENT FROM TILE: ' + e.detail.eventData.toLocaleUpperCase());
            
        //     switch(e.detail.eventData){

        //         case 'bank':
        //             mobileview.innerHTML = '<welcome-element mode="' + this.mode + '"></welcome-element>';
        //             break;

        //         default:
        //             break;
        //     }
        // });

    }
}

try {
    customElements.define('phone-element', Phone);
} catch (err) {
    const h3 = document.createElement('h3')
    h3.innerHTML = err
    document.body.appendChild(h3)
}
