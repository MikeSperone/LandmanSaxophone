var express = require('express');
var router = express.Router();
var validate = require('util/validate');

function validateUpdatedData(data) {
    if (!validate.pitch(data)) return false;
    if (!validate.description(data)) return false;
    if (data.multi && typeof data.multi === "string" && data.multi.toLowerCase() === "true") {
        data.multi = true;
    } else if (data.multi) {
        data.multi = true;
    } else {
        data.multi = false;
    }
    return data;
}

function objectToQueryString(obj) {
    var updates = Object.entries(body)
        .reduce((str, kv) => {
            var [key, value] = kv;
            var quote = (typeof value === "string") ? '"' : '';
            if (value === true || value === "true") value = 1;
            if (value === false || value === "false") value = 0;
            return str +
                '`' + key + '`' +
                '=' +
                quote + value + quote + ',';
        }, '');
    // remove trailing comma
    return updates.slice(0, -1);
}

function update(req, res, next) {
    var bin = validate.bin(req.params.id);
    var soundId = validate.soundId(req.params.soundId);
    var body = validateUpdatedData(req.body);
    var updates = objectToQueryString(body);

    const update_query = "UPDATE `sounds` SET " +
        updates +
        " WHERE `soundId`=" + soundId;

    console.log('update_query: ', update_query);

    connection.query(update_query, (err, sql_resp, fields) => {
        const response = {"status": 200, "error": null, "response": null};
        if (err) {
            response.error = err;
        } else if (sql_resp) {
            response.response = {"changedRows": sql_resp.changedRows};
        }
        res.json(response);
    });
}

module.exports = update;
