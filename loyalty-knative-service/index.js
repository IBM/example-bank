const express = require('express');
const app = express();
const axios = require('axios');
const qs = require('qs');
const jwt_decode = require('jwt-decode')

let transactionServiceUrl = process.env.TRANSACTION_SERVICE_URL
let appIdTokenUrl = process.env.APP_ID_TOKEN_URL
let appIdClientId = process.env.APP_ID_CLIENT_ID
let appIdClientSecret = process.env.APP_ID_CLIENT_SECRET

let appIdResult;

app.post('/process', (req, res) => {
  console.log('received request')
  console.log(req.query)
  // if (!appIdResult) {
  //   getAppIdToken('MaryDelrosario','MaryDelrosario')
  //   .then(function (response) {
  //     appIdResult = response.data
  //     res.send('OK')
  //   })
  //   .catch(function (error) {
  //     console.log(error)
  //     res.send('OK')
  //   })
  // } else {
  //   // check if token is expired
  //   if (isAccessTokenExpired(appIdResult.access_token)) {
  //     getAppIdToken('MaryDelrosario','MaryDelrosario')
  //       .then(function (response) {
  //         appIdResult = response.data
  //         res.send('OK')
  //       })
  //       .catch(function (error) {
  //         console.log(error)
  //         res.send('OK')
  //       })
  //   } else {
  //     console.log('found app id result in global variable')
  //     console.log(appIdResult.access_token)
  //     res.send('OK')
  //   }
  // }
  setTimeout(function() {
    if (req.query.transactionId && req.query.category && req.query.amount) {
      let pointsEarned = computeReward(req.query.category, req.query.amount);
      axios({
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
          res.status('404').send({result: 'Failed to post to transaction API', response })
        }
      }).catch(function (error) {
          console.log({error})
          res.status('404').send({error})
      })
    } else {
      console.log('test')
      res.status('404').send('transactionId, category, and amount must be present in query parameters.')
    }
  }, 0)
});

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