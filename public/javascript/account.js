class Account extends HTMLElement {

    static get observedAttributes() {
        return ['events', 'points'];
    }

    clickaccount() {
        console.log('this is a test');
    }

    events = ""
    points = ""
    name = ""

    constructor() {
        // Always call super first in constructor
        super();

        var customElement = this;

        let template = document.getElementById('accountview');
        let templateContent = template.content;



        const shadow = this.attachShadow({
                mode: 'open'
            })
            .appendChild(templateContent.cloneNode(true));

        let sr = this.shadowRoot;
        let logoutButton = sr.getElementById("logoutAccountButton")
        logoutButton.addEventListener("click", e => {
            this.logout();
        })
    }

    logout() {
        // clear cookies of tokens
        document.cookie = "access_token=; Max-Age=0'"
        document.cookie = "id_token=; Max-Age=0'"

        var mobileview = document.getElementById("mobileview");
        mobileview.innerHTML = "";
        var welcome = document.createElement('welcome-element')
        mobileview.appendChild(welcome)

        var nav = document.getElementById("mobilenavigation");
        nav.style.display = "none";
    }

    connectedCallback(){
        var customElement = this;
        var sr = this.shadowRoot;

        /* where to make a data call for points/events */

        this.events = customElement.getAttribute('events')

        if(this.events == null){
            console.log('no events parameters passed in')
            this.events = localStorage.getItem("loyaltyevents");

            if( this.events == null){
                console.log('no events parameters stored')
                this.events = "";
            }else{
                console.log('using stored events parameter')
            }

        }else{
            console.log('events parameter passed in')
        }

        this.points = customElement.getAttribute('points')

        if(this.points == null){
            console.log('no points parameters passed in')
            this.points = localStorage.getItem("loyaltypoints");

            if( this.points == null){
                console.log('no points parameters stored')
                this.points = "";
            }else{
                console.log('using stored points parameter')
            }
        }else{
            console.log('points parameter passed in')
        }

        this.name = customElement.getAttribute('name')

        if(this.name == null){
            console.log('no name parameters passed in')
            this.name = localStorage.getItem("loyaltyname");

            if( this.name == null){
                console.log('no name parameters stored')
                this.name = "";
            }else{
                console.log('using stored name parameter')
            }
        }else{
            console.log('name parameter passed in')
        }

        this.eventsattended = sr.getElementById('eventsattended');
        this.eventsattended.innerHTML = this.events;
        this.pointearned = sr.getElementById('pointearned');
        this.pointearned.innerHTML = this.points;
        this.nameelement = sr.getElementById('name');
        this.nameelement.innerHTML = this.name;
    }
}

try {
    customElements.define('account-element', Account);
} catch (err) {
    const h3 = document.createElement('h3')
    h3.innerHTML = err
    document.body.appendChild(h3)
}
