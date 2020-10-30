module.exports = { getUser : getUser };

// Randomly create a user name
function getUser(context, events, done) {
    var i = Math.floor(Math.random() * 20000);
    var name = "UserName" + i;
    context.vars['username'] = name;
    return done();
}
