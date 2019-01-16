const dmg = require('dmgcalc');
const Dex = require('../Pokemon-Showdown/sim/dex');

var equal = require('deep-equal');

const gen = Number(process.argv[2]) || 7;

const previous = dmg.ABILITIES_BY_ID[gen - 1];
const current = dmg.ABILITIES_BY_ID[gen];
const dex = Dex.forFormat('gen' + gen + 'ou');
const oldDex = Dex.forFormat('gen' + (gen - 1) + 'ou');

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
  if (id === 'flashfireactivated') continue;

  let old = oldDex.getAbility(id);
  let val = dex.getAbility(id);

  delete val['gen'];

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

  if (!previous[id]) {
    val.gen = gen;
    result[id] = val;
  } else if (!equal(val, old)) {
    let patch = {};
    
    for (let k in requiredKeys) {
      if (val[k] && !equal(val[k], old[k])) {
        patch[k] = val[k];
      }
    }
    for (let k in optionalKeys) {
      if (val[k] && !equal(val[k], old[k])) {
        patch[k] = val[k];
      }
    }

    if (!(Object.keys(patch).length === 0 && patch.constructor === Object)) {
      result[id] = patch;
    }
  }
}

console.log(JSON.stringify(result, null, 2));
