function loginWithAppId(username, password, callback) {
    let jsonBody = {
        id_token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6ImFwcElkLTY4ZDI1ZDQ2LThmZGItNDhlMy1iODNkLTJhYzY2YzI5MTA2NC0yMDIwLTAxLTMxVDAwOjI5OjI4Ljg1NiIsInZlciI6NH0.eyJpc3MiOiJodHRwczovL3VzLXNvdXRoLmFwcGlkLmNsb3VkLmlibS5jb20vb2F1dGgvdjQvMTIzIiwiYXVkIjpbIjEyMyJdLCJleHAiOjAsInRlbmFudCI6IjY4ZDI1ZDQ2LThmZGItNDhlMy1iODNkLTJhYzY2YzI5MTA2NCIsImlhdCI6MCwiZW1haWwiOiJKb2huQFNtaXRoLm9yZyIsIm5hbWUiOiJKb2huIFNtaXRoIiwic3ViIjoiMTIzIiwicHJlZmVycmVkX3VzZXJuYW1lIjoiTGl0YUNhdnJhayIsImdpdmVuX25hbWUiOiJKb2huIiwiZmFtaWx5X25hbWUiOiJTbWl0aCIsImlkZW50aXRpZXMiOlt7InByb3ZpZGVyIjoiY2xvdWRfZGlyZWN0b3J5IiwiaWQiOiIxMjMifV0sImFtciI6WyJjbG91ZF9kaXJlY3RvcnkiXX0.ABC",
        access_token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6ImFwcElkLTY4ZDI1ZDQ2LThmZGItNDhlMy1iODNkLTJhYzY2YzI5MTA2NC0yMDIwLTAxLTMxVDAwOjI5OjI4Ljg1NiIsInZlciI6NH0.eyJpc3MiOiJodHRwczovL3VzLXNvdXRoLmFwcGlkLmNsb3VkLmlibS5jb20vb2F1dGgvdjQvMTIzIiwiZXhwIjowLCJhdWQiOlsiMTIzIl0sInN1YiI6IjEyMyIsImFtciI6WyJjbG91ZF9kaXJlY3RvcnkiXSwiaWF0IjowLCJ0ZW5hbnQiOiIxMjMiLCJzY29wZSI6Im9wZW5pZCBhcHBpZF9kZWZhdWx0IGFwcGlkX3JlYWR1c2VyYXR0ciBhcHBpZF9yZWFkcHJvZmlsZSBhcHBpZF93cml0ZXVzZXJhdHRyIGFwcGlkX2F1dGhlbnRpY2F0ZWQifQ.ABC"
    }
    
    document.cookie = 'access_token=' + jsonBody.access_token + ';'
    document.cookie = 'id_token=' + jsonBody.id_token+ ';'
    callback(jsonBody)
}

function getRandomUser(callback) {
    let text = "John Smith"
    let name = text.split(' ')
    let firstname = name[0]
    let surname = name[1]
    let password = name[0] + name[1]
    let email = name[0] + "@" + name[1] + ".org"
    callback(firstname, surname, password, email)
}

function createAccountAppId(firstname, lastname, password, email, callback) {
    let json = {}
    json.status = "user created successfully"
    callback(json)
}

function getAllUsers(callback) {
    callback(['JohnSmith'])
}
