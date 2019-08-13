const passport = require('passport');
require('./jwt')(passport);
require('./local')(passport);

module.exports = {
    authJwt: passport.authenticate('jwt', {session: false }),
    authLocal: passport.authenticate('local', {session: false }),
    passport,
    ensureAuthenticated: function(req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        }
        req.flash('error_msg', 'You must be logged in to continue');
        res.redirect('/users/login');
    }
}
