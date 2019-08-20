const express = require('express');
const router = express.Router();

const jwt = require('jsonwebtoken');
const passport = require('../config/auth').passport;

const constants = require('../config/constants');

/* GET users listing. */
router.get('/', (req, res) => res.render('index', { title: 'Users' }));

router.get('/login', (req, res) => res.render('login'));

// Login Handle
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        session: false
    },
    (err, user, info) => {
        if (err || !user) {
            return res.status(400).json({
                message: info ? info.message : 'Login failed',
                user: user
            });
        }

        req.login(user, {session: false}, err => {
            if (err) res.send(err);

            const token = jwt.sign(user.email, constants.JWT_SECRET);
            const { firstName, lastName, permissionsLevel } = user;

            return res.json({ user: { firstName, lastName, permissionsLevel }, token });
        });
    })(req, res, next);
});

router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success_msg', 'You are logged out');
    res.redirect('/users/login');
});
module.exports = router;

