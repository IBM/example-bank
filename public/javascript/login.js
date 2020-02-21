class Login extends HTMLElement {

    static get observedAttributes() {
        return ['firstname', 'surname'];
      }

    constructor() {
        // Always call super first in constructor
        super();

        let template = document.getElementById('loginview');
        let templateContent = template.content;

        const shadow = this.attachShadow({mode: 'open'})
          .appendChild(templateContent.cloneNode(true));         
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