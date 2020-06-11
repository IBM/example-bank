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
        let sr = this.shadowRoot
        var firstname = sr.getElementById('firstname').innerHTML;
        var surname = sr.getElementById('surname').innerHTML;
        var email = sr.getElementById('email').innerHTML;

        var phoneview = document.getElementById("phoneview");
        var mobileview = phoneview.getMobileView();
        this.MODE = this.getAttribute('mode')
        let previousMobileView = mobileview.innerHTML
        mobileview.innerHTML = "";

        // create loading spinner first
        var element = document.createElement('loading-spinner-element');
        element.setAttribute("status", "Creating account...")
        mobileview.appendChild(element)

        createAccountAppId(firstname, surname, firstname + "" + surname, email, (json) => {
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
            } else { 
                // edge case when failed to register with app id
                element.setAttribute("status", json.message)
                setTimeout(() => {
                    mobileview.innerHTML = previousMobileView
                }, 2000)
            }
        })
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

        var ids = ['firstname', 'surname', 'password', 'username', 'email'];

        var sr = this.shadowRoot;
        var customElement = this;

        ids.forEach(function(id){
            var element = sr.getElementById(id);
            var data =  customElement.getAttribute(id);
            element.innerHTML = data;
        })
        let firstnameDiv = sr.getElementById('firstname')
        let surnameDiv = sr.getElementById('surname')
        let usernameDiv = sr.getElementById('username')
        let passwordDiv = sr.getElementById('password')
        let emailDiv = sr.getElementById('email')
        firstnameDiv.addEventListener('input', function () {
            usernameDiv.innerHTML = this.innerHTML + surnameDiv.innerHTML
            passwordDiv.innerHTML = this.innerHTML.replace(/./g,'*') + surnameDiv.innerHTML.replace(/./g,'*')
            emailDiv.innerHTML = this.innerHTML + "@" + surnameDiv.innerHTML + ".org"
        })
        surnameDiv.addEventListener('input', function () {
            usernameDiv.innerHTML = firstnameDiv.innerHTML + this.innerHTML
            passwordDiv.innerHTML = firstnameDiv.innerHTML.replace(/./g,'*') + this.innerHTML.replace(/./g,'*')
            emailDiv.innerHTML = firstnameDiv.innerHTML + "@" + this.innerHTML + ".org"
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
