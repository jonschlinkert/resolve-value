'use strict';

const { isPlainObject } = require('is-plain-object');

const resolveValue = async (value, replacer) => {
  const seen = new Set();

  const resolve = async (val, parent) => {
    if (seen.has(val)) return val;
    seen.add(val);

    if (val instanceof Promise) {
      return val.then(v => resolve(v, val));
    }

    if (typeof val === 'function') {
      if (typeof replacer === 'function') {
        return replacer(val, parent, resolve);
      }
      return resolve(val(), val);
    }

    if (typeof val.toJSON === 'function') {
      return resolve(val.toJSON(), val);
    }

    if (Array.isArray(val)) {
      return Promise.all(val.map(v => resolve(v, val)));
    }

    if (isPlainObject(val)) {
      const pending = [];

      for (const key of Object.keys(val)) {
        const promise = resolve(val[key], val).then(v => {
          val[key] = v;
          pending.splice(pending.indexOf(promise), 1);
        });
        pending.push(promise);
      }

      await Promise.all(pending);
    }

    return val;
  };

  return resolve(value);
};

module.exports = resolveValue;
