# resolve-value [![Donate](https://img.shields.io/badge/Donate-PayPal-green.svg)](https://paypal.me/jonathanschlinkert?locale.x=en_US) [![NPM version](https://img.shields.io/npm/v/resolve-value.svg?style=flat)](https://www.npmjs.com/package/resolve-value) [![NPM monthly downloads](https://img.shields.io/npm/dm/resolve-value.svg?style=flat)](https://npmjs.org/package/resolve-value) [![NPM total downloads](https://img.shields.io/npm/dt/resolve-value.svg?style=flat)](https://npmjs.org/package/resolve-value)

> Deeply resolve all promises in a value.

Please consider following this project's author, [Jon Schlinkert](https://github.com/jonschlinkert), and consider starring the project to show your :heart: and support.

## Install

Install with [npm](https://www.npmjs.com/) (requires [Node.js](https://nodejs.org/en/) >=10):

```sh
$ npm install --save resolve-value
```

## Usage

```js
const resolve = require('resolve-value');
```

### Examples

```js
assert.equal(await resolveValue(10), 10); //=> 10
assert.equal(await resolveValue(Promise.resolve(10)), 10); //=> 10
```

**Functions**

By default all functions are called.

```js
assert.equal(await resolveValue(() => Promise.resolve(10)), 10); //=> 10
assert.equal(await resolveValue(async () => Promise.resolve(10)), 10); //=> 10
```

Pass a custom replacer function as the second argument to override this  behavior.

```js
const obj = { fn: () => 'do nothing', num: Promise.resolve(10) };

const result = await resolveValue(obj, (value, parent) => {
  if (parent && parent.someKey === true) {
    return value;
  }
  return value();
});

console.log(result.fn); //=> [Function: fn]
```

**Objects**

Resolves all property values, including functions.

```js
const obj = { foo: async () => delay('bar', 10), num: Promise.resolve(10) };
const actual = await resolve(obj);
//=> { foo: 'bar', num: 10 }
```

**Deeply nested**

```js
const obj = { foo: async () => delay('bar', 10), num: Promise.resolve(10) };
const arr = [obj, Promise.resolve(1), Promise.resolve(() => 2)];

const actual = await resolve(arr);
//=> [ { foo: 'bar', num: 10 }, 1, 2 ]
```

## About

<details>
<summary><strong>Contributing</strong></summary>

Pull requests and stars are always welcome. For bugs and feature requests, [please create an issue](../../issues/new).

Please read the [contributing guide](.github/contributing.md) for advice on opening issues, pull requests, and coding standards.

</details>

<details>
<summary><strong>Running Tests</strong></summary>

Running and reviewing unit tests is a great way to get familiarized with a library and its API. You can install dependencies and run tests with the following command:

```sh
$ npm install && npm test
```

</details>

<details>
<summary><strong>Building docs</strong></summary>

_(This project's readme.md is generated by [verb](https://github.com/verbose/verb-generate-readme), please don't edit the readme directly. Any changes to the readme must be made in the [.verb.md](.verb.md) readme template.)_

To generate the readme, run the following command:

```sh
$ npm install -g verbose/verb#dev verb-generate-readme && verb
```

</details>

### Author

**Jon Schlinkert**

* [GitHub Profile](https://github.com/jonschlinkert)
* [Twitter Profile](https://twitter.com/jonschlinkert)
* [LinkedIn Profile](https://linkedin.com/in/jonschlinkert)

### License

Copyright ?? 2021, [Jon Schlinkert](https://github.com/jonschlinkert).
Released under the [MIT License](LICENSE).

***

_This file was generated by [verb-generate-readme](https://github.com/verbose/verb-generate-readme), v0.8.0, on April 19, 2021._
