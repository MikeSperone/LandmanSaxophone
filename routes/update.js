var express = require('express');
var router = express.Router();

function validateUpdatedData(data) {
    let vData = {};
    if (data.pitch) vData.pitch = data.pitch;
    if (data.description) vData.description = data.description;
    if (data.multi && typeof data.multi === "string" && data.multi.toLowerCase() === "true") {
        vData.multi = true;
    } else if (data.multi) {
        vData.multi = true;
    } else {
        vData.multi = false;
    }
    return vData;;
}

function update(req, res, next) {
    var bin = req.params.id;
    var soundId = req.params.soundId;
    console.log('updating...\nbin: ' + bin + '\nsoundId: ' + soundId);
    var body = validateUpdatedData(req.body);
    // TODO: Validate data!!!
    console.log("body: ", body);
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
    updates = updates.slice(0, -1);
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
