
const ERRORS = {
    LENGTH: "incorrect length",
    DATA_TYPE: "incorrect data type",
}

function audio(data) {
    return data;
}

function pitch(p) {
    if (typeof p !== "string") {
        console.error(ERRORS.DATA_TYPE + ": pitch should be a string");
        return false;
    } else {
        return p ? encodeURI(p) : null;
    }
}

function description(desc) {
    if (typeof desc !== "string") {
        console.error(ERRORS.DATA_TYPE + ": description should be a string");
        return false;
    } else {
        return desc ? encodeURI(desc) : null;
    }
}

function multi(m) {
    if (typeof m !== "boolean") {
        console.error(ERRORS.DATA_TYPE + ": multi should be a boolean");
        return false;
    }
    return m;
}

function bin(b) {
    if (b.length !== 23) {
        console.error(ERRORS.LENGTH + ": bin requires a length of 23 digits");
        return false;
    }
    if (typeof b !== "string") {
        console.error(ERRORS.DATA_TYPE + ": bin should be a string");
        return false;
    }
    return b ? encodeURI(b) : null;
}

function soundId(s) {
    return s ? encodeURI(s) : null;
}

module.exports = { pitch, description, multi, bin, audio };
