var express = require('express');
var router = express.Router();
var validate = require('../../util/validate');
var objectToQueryString = require('../../util/objectToQueryString');

function validateUpdatedData(data) {
    var pitch = validate.pitch(data.pitch),
        description = validate.pitch(data.description),
        multi = validate.multi(data.multi);

    var valData = {};

    function checkVal(v, name) {
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

function checkPermissions(user, res) {
    // TODO: see if this is user's own content
    // if (ownContent && user.permissionsLevel === 5)
    if (user && user.permissionsLevel >= 4) {
        res.json({"status": 401, "error": "Unauthorized", "response": "Unauthorized"});
        return false;
    }
    return true;
}

function update(req, res, next) {
    if (!checkPermissions(req.user, res)) return;
    var body = validateUpdatedData(req.body);
    if (body.error) return res.json({"status": 200, "error": body.error, "response": null});

    var updates = objectToQueryString(body);

    var soundId = validate.soundId(req.params.soundId);
    const update_query = "UPDATE `sounds` SET " +
        updates +
        " WHERE `soundId`=" + soundId;

    console.log('update_query: ', update_query);

    connection.query(update_query, (err, sql_resp, fields) => {
        const response = {"status": 200, "error": null, "response": null};
        if (err) {
            response.error = err;
        } else if (sql_resp) {
            if (sql_resp.changedRows) {
                response.response = { "updated": true};
            } else {
                response.response = { "updated": false };
            }
        }
        res.json(response);
    });
}

module.exports = { update, validateUpdatedData, objectToQueryString };
