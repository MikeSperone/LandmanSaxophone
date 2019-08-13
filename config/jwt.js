const jwt = require('passport-jwt');
const JWTStrategy = jwt.Strategy;
const ExtractJwt = jwt.ExtractJwt;
const bcrypt = require('bcryptjs');
const userQuery = require('../util/sendQuery').userQuery;
const constants = require('../config/constants');

const jwtOpts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: constants.JWT_SECRET
};

const jwtStrategy = new JWTStrategy(jwtOpts, async (payload, done) => {
    console.info('hi payload: ', payload);
    try {
        userQuery(payload)
            .then(user => {
                if (!user.response.length) {
                    return done(null, false);
                } else if (user.response.length === 1) {
                    const r = user.response[0];
                    return done(null, r);
                } else {
                    return done(null, false);
                }
            });
    } catch (e) {
        return done(e, false);
    }
});

module.exports = function(passport) {
    passport.use(jwtStrategy);
};
