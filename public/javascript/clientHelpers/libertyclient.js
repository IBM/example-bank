// let SECURE_USER_BACKEND_URL='http://loyalty-user-service-default.anthony-cluster-dev-os-f2c6cdc6801be85fd188b09d006f13e3-0001.us-south.containers.appdomain.cloud'
let SECURE_USER_BACKEND_URL='/proxy_user'
let SECURE_EVENT_BACKEND_URL='/proxy_event'

function createProfile(access_token, callback) {
    let jsonRequestBody = {}
    jsonRequestBody.consentGiven = true

    fetch(SECURE_USER_BACKEND_URL + '/loyalty/v1/users', {
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
    fetch(SECURE_USER_BACKEND_URL + '/loyalty/v1/userEvents/self/info', {
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
    fetch(SECURE_USER_BACKEND_URL + '/loyalty/v1/userEvents/self', {
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

            fetch(SECURE_EVENT_BACKEND_URL + '/loyalty/v1/events?' + queryParams, {
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
    fetch(SECURE_EVENT_BACKEND_URL + '/loyalty/v1/events', {
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

    fetch(SECURE_USER_BACKEND_URL + '/loyalty/v1/userEvents', {
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
