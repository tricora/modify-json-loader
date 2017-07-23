const loader = require('../dist/index');

describe('modify-json-loader', () => {

    let sampleObject;

    beforeEach(() => {
        sampleObject = JSON.parse(sampleJSON);
    });

    it('should export a function', () => {
        expect(loader).is.a('function');
    });

    it('should accept json and object as input', () => {
        expect(loader.call({}, sampleObject)).to.deep.equal(loader.call({}, JSON.stringify(sampleObject)));
    });

    it('should create empty object if called with undefined input', () => {
        expect(loader.call({})).to.deep.equal({});
    });
    
    it('should output js object without any options', () => {
        const output = loader.call({}, '{"key": "val"}');
        expect(output).to.deep.equal({key: 'val'});
    });

    it('should output json string without any options', () => {
        const output = loader.call({
            query: {
                stringified: true
            }
        }, '{"key": "val"}');
        expect(output).to.equal('{"key":"val"}');
    });

    it('should be able to combine include and exlude', () => {
        const result = loader.call({
            query: {
                include: '/obj',
                exclude: '/obj/nested'
            }
        }, sampleObject);
        expect(result).to.deep.equal({
            obj: {
                subName: null
            }
        });
    });

    it('should enable caching by default', () => {
        const spy = sinon.spy(() => {});
        loader.call({
            version: 1,
            cacheable: spy
        });
        expect(spy.calledWith()).to.be.true;
        spy.reset();
        loader.call({
            version: 2,
            cacheable: spy
        });
        expect(spy.notCalled).to.be.true;
    });

    it('should disable caching if disableCaching is set to true', () => {
        const spy = sinon.spy(() => {});
        loader.call({
            version: 1,
            query: { disableCaching: true },
            cacheable: spy
        });
        expect(spy.notCalled).to.be.true;
        spy.reset();
        loader.call({
            version: 2,
            query: { disableCaching: true },
            cacheable: spy
        });
        expect(spy.calledWith(false)).to.be.true;
    });

});