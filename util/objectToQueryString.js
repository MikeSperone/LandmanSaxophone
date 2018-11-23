function objectToQueryString(obj) {
    var updates = Object.entries(obj)
        .reduce((str, kv) => {
            var [key, value] = kv;
            var quote = (typeof value === "string") ? '"' : '';
            return str +
                '`' + key + '`' +
                '=' +
                quote + value + quote + ',';
        }, '');
    // remove trailing comma
    return updates.slice(0, -1);
};

module.exports = objectToQueryString; 
