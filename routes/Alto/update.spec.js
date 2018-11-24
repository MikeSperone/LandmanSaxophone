'use strict';
var update = require('./update');

describe('validateUpdatedData', () => {

    it('should validate valid data', () => {
        var pitch = "Eb,Bb,G#",
            description = "This is some really cool data",
            multi = "true";
        const data = { pitch, description, multi };
        const expectedData = {
            pitch: encodeURI(pitch),
            description: encodeURI(description),
            multi: 1
        };
        expect(update.validateUpdatedData(data)).to.eql(expectedData);
    });

    it('should validate with missing data', () => {
        var description = "This is some really cool data",
            multi = "true";
        const data = { description, multi };
        const expectedData = {
            description: encodeURI(description),
            multi: 1
        };
        expect(update.validateUpdatedData(data)).to.eql(expectedData);
    });

    it('should return error with invalid data', () => {
        var pitch = 17,
            description = "This is some really cool data",
            multi = "true";
        const data = { pitch, description, multi };
        expect(update.validateUpdatedData(data).error).to.have.string('incorrect data type');
    });

});

