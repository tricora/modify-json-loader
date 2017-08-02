const loaderUtils = require('loader-utils');
const ptr = require('json-pointer');
const utils = require('./utils');

module.exports = function(source) {
    try {
        const options = loaderUtils.getOptions(this);
        if (options && options.disableCaching) {
            //disable caching
            if (this.version >= 2 && this.cacheable) {
                this.cacheable(false);
            }
        } else {
            //enable caching
            if (this.version < 2 && this.cacheable) {
                console.log('cacheable()')
                this.cacheable();
            }
        }

        if (!source) {
            source = {};
        }
        const obj = typeof source === 'string' ? JSON.parse(source) : source;


        if (!options) {
            return obj;
        }

        let result;
        if (options.include !== undefined) {
            result = {};
            utils.toArray(options.include).forEach(val => {
                utils.enforceString(val, 'only string or array of strings are allowed for include');
                if (ptr.has(obj, val)) {
                    ptr.set(result, val, ptr.get(obj, val));
                }
            });
        } else {
            result = obj;
        }

        if (options.set) {
            if (typeof options.set !== 'object') {
                throw new Error('set options requires object');
            }
            Object.keys(options.set).forEach((key) => {
                const val = options.set[key];
                const type = typeof val;
                if (val === null || type === 'number' || type === 'string' || type === 'object' || type === 'array' || type === 'boolean') {
                    ptr.set(result, key, val);
                } else if (type === 'function') {
                    const arg = ptr.has(obj, key) ? ptr.get(obj, key) : undefined;
                    ptr.set(result, key, val(arg, obj));
                }
            });
        }

        if (options.exclude !== undefined) {
            utils.toArray(options.exclude).forEach(val => {
                utils.enforceString(val, 'only string or array of strings are allowed for exclude');
                if (ptr.has(result, val)) {
                    ptr.remove(result, val);
                }
            });
        }

        return options.stringified === true ? JSON.stringify(result) : result;
        
    } catch (error) {
        throw new Error('modify-json-loader: ' + error.message);
    }
};