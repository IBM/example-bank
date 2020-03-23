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

        // clear local storage
        localStorage.clear()

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
        this.points = customElement.getAttribute('points')

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
            console.log('name parameter passed in')
        }

        this.eventsattended = sr.getElementById('eventsattended');
        this.eventsattended.innerHTML = this.events;
        this.pointearned = sr.getElementById('pointearned');
        this.pointearned.innerHTML = this.points;
        this.nameelement = sr.getElementById('name');
        this.nameelement.innerHTML = this.name;

        // test
        // getEvents(loyalty.getCookie('access_token'), (err, events) => {
        //     Object.keys(events).forEach(id => {
        //         let event = events[id]
        //         console.log(event)
        //     })
        // })

        // test
        // getUserEvents(loyalty.getCookie('access_token'), (err, events) => {
        //     console.log(events)
        // })

        getUserStats(loyalty.getCookie('access_token'), (err, eventCount, pointsEarned) => {
            // if user is not registered (user profile is not in database)
            // create one for user
            if (err == 'User is not registered') {
                let mobileview = document.getElementById("mobileview");
                mobileview.innerHTML = "";
                let element = document.createElement('loading-spinner-element');
                element.setAttribute("status", "Creating user profile...")
                mobileview.appendChild(element)

                createProfile(loyalty.getCookie('access_token'), success => {
                    // then re-initialize app
                    if (success) {
                        new Loyalty()
                    }
                    // else edge case when failed to create user profile
                })
            }
            if (eventCount != null) customElement.setAttribute('events', eventCount)
            if (pointsEarned != null) customElement.setAttribute('points', pointsEarned)
        })
    }

    attributeChangedCallback(name, oldValue, newValue) {
        console.log('account attribute changed callback')

        if (name == 'events') {
            console.log('events changed')
            this.shadowRoot.getElementById('eventsattended').innerHTML = newValue
        } else if (name == 'points') {
            console.log('points changed')
            this.shadowRoot.getElementById('pointearned').innerHTML = newValue
        }
    }
}

try {
    customElements.define('account-element', Account);
} catch (err) {
    const h3 = document.createElement('h3')
    h3.innerHTML = err
    document.body.appendChild(h3)
}
