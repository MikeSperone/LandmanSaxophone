var validate = require('./validate');

describe('validate', () => {
    describe('audio', () => {
        it('should validate', () => {
            expect(validate.audio('test')).to.equal('test');
        });

        it.skip('should not validate', () => {
            return true;
        });
    });

    describe('description', () => {
        it('should validate and url encode', () => {
            expect(validate.description("Hello, this is a test")).to.equal("Hello,%20this%20is%20a%20test");
        });

        it('should not validate', () => {
            expect(validate.description(23)['error']).to.exist;
        });
    });

    describe('pitch', () => {
        it('should validate', () => {
            expect(validate.pitch('Eb,G#')).to.equal("Eb,G#");
        });

        it('should not validate', () => {
            expect(validate.pitch(true)['error']).to.exist;
        });
    });
    describe('multi', () => {
        it('should validate', () => {
            expect(validate.multi("true")).to.equal(1);
            expect(validate.multi(true)).to.equal(1);
            expect(validate.multi("false")).to.equal(0);
            expect(validate.multi(null)).to.equal(0);
        });

        it('should not validate', () => {
            expect(validate.multi({})['error']).to.exist;
        });
    });

    describe('bin', () => {
        it('should validate', () => {
            expect(validate.bin("10101010101010101010100")).to.equal("10101010101010101010100");
        });

        it('should not validate', () => {
            expect(validate.bin(100101010)['error']).to.exist;
        });
    });

    describe('soundID', () => {
        it('should validate', () => {
            expect(validate.soundId('1')).to.equal('1');
        });

        it.skip('should not validate', () => {
            return true;
        });
    });

});

