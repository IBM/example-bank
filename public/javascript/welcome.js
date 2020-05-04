class Welcome extends HTMLElement {

    mode='INTEGRATED';

    static get observedAttributes() {
        return ['mode'];
    }

    constructor() {
        
        super();        

        console.log('INITIALIZING WELCOME VIEW');

        let template = document.getElementById('welcomeview');
        let templateContent = template.content;

        const shadow = this.attachShadow({mode: 'open'})
          .appendChild(templateContent.cloneNode(true));
       
    }

    connectedCallback() {
        
        this.mode = this.getAttribute('mode');

        let sr = this.shadowRoot;

        let selectUserInput = sr.getElementById("usernameselect")
        let signinButton = sr.getElementById("signin")

        if(this.mode=='INTEGRATED'){

            getAllUsers((users) => {
                users.forEach(user => {
                    var option = document.createElement("option");
                    option.text = user
                    selectUserInput.add(option)
                });
            })
        }

        signinButton.addEventListener("click", e => {
            this.signin(selectUserInput.value, selectUserInput.value)
        })
    }


    signin(username, password) {
        let sr = this.shadowRoot;
        
        var mobileview = sr.host.parentElement;
        mobileview.innerHTML = "";

        if(this.mode=='INTEGRATED'){
            // create loading spinner first
            var element = document.createElement('loading-spinner-element');
            element.setAttribute("status", "Logging in...")
            mobileview.appendChild(element)

            loginWithAppId(username, password, (jsonWebToken) => {
                // when login complete,
                // re-initialize app?
                new Loyalty(this.mode);
                // edge case when unable to sign in
            })
         }else{
            new Loyalty(this.mode);
         }
    }
}

try {
    customElements.define('welcome-element', Welcome);
} catch (err) {
    const h3 = document.createElement('h3')
    h3.innerHTML = err
    document.body.appendChild(h3)
}
