const LocalStrategy = require('passport-local').Strategy;
const mysql = require('mysql');
const bcrypt = require('bcryptjs');
const sendQuery = require('../util/sendQuery').query;

function userQuery(email) {
    return 'SELECT * from users WHERE email = \"' + email + '\"';
}

module.exports = function(passport) {
    passport.use(new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
            // Match User
            sendQuery(userQuery(email)).then(user => {
               if (!user.response.length) {
                   // email not found
                   return done(null, false, { message: 'That email is not registered.' });
               } else if (user.response.length === 1) {
                   // One email found (as expected)
                   const r = user.response[0];
                   bcrypt.compare(password, r.password, (err, isMatch) => {
                       if (err) throw err;

                       return (isMatch) ?
                           done(null, r) :
                           done(null, false, { message: 'Incorrect login information.'});
                   });
               } else {
                   // Multiple entries found for this email.
                   // This shouldn't be allowed to happen - something is wrong
                   // TODO: option to send email or something, or contact info
                   return done(null, false, {
                       message: 'Multiple users found - please alert the system admin'
                   });
               }

            }).catch(e => {
                return done(null, false, { message: 'Unknown server error' });
            });
        })
    );

    passport.serializeUser((user, done) => {
        done(null, user.email);
    });

    passport.deserializeUser((email, done) => {
        sendQuery(userQuery(email)).then(user => {
            // TODO: what is this error thing here?  Do I need to pass a value?
            done(user.error, user.response[0]);
        }).catch(e => {
            return done(null, false, { message: 'Unknown server error' });
        });
    });
};

