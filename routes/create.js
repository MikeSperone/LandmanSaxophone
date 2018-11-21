var express = require('express');
var router = express.Router();
var validate = require('../util/validate');

function bin(req, res) {
    var bin = validate.bin(req.params.id);
    const checkQuery = "SELECT * from `fingerings` WHERE `bin`=" + bin;
    connection.query(checkQuery, (err, check_resp, fields) => {
        const response = {"status": 200, "error": null, "response": null};
        if (!check_resp.length) {
            const query = "INSERT `fingerings` (`bin`) VALUES (\"" + bin + "\")";
            connection.query(query, (err, sql_resp, fields) => {
                if (err) {
                    response.error = "Database error";
                } else if (sql_resp) {
                    response.response = { "created": "ok" };
                }
                res.json(response);
            });
        } else {
            response.error = "Item already exists. bin: " + bin;
            res.json(response);
        }
    });
}

function soundData(req, res) {

}
module.exports = { bin, soundData };
