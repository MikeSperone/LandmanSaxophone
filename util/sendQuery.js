function query(query_string) {
    return new Promise(resolve => {
        connection.query(query_string, (err, sql_resp, fields) => {
            var response = {"status": 200, "error": null, "response": null};
            if (err) {
                if (process.env.ENVIRONMENT === "DEVELOPMENT") {
                    response.error = err;
                } else {
                    response.error = "Database error";
                }
            } else if (sql_resp) {
                if (sql_resp.changedRows) {
                    response.response = { "created": "ok" };
                } else {
                    response.response = sql_resp;
                }
            }
            resolve(response);
        });
    });
}

function userQuery(email) {
    const userQuery = 'SELECT * from users WHERE email = \"' + email + '\"';
    return query(userQuery);
}

module.exports = { query, userQuery };
