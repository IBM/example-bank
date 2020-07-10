const express = require('express');
const app = express();
const axios = require('axios');
const qs = require('qs');
const jwt_decode = require('jwt-decode')

let transactionServiceUrl = process.env.TRANSACTION_SERVICE_URL
let appIdTokenUrl = process.env.APP_ID_TOKEN_URL
let appIdClientId = process.env.APP_ID_CLIENT_ID
let appIdClientSecret = process.env.APP_ID_CLIENT_SECRET
let appIdAdminUser = process.env.APP_ID_ADMIN_USER
let appIdAdminPassword = process.env.APP_ID_ADMIN_PASSWORD

let appIdResult;

app.post('/process', (req, res) => {
  console.log('received request')
  console.log(req.query)
  if (!appIdResult) {
    getAppIdToken(appIdAdminUser, appIdAdminPassword)
    .then(function (response) {
      appIdResult = response.data
      sendToRewardEndpoint(req, res, appIdResult.access_token)
    })
    .catch(function (error) {
      console.log(error)
      res.status('404').send('Error getting admin token')
    })
  } else {
    console.log('found app id result in global variable')
    // check if token is expired
    if (isAccessTokenExpired(appIdResult.access_token)) {
      console.log('token found is expired. getting new one...')
      getAppIdToken(appIdAdminUser, appIdAdminPassword)
        .then(function (response) {
          appIdResult = response.data
          sendToRewardEndpoint(req, res, appIdResult.access_token)
        })
        .catch(function (error) {
          console.log(error)
          res.status('404').send('Error getting admin token')
        })
    } else {
      sendToRewardEndpoint(req, res, appIdResult.access_token)
    }
  }
});

function sendToRewardEndpoint(req, res, authToken) {
  if (req.query.transactionId && req.query.category && req.query.amount) {
    let pointsEarned = computeReward(req.query.category, req.query.amount);
    axios({
      headers: {
        'Authorization': 'Bearer ' + authToken
      },
      method: 'put',
      url: transactionServiceUrl + '/reward/' + req.query.transactionId,
      data: {
        pointsEarned
      }
    })
    .then(function (response) {
      if (response.status == '204') {
        res.status('200').send('OK')
      } else {
        console.log({status: error.response.status, data: error.response.data})
        res.status('404').send({result: 'Failed to post to transaction API', response })
      }
    }).catch(function (error) {
        console.log("Error in PUT /transactions/reward/{transactionId}")
        console.log({status: error.response.status, data: error.response.data})
        res.status('404').send({error})
    })
  } else {
    res.status('404').send('transactionId, category, and amount must be present in query parameters.')
  }
}

function computeReward(category, amount) {
    return amount;
}

function getAppIdToken(username, password) {
  let data = {
    username,
    password,
    grant_type: 'password'
  }
  return axios({
    method: 'post',
    url: appIdTokenUrl + '/token',
    headers: {
      'Authorization': 'Basic ' + Buffer.from(appIdClientId + ":" + appIdClientSecret).toString('base64'),
      'Content-Type' : 'application/x-www-form-urlencoded'
    },
    data: qs.stringify(data)
  })
}

function isAccessTokenExpired(access_token) {
  if (new Date().getTime() - (jwt_decode(access_token).exp * 1000) >= 0) {
    return true
  } else {
    return false
  }
}


const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log('Hello world listening on port', port);
});