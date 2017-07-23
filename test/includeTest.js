const loader = require('../dist/index');

describe('include', () => {

    let sampleObject;

    beforeEach(() => {
        sampleObject = JSON.parse(sampleJSON);
    });

    it('should throw an error if non-strings are used for include input', () => {
        expect(() => loader.call({
            query: {
                include: ['asd', {}]
            }
        }, sampleObject)).to.throw(Error);
    });

    it('should only keep included field', () => {
        const result = loader.call({
            query: {
                include: '/name'
            }
        }, sampleObject);
        expect(result).is.a('object');
        expect(result).have.key('name');
    });

    it('should only keep included fields', () => {
        const result = loader.call({
            query: {
                include: ['/name', '/array/1/key']
            }
        }, sampleObject);
        expect(result).is.a('object');
        expect(result).have.keys(['name', 'array']);
        expect(result.array[1].key).to.equal('value');
    });

    it('should keep values deeper in hierarchy', () => {
        const result = loader.call({
            query: {
                include: ['/obj', '/obj/nested/final']
            }
        }, sampleObject);
        expect(result).to.deep.equal({
            obj: {
                subName: null,
                nested: {
                    final: 42
                }
            }
        });
    });

    it('should keep values higher in hierarchy', () => {
        const result = loader.call({
            query: {
                include: ['/obj/nested/final', '/obj']
            }
        }, sampleObject);
        expect(result).to.deep.equal({
            obj: {
                subName: null,
                nested: {
                    final: 42
                }
            }
        });
    });

    it('should remove all properties if include array is empty', () => {
        const result = loader.call({
            query: {
                include: []
            }
        }, sampleObject);
        expect(result).to.deep.equal({});
    });

    it('should remove all properties if no key is matched', () => {
        const result = loader.call({
            query: {
                include: ['blub', 'bla']
            }
        }, sampleObject);
        expect(result).to.deep.equal({});
    });
});