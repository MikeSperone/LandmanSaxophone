function query(query_string) {
    return new Promise(resolve => {
        console.log('query_string: ', query_string);
        connection.query(query_string, (err, sql_resp, fields) => {
            console.log('sql_resp: ', sql_resp);
            const response = {"status": 200, "error": null, "response": null};
            if (err) {
                response.error = "Database error";
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

module.exports = { query };
