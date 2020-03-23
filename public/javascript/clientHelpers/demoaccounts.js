function loginWithAppId(username, password, callback) {
    let jsonBody = {username, password}

    fetch("/demo/login", {
        method: 'POST',
        headers: {
            'Content-type': 'application/json',
        },
        body: JSON.stringify(jsonBody)
    }).then((response) => {
        console.log(response)
        return response.json();
    }).then((json) => {
        console.log(json)
        callback(json)
    }).catch((error) => {
        callback(null)
    })
}

function getRandomUser(callback) {
    fetch("/demo/random_user")
        .then((response) => {
            return response.text()
        })
        .then((text) => {
            let name = text.split(' ')
            let firstname = name[0]
            let surname = name[1]
            let password = name[0] + name[1]
            let email = name[0] + "@" + name[1] + ".org"
            callback(firstname, surname, password, email)
        })
}

function createAccountAppId(firstname, lastname, password, email, callback) {
    let jsonRequestBody = {}
    jsonRequestBody.firstName = firstname
    jsonRequestBody.lastName = lastname
    jsonRequestBody.password = password
    jsonRequestBody.email = email

    fetch('/demo/create_account', {
        method: 'POST',
        headers: {
        'Content-type': 'application/json'
        },
        body: JSON.stringify(jsonRequestBody)
    }).then((response) => {
        console.log(response)
        return response.json()
    }).then((json) => {
        callback(json)
    })
}

function getAllUsers(callback) {
    fetch('/demo/get_all_users')
    .then((response) => {
        return response.json()
    }).then((users) => {
        callback(users)
    })
}

// sample appid account
// loginWithAppId("RolandeColla", "RolandeColla")
