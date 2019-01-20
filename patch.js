const extend = require('dmgcalc').extend;

a = [{foo: 6, chance: 10, bar: 6}];
b = [{chance: 20}];

c = extend(true, {}, a, b);

console.log(a);
for (let v of a) {
  console.log(v);
}
console.log(c);
for (let v of c) {
  console.log(v);
}

