var validate = require('./validate');

describe('expect(validate', () => {
    describe('audio', () => {
        it('should validate', () => {
            return true;
        });

        it('should not validate', () => {
            return true;
        });
    });

    describe('description', () => {
        it('should validate', () => {
            expect(validate.description("Hello, this is a test")).to.equal("Hello,%20this%20is%20a%20test");
        });

        it('should not validate', () => {
            expect(validate.description(23)).to.be.false;
        });
    });

    describe('pitch', () => {
        it('should validate', () => {
            expect(validate.pitch('Eb,G#')).to.equal("Eb,G#");
        });

        it('should not validate', () => {
            expect(validate.pitch(true)).to.be.false;
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
            expect(validate.multi({})).to.be.false;
        });
    });

    describe('bin', () => {
        it('should validate', () => {
            expect(validate.bin("10101010101010101010100")).to.equal("10101010101010101010100");
        });

        it('should not validate', () => {
            expect(validate.bin(100101010)).to.be.false;
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

