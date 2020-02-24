class Loyalty {

    constructor(details) {
        console.log('initializing loyalty app');
        this.details = details;
    }

    signup() {
        console.log('loyalty.signup');

        var mobileview = document.getElementById("mobileview");
        mobileview.innerHTML = "";

        var element = document.createElement('login-element');
        element.setAttribute('firstname', this.details.firstname);
        element.setAttribute('surname', this.details.surname);
        element.setAttribute('password', this.details.password);
        element.setAttribute('username', this.details.username);
        
        mobileview.appendChild(element);

        /* same as mobileview.innerHTML = 
        '<login-element firstname="John surname="Lennon" password="######" username="john@email.com"></login-element>' */
    }
}

var loyalty = new Loyalty({
    firstname: 'Paul',
    surname: 'McCartney',
    password: '######',
    username: 'paul@email.com'
});