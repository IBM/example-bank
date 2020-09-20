class Welcome extends HTMLElement {

    constructor() {
        
        super();        

        console.log('INITIALIZING WELCOME VIEW');

        let template = document.getElementById('welcomeview');
        let templateContent = template.content;

        const shadow = this.attachShadow({mode: 'open'})
          .appendChild(templateContent.cloneNode(true));
       
    }

    connectedCallback() {

        let sr = this.shadowRoot;

        let selectUserInput = sr.getElementById("usernameselect")
        let signinButton = sr.getElementById("signin")

        var phoneview = document.getElementById("phoneview");
        var mobileview = phoneview.getMobileView();

        if (loyalty.getCookie('access_token') != "" && loyalty.getCookie('id_token') != "") {
            let id_object = loyalty.parseJwt(loyalty.getCookie('id_token'))
            console.log(id_object)

            var accountinfo = {
                firstname: id_object.given_name,
                surname: id_object.family_name
            }

            var fullname = accountinfo.firstname + ' ' + accountinfo.surname

            mobileview.innerHTML = "";

            let element = document.createElement('transactions-element')
            element.setAttribute('name', fullname);
            mobileview.appendChild(element); 

            localStorage.setItem("loyaltyname", fullname);

            phoneview.showNavigation();
        } else {
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

        // create loading spinner first
        var element = document.createElement('loading-spinner-element');
        element.setAttribute("status", "Logging in...")
        mobileview.appendChild(element)

        loginWithAppId(username, password, (jsonWebToken) => {
            // when login complete,
            // re-initialize app?
            new Loyalty(this.mode);
            let id_object = loyalty.parseJwt(jsonWebToken.id_token)
            console.log(id_object)

            var accountinfo = {
                firstname: id_object.given_name,
                surname: id_object.family_name
            }

            var fullname = accountinfo.firstname + ' ' + accountinfo.surname

            mobileview.innerHTML = "";

            let element = document.createElement('transactions-element')
            element.setAttribute('name', fullname);
            mobileview.appendChild(element);

            localStorage.setItem("loyaltyname", fullname);

            phoneview.showNavigation();
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
