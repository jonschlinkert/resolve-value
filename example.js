'use strict';

const resolve = require('.');
const delay = (value, ms = 0) => new Promise(res => setTimeout(() => res(value), ms));

const nested = {
  name: delay('nested', 100),
  type: delay('choice', 100),
  value: delay({ a: () => delay({ one: 'two' }, 25) }, 100),
  async choices() {
    return delay([delay(() => 'foo', 100), 'bar', 'baz'], 10);
  }
};

const obj = async () => ({
  name: delay('example', 100),
  type: delay('prompt', 100),
  value: delay({ a: () => delay({ one: 'two' }, 500) }, 100),
  async choices() {
    return delay([delay(() => 'foo', 100), 'bar', 'baz', nested], 1000);
  }
});

const start = Date.now();

resolve(obj)
  .then(res => {
    console.log(res);
    console.log(res.choices[3]);
  })
  .then(() => {
    console.log('Done', `${Date.now() - start}ms`);
  });
