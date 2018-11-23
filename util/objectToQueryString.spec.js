var objectToQueryString = require('../util/objectToQueryString');

describe('objectToQueryString', () => {

    it('should convert an object to a query string', () => {
        const obj = {
            pitch: "A,B,C",
            description: "cool",
            multi: 1
        };
        const string = objectToQueryString(obj);
        expect(string).to.equal('`pitch`="A,B,C",`description`="cool",`multi`=1');
    });

});

