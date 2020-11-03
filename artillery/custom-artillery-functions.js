module.exports = { getUser : getUser, afterGetUsers : afterGetUsers };

// Randomly create a user name
function getUser(context, events, done) {
    var i = Math.floor(Math.random() * 20000);
    var name = "UserName" + i;
    context.vars['username'] = name;
    return done();
}

function afterGetUsers(requestParams, response, context, ee, next) {
    console.log("After hook function enter");
    console.log(response.body);
    var users = response.body.split(',');

    const random = Math.floor(Math.random() * users.length);
    console.log(random, users[random]);
    context.vars['user'] = users[random].slice(1, -1);
    return next();
}
// -d '{"category": "CAFE", "transactionName": "CAFE", "amount": 199.99}'
