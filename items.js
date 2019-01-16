const fs = require('fs');
        
const dmg = require('dmgcalc');
const Dex = require('../Pokemon-Showdown/sim/dex');
const toID = require('../Pokemon-Showdown/sim/dex-data').Tools.getId;

const gen = Number(process.argv[2]) || 7;

function readItems(g) {
  const result = {};
  if (g < 2) return result;

  for (let s of fs.readFileSync('tmp/items/clean/gen' + g).toString().split('\n')) {
    result[toID(s)] = 1;
  }
  return result;
}

const previous = readItems(gen - 1);
const current = readItems(gen);
const dex = Dex.forFormat('gen' + gen + 'ou');

const requiredKeys = {
  id: 1,
  name: 1,
  num: 1
  //gen: 1
};

const optionalKeys = {
  desc: 1,
  shortDesc: 1,
  isNonstandard: 1
};


const result = {};
for (let id in current) {
  if (!previous[id]) {
    let val = dex.getItem(id);
    if (!val || !val.exists) {
        console.error(id);
        continue;
    }

    for (let k in val) {
      const required = requiredKeys[k];
      const optional = optionalKeys[k];

      if (!(required || optional)) {
        delete val[k];
      } else if (required && !val[k]) {
        console.error(id);
      } else if (optional && !val[k]) {
        delete val[k];
      }
    }
    val.gen = gen;
    result[id] = val;
  }
}

console.log(JSON.stringify(result, null, 2));
