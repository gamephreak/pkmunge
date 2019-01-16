const dmg = require('dmgcalc');
const Dex = require('../Pokemon-Showdown/sim/dex');

const gen = Number(process.argv[2]) || 7;

const previous = dmg.ABILITIES_BY_ID[gen - 1];
const current = dmg.ABILITIES_BY_ID[gen];
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
    let val = dex.getAbility(id);
    for (let k in val) {
      const required = requiredKeys[k];
      const optional = optionalKeys[k];

      if (!(required || optional)) {
        delete val[k];
      } else if (required && !val[k]) {
        console.error([val, k]);
      } else if (optional && !val[k]) {
        delete val[k];
      }
    }
    val.gen = gen;
    result[id] = val;
  }
}

console.log(JSON.stringify(result, null, 2));
