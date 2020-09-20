let SECURE_USER_BACKEND_URL='/proxy_user'
let SECURE_EVENT_BACKEND_URL='/proxy_transaction'
// DEVMODE
let mode = 'INTEGRATED'
function createProfile(access_token, callback) {
    callback(true)
}

function deleteUserProfile(access_token, callback) {
    callback(true)
}

function getTransactions(access_token, callback) {
    let testdata = [{
        "amount": 20,
        "category": "Cafe",
        "date": "2020-04-27T22:09:39.183Z",
        "pointsEarned": 20,
        "processed": true,
        "transactionId": "c2eb0fb9-2af0-43a3-820d-fa210203f698",
        "transactionName": "Starbucks",
        "userId": "60e67c81-1a27-4423-a890-db653941822a"
      },
      {
        "amount": 15,
        "category": "Carshare",
        "date": "2020-04-27T22:09:39.183Z",
        "pointsEarned":15,
        "processed": true,
        "transactionId": "c2eb0fb9-2af0-43a3-820d-fa210203f698",
        "transactionName": "Uber",
        "userId": "60e67c81-1a27-4423-a890-db653941822a"
      },
      {
        "amount": 70,
        "category": "Gas",
        "date": "2020-04-27T22:09:39.183Z",
        "pointsEarned": 100,
        "processed": true,
        "transactionId": "c2eb0fb9-2af0-43a3-820d-fa210203f698",
        "transactionName": "Esso",
        "userId": "60e67c81-1a27-4423-a890-db653941822a"
      },
      {
        "amount": 20,
        "category": "Meals",
        "date": "2020-04-27T22:09:39.183Z",
        "pointsEarned":20,
        "processed": true,
        "transactionId": "c2eb0fb9-2af0-43a3-820d-fa210203f698",
        "transactionName": "Sweetgreen",
        "userId": "60e67c81-1a27-4423-a890-db653941822a"
      },,
      {
        "amount": 127,
        "category": "Groceries",
        "date": "2020-04-27T22:09:39.183Z",
        "pointsEarned": 200,
        "processed": true,
        "transactionId": "c2eb0fb9-2af0-43a3-820d-fa210203f698",
        "transactionName": "Whole Foods",
        "userId": "60e67c81-1a27-4423-a890-db653941822a"
      },
      {
        "amount": 34,
        "category": "Meals",
        "date": "2020-04-17T22:09:39.183Z",
        "pointsEarned":34,
        "processed": true,
        "transactionId": "c2eb0fb9-2af0-43a3-820d-fa210203f698",
        "transactionName": "Shake Shack",
        "userId": "60e67c81-1a27-4423-a890-db653941822a"
      },
      ,
      {
        "amount": 20,
        "category": "Meals",
        "date": "2020-04-18T22:09:39.183Z",
        "pointsEarned":20,
        "processed": true,
        "transactionId": "c2eb0fb9-2af0-43a3-820d-fa210203f698",
        "transactionName": "Sweetgreen",
        "userId": "60e67c81-1a27-4423-a890-db653941822a"
      },,
      {
        "amount": 127,
        "category": "Groceries",
        "date": "2020-04-27T22:09:39.183Z",
        "pointsEarned": 200,
        "processed": true,
        "transactionId": "c2eb0fb9-2af0-43a3-820d-fa210203f698",
        "transactionName": "Whole Foods",
        "userId": "60e67c81-1a27-4423-a890-db653941822a"
      },
      {
        "amount": 5.75,
        "category": "Cafe",
        "date": "2020-04-28T22:09:39.183Z",
        "pointsEarned":34,
        "processed": true,
        "transactionId": "c2eb0fb9-2af0-43a3-820d-fa210203f698",
        "transactionName": "Starbucks",
        "userId": "60e67c81-1a27-4423-a890-db653941822a"
      }
    ]
    callback(null, testdata)
}

function getSpending(access_token, callback) {
    var data = [
        {
          "category": "Cafe",
          "amount": 45
        },
        {
          "category": "Groceries",
          "amount": 239
        },
        {
          "category": "Fuel",
          "amount": 75
        },
        {
          "category": "Ride Share",
          "amount": 35
        },
        {
          "category": "Restaurant",
          "amount": 90
        }
    ];
    callback(null, data)
}

function createTransaction(access_token, transactionName, category, amount, callback) {
    callback(true)
}