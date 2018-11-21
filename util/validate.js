/**
 *
 */
const ERRORS = {
    LENGTH: "incorrect length: ",
    DATA_TYPE: "incorrect data type: ",
};

function audio(a) {
    return a;
}

function pitch(p) {
    if (p && typeof p !== "string") {
        return {
            "error": ERRORS.DATA_TYPE + "pitch should be a string"
        };
    } else {
        return p ? encodeURI(p) : null;
    }
}

function description(desc) {
    if (desc && typeof desc !== "string") {
        return {
            "error": ERRORS.DATA_TYPE + "description should be a string"
        };
    } else {
        return desc ? encodeURI(desc) : null;
    }
}

function multi(m) {
    const validTypeMessage = "multi has 3 valid types - boolean, string, or number. You passed a value of type ";
    const validValuesMessage = "multi has 6 valid values - [true, false, \"true\", \"false\", 1, 0].  You passed a value of ";
    if (typeof m === "boolean" || typeof m === "number") {
        m = m ? 1 : 0;
    } else if (m && typeof m === "string") {
        m = m.toLowerCase();
        if (m === "true") {
            m = 1;
        } else if (m === "false") {
            m = 0;
        } else {
            return {
                "error": ERRORS.VALUE + validValuesMessage + m
            };
        }
    } else if (typeof m === "undefined" || m === null) {
        // if unset or null, default to 0
        m = 0;
    } else {
        return { "error": ERRORS.DATA_TYPE +
            validTypeMessage + typeof m +"\n" +
            validValuesMessage + m
        };
    }
    return m;
}

function bin(b) {
    if (b.length !== 23) {
        return { "error": ERRORS.LENGTH + "bin requires a length of 23 digits" };
    }
    if (typeof b !== "string") {
        return { "error": ERRORS.DATA_TYPE + "bin should be a string" };
    }
    return b ? encodeURI(b) : null;
}

function soundId(s) {
    return s ? encodeURI(s) : null;
}

module.exports = { audio, bin, description, multi, pitch, soundId };
