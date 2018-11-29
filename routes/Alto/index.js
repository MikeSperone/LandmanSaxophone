var express = require('express');
var router = express.Router();
var create = require('./create');
var multer  = require('multer');
var upload = multer({ dest: '/var/www/audio' });
var read = require('./get');
var update = require('./update').update;

/*
 *  CCC
 * C   C
 * C
 * C   CREATE
 *  CCC
 */

router.post('/:id', create.bin);
router.post('/upload/:id', upload.single('audio'), create.soundData);

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
