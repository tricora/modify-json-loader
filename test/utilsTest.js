const utils = require('../dist/utils');
const toArray = utils.toArray;
const isString = utils.isString;
const enforceString = utils.enforceString;

describe('utils', () => {
    describe('toArray', () => {
        it('should export a function', () => {
            expect(toArray).is.a('function');
        });

        it('should return emtpy array if called with undefined', () => {
            expect(toArray()).is.a('array').and.have.length(0);
        });
        
        it('should return emtpy array if called with empty array', () => {
            expect(toArray([])).is.a('array').and.have.length(0);
        });

        it('should return every array passed', () => {
            const array = [1, 2, {blub: 'bla'}];
            expect(toArray(array)).to.deep.equal(array);
        });
    });

    describe('isString', () => {
        it('should work', () => {
            expect(isString()).be.false;
            expect(isString({})).be.false;
            expect(isString([])).be.false;
            expect(isString(function() {})).be.false;
            expect(isString('')).be.true;
            expect(isString('asdasd')).be.true;
            expect(isString(new String('blub'))).be.true;
        });
    });

    describe('enforceString', () => {
        it('should not throw error on string input', () => {
            expect(() => enforceString('ads')).to.not.throw();
        });

        it('should throw error with error message on non string input', () => {
            const msg = 'blub';
            expect(() => enforceString({}, msg)).to.throw(Error, msg);
        });
    });
});