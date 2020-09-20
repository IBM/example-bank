const express = require('express')
const router = express.Router()
const request = require('request')
// use .env file
const dotenv = require('dotenv');
dotenv.config();
// random name generator
const random_name = require('node-random-name');
// app id self service manager
const SelfServiceManager = require("ibmcloud-appid").SelfServiceManager;
let APP_ID_IAM_APIKEY = process.env.APP_ID_IAM_APIKEY
let APP_ID_MANAGEMENT_URL = process.env.APP_ID_MANAGEMENT_URL
let selfServiceManager = new SelfServiceManager({
	iamApiKey: APP_ID_IAM_APIKEY,
	managementUrl: APP_ID_MANAGEMENT_URL
});
// app id client credentials
const APP_ID_CLIENT_ID = process.env.APP_ID_CLIENT_ID
const APP_ID_CLIENT_SECRET = process.env.APP_ID_CLIENT_SECRET
const APP_ID_TOKEN_URL = process.env.APP_ID_TOKEN_URL
// IAM token url
const IAM_TOKEN_URL = 'https://iam.cloud.ibm.com/identity/token'

router.get('/random_user', function (req, res) {
	res.send(random_name())
})

router.post('/login', function (req, res) {
  getAppIdToken(req.body.username, req.body.password, (err, response, body) => {
    if (err) {
      console.log(err)
      console.log(response)
      console.log(body)
      res.send(err)
    } else {
      let jsonBody = JSON.parse(body)
      if (jsonBody.error) {
        console.log(jsonBody)
        res.status('404').send(body)
      } else {
        let cookieOptions = {
          maxAge: jsonBody.expires_in * 1000
        }
        res.cookie('access_token', jsonBody.access_token, cookieOptions)
        res.cookie('id_token', jsonBody.id_token, cookieOptions)
        res.send(body)
      }
    }
  })
})

router.post('/create_account', function (req, res) {
	let reqeustBody = req.body
	let userData = {
		displayName: reqeustBody.firstName + " " + reqeustBody.lastName,
		userName: reqeustBody.firstName + reqeustBody.lastName,
		emails: [
			{
				value: reqeustBody.email,
				type: "home"
			}
		],
		password: reqeustBody.password,
		name: {
			familyName: reqeustBody.lastName,
			givenName: reqeustBody.firstName
		}
	}

	selfServiceManager.signUp(userData, "en").then(function (user) {
		console.log('user created successfully');
		res.send({user , status: "user created successfully"})
	}).catch(function (err) {
		console.log(err);
		if (err.statusCode) {
			res.status(err.statusCode).send(err)
		} else {
			res.status('404').send(err)
		}
	});
})

router.get("/get_all_users", function(req, res) {
	getIAMToken(APP_ID_IAM_APIKEY, IAM_TOKEN_URL).then((token) => {
		getUsersAppID(token, (users) => {
			if (users == null) {
				let empty = []
				res.send(empty)
			}
			res.send(users)
		})
	})
});

function getAppIdToken(username, password, callback) {
  let options = {
    url: APP_ID_TOKEN_URL + "/token",
    method: 'POST',
    headers: {
      'Authorization': 'Basic ' + new Buffer(APP_ID_CLIENT_ID + ":" + APP_ID_CLIENT_SECRET).toString('base64'),
      'Content-Type' : 'application/x-www-form-urlencoded'
    },
    form: {
      username,
      password,
      grant_type: 'password'
    }
  }

  request(options, function (err, response, body) {
    callback(err, response, body)
  })
}

function getIAMToken(iamApiKey, iamTokenUrl) {
	if (!iamApiKey) {
		return Promise.reject("You must pass 'iamToken' to self-service-manager APIs or specify 'iamApiKey' in selfServiceManager init options.");
	}
	var reqOptions = {
		url: iamTokenUrl,
		method: "POST",
		headers: {
			"Content-Type": "application/x-www-form-urlencoded",
			"Accept": "application/json"
		},
		form: {
			"grant_type": "urn:ibm:params:oauth:grant-type:apikey",
			"apikey": iamApiKey
		}
	};
	return new Promise(function (resolve, reject) {
		request(reqOptions, function (error, response, body) {
			if (error) {
				console.log("Obtained IAM token failure: " + error.message);
				reject(error.message);
			} else {
				if (response.statusCode === 200) {
					var IAMAccessToken = JSON.parse(body)["access_token"];
					// console.log("Obtained IAM token: " + IAMAccessToken);
					resolve(IAMAccessToken);
				} else {
					console.log("Obtained IAM token failure");
					console.log("Got status code: " + response.statusCode);
					console.log(body);
					reject(body);
				}
			}
		});
	});
};

function getUsersAppID(iamToken, callback) {
	let reqOptions = {
		url: APP_ID_MANAGEMENT_URL + '/cloud_directory/Users',
		method: "GET",
		headers: {
			"Authorization": "Bearer " + iamToken
		}
	}

	request(reqOptions, function (error, response, body) {
		if (error) {
			console.log("Obtaining users failed")
			console.log(error);
			callback(null)
		} else {
			if (response.statusCode === 200) {
				let responseBody = JSON.parse(body);
				let users = responseBody.Resources
				// get usernames
				users = users.map((element) => {
					return element.userName
				})
				// remove test accounts
				users = users.filter((element) => {
					if (element == 'testadmin' || element == 'gregdritschler' || element.includes('admin')) {
						return false
					}
					return true
				})
				callback(users)
			} else {
				console.log("Obtaining users failed")
				console.log("Got status code: " + response.statusCode);
				console.log(body);
				callback(null)
			}
		}
	})
}

module.exports = router
