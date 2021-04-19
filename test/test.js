'use strict';

require('mocha');
const assert = require('assert');
const resolveValue = require('..');

const delay = (value, ms = 0) => new Promise(res => setTimeout(() => res(value), ms));

describe('resolve-value', () => {
  it('should resolve strings', async () => {
    assert.equal(await resolveValue('string'), 'string');
    assert.equal(await resolveValue(Promise.resolve('string')), 'string');
    assert.equal(await resolveValue(Promise.resolve(Promise.resolve('string'))), 'string');
  });

  it('should resolve numbers', async () => {
    assert.equal(await resolveValue(0), 0);
    assert.equal(await resolveValue(Promise.resolve(10)), 10);
  });

  it('should resolve functions', async () => {
    assert.equal(await resolveValue(() => 'string'), 'string');
    assert.equal(await resolveValue(() => Promise.resolve(10)), 10);
    assert.equal(await resolveValue(() => Promise.resolve('string')), 'string');
    assert.equal(await resolveValue(async () => Promise.resolve('string')), 'string');
    assert.equal(await resolveValue(async () => Promise.resolve(10)), 10);
  });

  it('should deeply resolve functions', async () => {
    const obj = { foo: async () => delay('bar', 10), num: Promise.resolve(10) };
    const actual = { foo: 'bar', num: 10 };
    assert.deepEqual(await resolveValue(async () => delay(() => 'foo', 10)), 'foo');
    assert.deepEqual(await resolveValue(async () => delay(() => Promise.resolve(obj), 10)), actual);
  });

  it('should take a custom replacer function', async () => {
    const obj = { fn: () => 'do nothing', num: Promise.resolve(10) };

    const result = await resolveValue(obj, (value, parent) => value);

    assert.equal(result.num, 10);
    assert.equal(result.fn, obj.fn, 'Expected function to not be resolved');
  });

  it('should resolve an object', async () => {
    const obj = { foo: 'bar', num: 10 };
    assert.deepEqual(await resolveValue(obj), obj);
  });

  it('should deeply resolve objects', async () => {
    const obj = { foo: async () => delay('bar', 10), num: Promise.resolve(10) };
    assert.deepEqual(await resolveValue(async () => delay(() => obj, 10)), { foo: 'bar', num: 10 });
  });

  it('should resolve arrays', async () => {
    const obj = { foo: async () => delay('bar', 10), num: Promise.resolve(10) };
    const fixture = [obj, Promise.resolve(1), Promise.resolve(() => 2)];
    const actual = await resolveValue(fixture);
    assert.deepEqual(actual, [{ foo: 'bar', num: 10 }, 1, 2]);
  });

  it('should support .toJSON()', async () => {
    const obj = { foo: async () => delay('bar', 10), num: Promise.resolve(10) };

    const actual = await resolveValue({
      toJSON() {
        return { ...obj };
      }
    });

    assert.deepEqual(actual, { foo: 'bar', num: 10 });
  });

  it('should ignore circular references', () => {
    const target = {};
    const source = { target: Promise.resolve(target) };
    target.source = source;

    return resolveValue(['a', ['deep', { nested: Promise.resolve(source) }]])
      .then(arr => {
        assert(Array.isArray(arr));
      });
  });
});
