const express = require('express');
const router = express.Router();

const bcrypt = require('bcryptjs');
const sendQuery = require('../../util/sendQuery').query,
    objectToQueryString = require('../../util/objectToQueryString');

router.get('/', (req, res) => res.render('register'));

router.post('/', (req, res) => {
    console.log('user attempting to register');
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
        console.error('Registration failed ', errors);
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
                                        console.log(`User registered - ${firstName} ${lastName} - ${email}`);
                                        // r_ins.response = { "created": true };
                                        // res.json(r_ins);
                                        res.redirect('https://mikesperone.com/landman-saxophone-database');
                                    } else {
                                        errors.push({ msg: 'Unknown server error, user not created.' });
                                        renderErrorMessages();
                                    }
                                })
                                .catch(e => {
                                    console.error(e);
                                    errors.push({ msg: 'Server error' });
                                    renderErrorMessages();
                                });
                        })
                    });
                }
            })
            .catch(e => {
                console.error(e);
                errors.push({ msg: 'Server error' });
            });

    }
});
module.exports = router;
