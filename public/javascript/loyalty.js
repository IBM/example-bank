function signup(){
    console.log('signup');

    var mobileview = document.getElementById("mobileview");
    mobileview.innerHTML = "";

    var element = document.createElement('login-element');
    element.setAttribute('firstname','Paul');
    element.setAttribute('surname','McCartney');
    element.setAttribute('password','######');
    element.setAttribute('username','paul@email.com');
    mobileview.appendChild(element);

    // mobileview.innerHTML = '<login-element firstname="John surname="Lennon" password="######" username="john@email.com"></login-element>'
}

function create(){
    console.log('create');

    var mobileview = document.getElementById("mobileview");
    mobileview.innerHTML = "";
    mobileview.innerHTML = "<account-element></account-element>"

    var nav = document.getElementById("mobilenavigation");
    nav.style.display = "flex";

}

function hitBox(){
    console.log('hitbox');
    var button = document.getElementById('createAccountButton');
    button.disabled = false;
}

function clickAccount(){
    console.log('hello')
}

var mobileapp = document.getElementById('mobileapp')

mobileapp.addEventListener('build', function (e) { console.log('received event') }, false);