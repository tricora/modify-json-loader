# modify-json-loader

Modifies JSON before passed to json-loader.  Based on [json-pointer](https://www.npmjs.com/package/json-pointer)

## Usage
install via npm:
```bash
npm install --save-dev modify-json-loader
```
add to webpack config:
```js
module: {
    rules: [
        {
            test: /package\.json/,
            use: [
                'json-loader',
                {
                    loader: 'modify-json-loader',
                    options: {
                        include: '/address/city'
                    }
                }
            ]
        }
    ]
}
```
### Pointers
This loader uses [JSON pointer](https://tools.ietf.org/html/rfc6901) to address specific properties in JSON.
```json
/* json */                     /* pointer */
{
  "foo": "bar",                /foo
  "list": [                    /list
    "entry0",                  /list/0
    123                        /list/1
  ],
  "language": {                /language
    "en": "example",           /language/en
    "de": "Beispiel",          /language/de
  }
}
```
For more details see [JSON-pointer specification](https://tools.ietf.org/html/rfc6901)

### Options
#### ***.include***
```
Type:    pointer || [pointer]
Default: undefined
```
If set, only properties matching the pointers are written into output result.
```json
include: ['/foo', '/language/de']
	=>
{
  "foo": "bar",
  "language": {
    "de": "Beispiel",
  }
}
```

#### ***.exclude***
```
Type:    pointer || [pointer]
Default: undefined
```
If set, only properties not matching the pointers are written into output result.
```json
exclude: ['/language/de', '/list]
	=>
{
  "foo": "bar",
  "language": {
    "en": "example",
  }
}
```
>**Note:** including or excluding array elements is not working properly at the moment.
#### ***.set***
```
Type:    object
Default: undefined
```
The set options allows to change or create new properties for the output JSON. The parameter for this option is an `object` containing key/value pairs, where the keys represent JSON pointers which are set to the related values. Following types are allowed for values:

 - `string`, `number`, `boolean`, `null`:  set the pointer to the value
 - `object`:  set the pointer to the whole object
 - `function(originalValue, originalJSON)`: set the pointer to the result of a provided function. The function is invoked with two parameters:
	 - `originalValue`: the value found in the original json for that pointer. `undefined` if pointer does not exist in original JSON.
	 - `originalJSON`: the original JSON object
```json
set: {
  '/foo': (val, json) => `Bier${val}`,
  '/time': () => new Date(),
  '/list/1': (val) => val * 2,
  '/language/de': 'beispiellos',
}
	=>
{
  "foo": "Bierbar",
  "time": "2017-07-23T00:48:34.683Z",
  "list": [
    "entry0",
    246
  ],
  "language": {
    "en": "example",
    "de": "beispiellos",
  }
}
```

