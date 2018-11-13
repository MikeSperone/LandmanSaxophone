var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res) {
    // console.log("I've been found");
  res.render('index', { title: 'Users' });
});

module.exports = router;
