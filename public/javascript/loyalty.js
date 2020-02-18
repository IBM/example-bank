function signup(){
    console.log('signup');

    var mobileview = document.getElementById("mobileview");
    mobileview.innerHTML = "";
    mobileview.innerHTML = "<login-element></login-element>"

}

function create(){
    console.log('create');

    var mobileview = document.getElementById("mobileview");
    mobileview.innerHTML = "";
    mobileview.innerHTML = "<account-element></account-element>"

}

function hitBox(){
    console.log('hitbox');
    var button = document.getElementById('createAccountButton');
    button.disabled = false;
}