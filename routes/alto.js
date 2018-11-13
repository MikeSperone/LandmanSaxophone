var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
    const db_query = 'SELECT * from fingerings';
    connection.query(db_query, function(err, results, fields) {
        if (err) throw err;
        res.send(JSON.stringify({
            "status": 200,
            "error": null,
            "response": results
        }));
    });
    // res.send('respond with a resource');
});

router.get('/:id', (req, res) => {
    var bin = req.params.id;
    const fingerings_query = 'SELECT * from fingerings WHERE bin = ' + bin;
    const response = {"status": 200, "error": null, "response": []};
    connection.query(fingerings_query, (fq_err, fq_res, fq_fields) => {
        if (fq_err) {
            response.error = fq_err;
            res.send(JSON.stringify(response));
        } else {
            response.response = { ...fq_res[0] };
            const sounds_query = 'SELECT * from sounds WHERE bin = ' + bin;
            connection.query(sounds_query, (sq_err, sq_res, sq_fields) => {
                if (sq_err) {
                    response.error = sq_err;
                } else {
                    response.response['soundData'] = sq_res;
                }
                res.send(JSON.stringify(response));
            });
        }
    });
});

module.exports = router;
