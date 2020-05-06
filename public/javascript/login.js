class Login extends HTMLElement {

    MODE = 'DEVMODE';

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

        var phoneview = document.getElementById("phoneview");
        var mobileview = phoneview.getMobileView();
        this.MODE = this.getAttribute('mode')
        mobileview.innerHTML = "";

        if(this.MODE=='INTEGRATED'){

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
                        // and login complete, create the profile
                        element.setAttribute("status", "Creating user profile...")
                        createProfile(jsonWithTokens.access_token, success => {
                            // then show account view
                            if (success) {
                                this.createTransactionsView(firstname, surname)
                            }
                            // else edge case when failed to create user profile
                        })
                        // edge case when unable to sign in
                    })
                }
                // edge case when failed to register with app id
        })
      }else{
          console.log('LOGIN RUNNING IN DEV MODE');
      }
    }

    createTransactionsView(firstname, surname) {
        var accountinfo ={
            firstname:firstname,
            surname: surname
        }

        var fullname = accountinfo.firstname + ' ' + accountinfo.surname

        var phoneview = document.getElementById("phoneview");
        var mobileview = phoneview.getMobileView();
        let element = document.createElement('transactions-element')
        element.setAttribute('name', fullname);
        element.setAttribute('mode', this.MODE);
        mobileview.innerHTML = "";
        mobileview.appendChild(element);

        localStorage.setItem("loyaltyname", fullname);

        phoneview.showNavigation();
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
