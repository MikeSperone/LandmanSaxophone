var express = require('express');
var router = express.Router();
const { ensureAuthenticated } = require('../config/auth');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});

router.get('/dashboard', ensureAuthenticated, (req, res) => res.redirect(200, 'http://45.55.106.234/'));

module.exports = router;
