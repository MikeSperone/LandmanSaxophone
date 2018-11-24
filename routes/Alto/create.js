var express = require('express'),
    router = express.Router(),
    validate = require('../../util/validate'),
    objectToQueryString = require('../../util/objectToQueryString'),
    sendQuery = require('../../util/sendQuery').query;

function bin(req, res) {
    var bin = validate.bin(req.params.id);
    if (bin.error) return res.json({"status": 200, "error": bin.error, "response": null});
    const checkQuery = "SELECT * from `fingerings` WHERE `bin`=\"" + bin + "\"";;
    sendQuery(checkQuery).then(r_check => {
        console.log('r_check: ', r_check);
        if (!r_check.response.length) {
            const insertQuery = "INSERT `fingerings` (`bin`) VALUES (\"" + bin + "\")";
            sendQuery(insertQuery).then(r_ins => {
                if (r_ins.response.affectedRows) {
                    r_ins.response = { "created": true };
                    res.json(r_ins);
                } else {
                    r_ins.response = { "created": false };
                }
            });
        } else {
            r_check.error = "Item already exists. bin: " + bin;
            res.json(r_check);
        }
    });
}

function validateSoundData(data) {
    var pitch = validate.pitch(data.pitch),
        description = validate.pitch(data.description),
        multi = validate.multi(data.multi);

    var valData = {};

    var checkVal = function(v, name) {
        if (v) {
            if (v.error) return false;
            valData[name] = v;
        }
        return true;
    }
    if (!checkVal(pitch, 'pitch')) return pitch;
    if (!checkVal(description, 'description')) return description;
    if (!checkVal(multi, 'multi')) return multi;
    return valData;
}

function soundData(req, res) {
    if (!req.file) {
        return res.json({"status": 200, "error": "no audio file attached", "response": null});
    }
    var bin = validate.bin(req.params.id);
    if (bin.error) return res.json({"status": 200, "error": bin.error, "response": null});
    var body = validateSoundData(req.body);
    if (body.error) return res.json({"status": 200, "error": body.error, "response": null});
    body.name = req.file.filename;
    body.bin = bin;

    const checkQuery = "SELECT * from `fingerings` WHERE `bin`=\"" + bin + "\"";;
    sendQuery(checkQuery).then(r_check => {
        console.log('r_check: ', r_check);
        if (r_check.response.length) {

            var updates = objectToQueryString(body);

            const create_query = "INSERT `sounds` SET " + updates;

            console.log('create_query: ', create_query);
            sendQuery(create_query).then(r => res.json(r));

        } else {
            r_check.error = "Item does not exist. bin: " + bin;
            res.json(r_check);
        }
    });

}
module.exports = { bin, soundData };
