var express = require('express');
var router = express.Router();
var validate = require('../util/validate');
var sendQuery = require('../util/sendQuery').query;

function bin(req, res) {
    var bin = validate.bin(req.params.id);
    const checkQuery = "SELECT * from `fingerings` WHERE `bin`=\"" + bin + "\"";;
    sendQuery(checkQuery).then(r_check => {
        console.log('r_check: ', r_check);
        if (!r_check.response.length) {
            const insertQuery = "INSERT `fingerings` (`bin`) VALUES (\"" + bin + "\")";
            sendQuery(insertQuery).then(r_ins => {
                if (r_ins.response.affectedRows) {
                    r_ins.resonse = { "created": true };
                    res.json(r_ins));
                } else {
                    r_ins.response = { "created": false };
                }
        } else {
            r_check.error = "Item already exists. bin: " + bin;
            res.json(r_check);
        }
    });
}

function validateCreationData(data) {
    // TODO: some validation
    return data;
}

function soundData(req, res) {
    if (req.file) {
        data.filename = req.file.filename;
    } else {
        return res.json({"status": 200, "error": "no audio file attached", "response": null});
    }

    var body = validateCreationData(req.body);
    if (body.error) return res.json(body);
    var updates = objectToQueryString(body);
    var soundId = validate.soundId(req.params.soundId);
    const update_query = "INSERT `sounds` SET " + updates + " WHERE `soundId`=" + soundId;

    console.log('update_query: ', update_query);
    sendQuery(update_query).then(r => res.json(r));

}
module.exports = { bin, soundData };
