var express = require('express');
var router = express.Router();

function all(req, res, next) {
    const db_query = 'SELECT * from fingerings';
    connection.query(db_query, function(err, results, fields) {
        if (err) throw err;
        res.json({
            "status": 200,
            "error": null,
            "response": results
        });
    });
}

function byId(req, res) {
    var bin = req.params.id;
    console.log('bin: ', bin);
    const fingerings_query = 'SELECT * from fingerings WHERE bin = ' + bin;
    connection.query(fingerings_query, (fq_err, fq_res, fq_fields) => {
        const response = {"status": 200, "error": null, "response": null};
        if (fq_err) {
            response.error = fq_err;
            res.send(JSON.stringify(response));
        } else if (fq_res.length) {
            response.response = { ...fq_res[0] };
            const sounds_query = 'SELECT * from sounds WHERE bin = ' + bin;
            connection.query(sounds_query, (sq_err, sq_res, sq_fields) => {
                if (sq_err) {
                    response.error = sq_err;
                } else {
                    response.response['soundData'] = sq_res;
                }
                res.json(response);
            });
        } else {
            res.json(response);
        }

    });
}

function soundId(req, res) {
    var { id, soundId } = req.params;
    const query = 'SELECT * from sounds WHERE soundId = ' + soundId;
    connection.query(query, (err, query_res, fields) => {
        const response = {"status": 200, "error": null, "response": null};
        if (err) {
            response.error = err;
        } else {
            response.response = query_res;
        }
        res.json(response);
    });
}

module.exports = { all, byId, soundId };
