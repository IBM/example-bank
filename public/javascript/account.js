class Account extends HTMLElement {

    events = ""
    points = ""
    name = ""

    constructor() {
        // Always call super first in constructor
        super();

        console.log('INITIALIZED ACCOUNT VIEW');
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


        let deleteButton = sr.getElementById("deleteAccountButton")
        deleteButton.addEventListener("click", e => {
                this.delete();
        })
    }

    logout() {
        // clear cookies of tokens
        document.cookie = "access_token=; Max-Age=0'"
        document.cookie = "id_token=; Max-Age=0'"

        // clear local storage
        localStorage.clear()

        var phoneview = document.getElementById("phoneview");
        var mobileview = phoneview.getMobileView();
        mobileview.innerHTML = "";
        var welcome = document.createElement('welcome-element')
        welcome.setAttribute('mode','INTEGRATED')
        mobileview.appendChild(welcome)

        phoneview.hideNavigation();
    }

    delete() {
        let phoneview = document.getElementById("phoneview");
        let mobileview = phoneview.getMobileView();
        mobileview.innerHTML = "";
        let element = document.createElement('loading-spinner-element');
        element.setAttribute("status", "Deleting account...")
        mobileview.appendChild(element)

        setTimeout(() => {
            deleteUserProfile(loyalty.getCookie('access_token'), success => {
                if (success) {
                    element.setAttribute("status", "Successfully deleted account. Logging out...")
                    setTimeout(() => {
                        this.logout();
                    }, 2500)
                }
            })
        }, 1500)
    }

    connectedCallback(){
        var customElement = this;
        var sr = this.shadowRoot;

        /* where to make a data call for points/events */

        this.mode = customElement.getAttribute('mode');
        this.events = customElement.getAttribute('events');
        this.points = customElement.getAttribute('points');

        if (this.events == null) {
            this.events = '-'
        }
        if (this.points == null) {
            this.points = '-'
        }

        this.name = customElement.getAttribute('name') || localStorage.getItem("loyaltyname")

        if(this.name == null){
            this.name = "";
        }else{
            console.log('SETTING NAME')
        }

        
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
