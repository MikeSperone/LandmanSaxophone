var express = require('express');
var router = express.Router();
var create = require('./create');
var read = require('./get');
var update = require('./update').update;
const authJwt = require('../../config/auth').authJwt;

const AUDIO_FOLDER = process.env.AUDIO_FOLDER || '../../audio';
var multer  = require('multer');
var storage = multer.diskStorage({
    destination: AUDIO_FOLDER,
    filename: function(req, file, cb) {
        cb(null, file.originalname);
    },
});
var upload = multer({ storage: storage });

/* C */
router.post('/:id', authJwt, create.bin);
router.post('/upload/:id', authJwt, upload.single('audio'), create.soundData);

/* R */
/* GET users listing. */
router.get('/', read.all);
router.get('/:id', read.byId);
router.get('/:id/:soundId', read.soundId);

/* U */
router.put('/:id/:soundId', authJwt, update);

/* D */
// router.del('/:id/:soundId', del.byId);

module.exports = router;
