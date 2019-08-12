var express = require('express');
var router = express.Router();
const { ensureAuthenticated } = require('../config/auth');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});

router.get('/dashboard', ensureAuthenticated, (req, res) => res.render('index', { name: req.user.firstName }));

module.exports = router;
