let SECURE_USER_BACKEND_URL='/proxy_user'
let SECURE_EVENT_BACKEND_URL='/proxy_transaction'

function createProfile(access_token, callback) {
    let jsonRequestBody = {}
    jsonRequestBody.consentGiven = true

    fetch(SECURE_USER_BACKEND_URL + '/bank/v1/users', {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer ' + access_token,
            'Content-type': 'application/json'
        },
        body: JSON.stringify(jsonRequestBody)
    }).then((response) => {
        if (response.status == '204') {
            callback(true)
        } else {
            callback(false)
        }
    })
}

function getUserStats(access_token, callback) {
    fetch(SECURE_USER_BACKEND_URL + '/bank/v1/userEvents/self/info', {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + access_token
        }
    }).then(async (response) => {
        if (response.status == '200') {
            return response.json()
        } else {
            let responsetext = await response.text()
            console.log(responsetext)
            throw responsetext
        }
    }).then((json) => {
        callback(null, json.eventCount, json.pointsEarned)
    }).catch(e => {
        console.log(e)
        callback(e, null, null)
    })
}

function getUserEvents(access_token, callback) {
    fetch(SECURE_USER_BACKEND_URL + '/bank/v1/userEvents/self', {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + access_token
        }
    }).then(async (response) => {
        if (response.status == '200') {
            return response.json()
        } else {
            let responsetext = await response.text()
            console.log(responsetext)
            throw responsetext
        }
    }).then((events) => {
        callback(null, events)
    }).catch(e => {
        console.log(e)
        callback(e, null)
    })
}

function getUserEventsWithData(access_token, callback) {
    getUserEvents(access_token, (err, events) => {
        let queryParams = ''

        if (events.length == 0) {
            callback(null, events)
        } else {
            events.forEach(element => {
                queryParams += 'id=' + element + '&'
            });

            fetch(SECURE_EVENT_BACKEND_URL + '/bank/v1/events?' + queryParams, {
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + access_token
                }
            }).then(async (response) => {
                console.log(response)
                if (response.status == '200') {
                    return response.json()
                } else {
                    let responsetext = await response.text()
                    console.log(responsetext)
                    throw responsetext
                }
            }).then((events) => {
                callback(null, events)
            }).catch(e => {
                callback(e, null)
            })

        }
    })
}

function getEvents(access_token, callback) {
    fetch(SECURE_EVENT_BACKEND_URL + '/bank/v1/events', {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + access_token
        }
    }).then(async (response) => {
        if (response.status == '200') {
            return response.json()
        } else {
            let responsetext = await response.text()
            console.log(responsetext)
            throw responsetext
        }
    }).then((events) => {
        callback(null, events)
    }).catch(e => {
        console.log(e)
        callback(e, null)
    })
}

function checkInEvent(access_token, eventId, callback) {
    let jsonRequestBody = {}
    jsonRequestBody.eventId = eventId

    fetch(SECURE_USER_BACKEND_URL + '/bank/v1/userEvents', {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer ' + access_token,
            'Content-type': 'application/json'
        },
        body: JSON.stringify(jsonRequestBody)
    }).then((response) => {
        console.log(response)
        if (response.status == '204') {
            callback(true)
        } else {
            callback(false)
        }
    })
}

function deleteUserProfile(access_token, callback) {
    fetch(SECURE_USER_BACKEND_URL + '/bank/v1/users/self', {
        method: 'DELETE',
        headers: {
            'Authorization': 'Bearer ' + access_token
        }
    }).then((response) => {
        console.log(response)
        if (response.status == '204') {
            callback(true)
        } else {
            callback(false)
        }
    })
}

function getTransactions(access_token, callback) {
    fetch(SECURE_EVENT_BACKEND_URL + '/bank/v1/transactions', {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + access_token
        }
    }).then(async (response) => {
        if (response.status == '200') {
            return response.json()
        } else {
            let responsetext = await response.text()
            console.log(responsetext)
            throw responsetext
        }
    }).then((transactions) => {
        callback(null, transactions)
    }).catch(e => {
        console.log(e)
        callback(e, null)
    })
}

function getSpending(access_token, callback) {
    fetch(SECURE_EVENT_BACKEND_URL + '/bank/v1/transactions/spending', {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + access_token
        }
    }).then(async (response) => {
        if (response.status == '200') {
            return response.json()
        } else {
            let responsetext = await response.text()
            console.log(responsetext)
            throw responsetext
        }
    }).then((transactions) => {
        callback(null, transactions)
    }).catch(e => {
        console.log(e)
        callback(e, null)
    })
}

function createTransaction(access_token, transactionName, category, amount, callback) {
    let jsonRequestBody = { transactionName, category, amount }

    fetch(SECURE_EVENT_BACKEND_URL + '/bank/v1/transactions', {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer ' + access_token,
            'Content-type': 'application/json'
        },
        body: JSON.stringify(jsonRequestBody)
    }).then(response => {
        console.log(response)
        if (response.status == '204') {
            callback(true)
        } else {
            callback(false)
        }
    }).catch(e => {
        console.log(e)
        callback(false)
    })
}