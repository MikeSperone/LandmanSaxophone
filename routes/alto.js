var express = require('express');
var router = express.Router();
var create = require('./create');
var multer  = require('multer');
var upload = multer({ dest: 'uploads/' });
var read = require('./get');
var update = require('./update');

/*
 *  CCC
 * C   C
 * C
 * C   CREATE
 *  CCC
 */

router.post('/:id', create);
router.post('/:id/:soundId', upload.single('audio'), create);

/*
 * RRR
 * R  R
 * RRR
 * R  R
 * R   READ
 */

/* GET users listing. */
router.get('/', read.all);
router.get('/:id', read.byId);
router.get('/:id/:soundId', read.soundId);

/*
 * U   U 
 * U   U
 * U   UPDATE
 *  UUU
 */
router.put('/:id/:soundId', update);

/*
 * DDD
 * D  D
 * D   DELETE
 * D  D
 * DDD
 */
// router.del('/:id/:soundId', del.byId);

module.exports = router;
