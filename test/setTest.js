const loader = require('../dist/index');

describe('set', () => {

    let sampleObject;

    beforeEach(() => {
        sampleObject = JSON.parse(sampleJSON);
    });

    it('should throw an exception if set option is not an object', () => {
        const func = () => {
            loader.call({
                query: {
                    set: 'blub'
                }
            });
        };
        expect(func).to.throw(Error);
    });

    it('should set additional values to json', () => {
        const result = loader.call({
            query: {
                set: {
                    '/object': { blub: 'bla' },
                    '/string': 'a string',
                    '/number': 42,
                    '/array': [0, 1, 2],
                    '/boolean': true,
                    '/null': null
                }
            }
        }, {
            key: 'value'
        });
        expect(result).to.deep.equal({
            object: { blub: 'bla' },
            string: 'a string',
            number: 42,
            array: [0, 1, 2],
            boolean: true,
            null: null,
            key: 'value'
        });
    });

    describe('called with function', () => {
        it('should set result of function as value', () => {
            const result = loader.call({
                query: {
                    set: {
                        '/new': () => 'new value',
                        '/name': (val) => `${val} hit!`,
                    }
                }
            }, sampleObject);
            expect(result.new).to.equal('new value');
            expect(result.name).to.equal('KO hit!');
        });

        it('should pass original value as first argument to function', () => {
            let funcResult;
            const result = loader.call({
                query: {
                    set: {
                        '/name': (val) => funcResult = val,
                    }
                }
            }, sampleObject);
            expect(funcResult).to.equal('KO');
        });

        it('should pass original json object as second argument to function', () => {
            let funcResult;
            const result = loader.call({
                query: {
                    set: {
                        '/name': (val, originalJson) => funcResult = originalJson,
                    }
                }
            }, sampleObject);
            expect(funcResult).to.equal(sampleObject);
        });
        
    });

});