const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');

const sendQuery = require('../util/sendQuery').query,
    objectToQueryString = require('../util/objectToQueryString'); 

/* GET users listing. */
router.get('/', (req, res) => res.render('index', { title: 'Users' }));


////User model
//const user = 

router.get('/login', (req, res) => res.render('login'));

router.get('/register', (req, res) => res.render('register'));

router.post('/register', (req, res) => {
    const { firstName, lastName, email, password, password2 } = req.body;
    let errors = [];

    if (!firstName || !email || !password || !password2) {
        errors.push({msg: 'Please fill in the missing fields' });
    }

    if (password !== password2) {
        errors.push({ msg: 'Passwords do not match' });
    }

    if (password.length < 6) {
        errors.push({ msg: 'Password should be at least 6 characters.' });
    }

    const renderErrorMessages = () => {
        res.render('register', {
            errors,
            firstName,
            lastName,
            email,
            password,
            password2
        });
    };

    if (errors.length) {
        renderErrorMessages();
    } else {
        const checkQuery = 'SELECT * from `users` WHERE email = \"' + email + '\"';
        console.info(checkQuery);
        sendQuery(checkQuery)
            .then(r_check => {
                if (r_check.response.length) {
                    errors.push({ msg: 'This email is already registered.' });
                    renderErrorMessages();
                } else {
                    // Hash Password
                    bcrypt.genSalt(10, (err, salt) => {
                        bcrypt.hash(password, salt, (err, hash) => {
                            if (err) throw err;
                            const updates = objectToQueryString({ firstName, lastName, email, password: hash });
                            const createQuery = "INSERT `users` SET " + updates;
                            sendQuery(createQuery)
                                .then(r_ins => {
                                    if (r_ins.response.affectedRows) {
                                        // r_ins.response = { "created": true };
                                        // res.json(r_ins);
                                        req.flash('success_msg', 'You are now registered, and can log in');
                                        res.redirect('/users/login');
                                    } else {
                                        errors.push({ msg: 'Unknown server error, user not created.' });
                                        renderErrorMessages();
                                    }
                                })
                                .catch(e => {
                                    errors.push({ msg: 'Server error' });
                                    renderErrorMessages();
                                });
                        })
                    });
                }
            })
            .catch(e => {
                errors.push({ msg: 'Server error' });
            })
            
        // mysql query to find user, where email == email
        // then
        //
    }
});

// Login Handle
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next);
});

router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success_msg', 'You are logged out');
    res.redirect('/users/login');
});
module.exports = router;
