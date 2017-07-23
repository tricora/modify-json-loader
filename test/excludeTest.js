const loader = require('../dist/index');

describe('exclude', () => {

    let sampleObject;

    beforeEach(() => {
        sampleObject = JSON.parse(sampleJSON);
    });

    it('should throw an error if non-strings are used for exclude input', () => {
        expect(() => loader.call({
            query: {
                exclude: ['asd', {}]
            }
        }, sampleObject)).to.throw(Error);
    });

    it('should remove excluded field', () => {
        const result = loader.call({
            query: {
                exclude: '/name'
            }
        }, sampleObject);
        expect(result).is.a('object');
        expect(result).have.keys(['age', 'obj', 'array']);
    });

    it('should remove all excluded fields', () => {
        const result = loader.call({
            query: {
                exclude: ['/name', '/obj', '/array']
            }
        }, sampleObject);
        expect(result).is.a('object');
        expect(result).to.deep.equal({
            age: 1234
        });
    });

    it('should remove highest element in hierarchy, higher first', () => {
        const result = loader.call({
            query: {
                exclude: ['/obj', '/obj/nested/final']
            }
        }, sampleObject);
        expect(result.obj).to.be.undefined;
    });

    it('should remove highest element in hierarchy, deeper first', () => {
        const result = loader.call({
            query: {
                exclude: ['/obj/nested/final', '/obj']
            }
        }, sampleObject);
        expect(result.obj).to.be.undefined;
    });

    it('should remove no properties if include array is empty', () => {
        const result = loader.call({
            query: {
                exclude: []
            }
        }, sampleObject);
        expect(result).to.deep.equal(sampleObject);
    });

    it('should remove no properties if no key is matched', () => {
        const result = loader.call({
            query: {
                exclude: ['blub', 'bla']
            }
        }, sampleObject);
        expect(result).to.deep.equal(sampleObject);
    });
});