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

    createAccount(){
        console.log('login.createAccount');

        var mobileview = document.getElementById("mobileview");
        mobileview.innerHTML = "";
        mobileview.innerHTML = "<account-element></account-element>"
    
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