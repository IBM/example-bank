class Welcome extends HTMLElement {

    constructor() {
        // Always call super first in constructor
        super();

        // write element functionality in here

        // var shadow = this.attachShadow({
        //     mode: 'open'
        // });

        // Create spans
        // var wrapper = document.createElement('span');
        // wrapper.setAttribute('class', 'wrapper');

        // wrapper.innerHTML = view;
        // Take attribute content and put it inside the info span
        // var text = this.getAttribute('text');
        // info.textContent = text;

        let template = document.getElementById('welcomeview');
        let templateContent = template.content;

        const shadow = this.attachShadow({mode: 'open'})
          .appendChild(templateContent.cloneNode(true));

        // shadow.appendChild(wrapper);
        // wrapper.appendChild(info);
        let sr = this.shadowRoot;

        let selectUserInput = sr.getElementById("usernameselect")
        let signinButton = sr.getElementById("signin")

        getAllUsers((users) => {
            users.forEach(user => {
                var option = document.createElement("option");
                option.text = user
                selectUserInput.add(option)
            });
        })

        signinButton.addEventListener("click", e => {
            this.signin(selectUserInput.value, selectUserInput.value)
        })
    }

    signin(username, password) {
        var mobileview = document.getElementById("mobileview");
        mobileview.innerHTML = "";

        // create loading spinner first
        var element = document.createElement('loading-spinner-element');
        element.setAttribute("status", "Logging in...")
        mobileview.appendChild(element)

        loginWithAppId(username, password, (jsonWebToken) => {
            // when login complete,
            // re-initialize app?
            new Loyalty();
            // edge case when unable to sign in
        })
    }

}

try {
    customElements.define('welcome-element', Welcome);
} catch (err) {
    const h3 = document.createElement('h3')
    h3.innerHTML = err
    document.body.appendChild(h3)
}
