class Login extends HTMLElement {

    static get observedAttributes() {
        return ['firstname', 'surname'];
      }

    clickCheck(){
        console.log('login.clickCheck');
        if(this.checkbox.checked){
            this.createAccountButton.disabled = false;
        }else{
            this.createAccountButton.disabled = true;
        }
    }

    createAccount() {
        console.log('login.createAccount');

        /* where to make a data call for points/events */

        var firstname = this.getAttribute('firstname');
        var surname = this.getAttribute('surname');
        var password = this.getAttribute('password')
        var email = this.getAttribute('username')

        var mobileview = document.getElementById("mobileview");
        mobileview.innerHTML = "";

        // create loading spinner first
        var element = document.createElement('loading-spinner-element');
        element.setAttribute("status", "Creating account...")
        mobileview.appendChild(element)

        createAccountAppId(firstname, surname, password, email, (json) => {
            console.log(json)
            if (json.status == "user created successfully") {

                element.setAttribute("status", "Logging in...")
                let usernamepassword = firstname + "" + surname
                loginWithAppId(usernamepassword, usernamepassword, (jsonWithTokens) => {
                    // when creation of account
                    // and login complete, create the account view
                    this.createAccountView(firstname, surname)
                })
            }
        })
    }

    createAccountView(firstname, surname) {
        var accountinfo ={
            events:7,
            points:42,
            firstname:firstname,
            surname: surname
        }

        var fullname = accountinfo.firstname + ' ' + accountinfo.surname

        var mobileview = document.getElementById("mobileview");
        mobileview.innerHTML = "";
        mobileview.innerHTML = '<account-element events="' + accountinfo.events +
        '" points="' + accountinfo.points +
        '" name="' + fullname + '"></account-element>'

        localStorage.setItem("loyaltyevents", accountinfo.events);
        localStorage.setItem("loyaltypoints", accountinfo.points);
        localStorage.setItem("loyaltyname", fullname);

        var nav = document.getElementById("mobilenavigation");
        nav.style.display = "flex";
    }

    constructor() {
        // Always call super first in constructor
        super();

        let template = document.getElementById('loginview');
        let templateContent = template.content;

        const shadow = this.attachShadow({mode: 'open'})
          .appendChild(templateContent.cloneNode(true));

        var sr = this.shadowRoot;

        this.checkbox = sr.getElementById('gdprcheck');

        this.checkbox.addEventListener('click', e => {
            this.clickCheck();
        });

        this.createAccountButton = sr.getElementById('createAccountButton');

        this.createAccountButton.addEventListener('click', e =>{
            this.createAccount();
        });

    }

    connectedCallback(){

        var ids = ['firstname', 'surname', 'password', 'username'];

        var sr = this.shadowRoot;
        var customElement = this;

        ids.forEach(function(id){
            var element = sr.getElementById(id);
            var data =  customElement.getAttribute(id);
            element.innerHTML = data;
        })
      }
}

try {
    customElements.define('login-element', Login);
} catch (err) {
    const h3 = document.createElement('h3')
    h3.innerHTML = err
    document.body.appendChild(h3)
}
