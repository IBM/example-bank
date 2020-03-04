class Loyalty {

    constructor(details) {
        console.log('initializing loyalty app');
        this.details = details;

        // if cookie exists - then user is logged in
        //  navigate to account section
        if (this.getCookie('access_token') != "" && this.getCookie('id_token') != "") {
            let id_object = this.parseJwt(this.getCookie('id_token'))
            console.log(id_object)

            var accountinfo = {
                events:7,
                points:42,
                firstname: id_object.given_name,
                surname: id_object.family_name
            }

            var fullname = accountinfo.firstname + ' ' + accountinfo.surname

            var mobileview = document.getElementById("mobileview");
            mobileview.innerHTML = "";

            let element = document.createElement('account-element')
            element.setAttribute('events', accountinfo.events)
            element.setAttribute('points', accountinfo.points)
            element.setAttribute('name', fullname)
            mobileview.appendChild(element)

            localStorage.setItem("loyaltyevents", accountinfo.events);
            localStorage.setItem("loyaltypoints", accountinfo.points);
            localStorage.setItem("loyaltyname", fullname);

            var nav = document.getElementById("mobilenavigation");
            nav.style.display = "flex";
        }
    }

    signup() {
        console.log('loyalty.signup');

        var mobileview = document.getElementById("mobileview");
        mobileview.innerHTML = "";

        var element = document.createElement('login-element');

        getRandomUser((firstname, surname, password, email) => {
            element.setAttribute('firstname', firstname);
            element.setAttribute('surname', surname);
            element.setAttribute('password', password);
            element.setAttribute('username', email);

            mobileview.appendChild(element);
        })

        /* same as mobileview.innerHTML =
        '<login-element firstname="John surname="Lennon" password="######" username="john@email.com"></login-element>' */
    }

    parseJwt (token) {
        var base64Url = token.split('.')[1];
        var base64 = base64Url.replace('/-/g', '+').replace('/_/g', '/');
        var jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        return JSON.parse(jsonPayload);
    };

    getCookie(cname) {
        var name = cname + "=";
        var decodedCookie = decodeURIComponent(document.cookie);
        var ca = decodedCookie.split(';');
        for(var i = 0; i <ca.length; i++) {
          var c = ca[i];
          while (c.charAt(0) == ' ') {
            c = c.substring(1);
          }
          if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
          }
        }
        return "";
      }
}

var loyalty = new Loyalty({
    firstname: 'Paul',
    surname: 'McCartney',
    password: '######',
    username: 'paul@email.com'
});
