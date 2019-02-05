const fs = require('fs');

const dmg = require('dmgcalc');
const Dex = require('../Pokemon-Showdown/sim/dex');
const toID = require('../Pokemon-Showdown/sim/dex-data').Tools.getId;

var equal = require('deep-equal');

const gen = Number(process.argv[2]) || 7;

function readItems(g) {
  const result = {};
  if (g < 2) return result;

  for (let s of fs.readFileSync('items/clean/gen' + g).toString().split('\n')) {
    result[toID(s)] = 1;
  }
  return result;
}

const previous = readItems(gen - 1);
const current = readItems(gen);

const previousDmg = dmg.ITEMS_BY_ID[gen - 1];
const currentDmg = dmg.ITEMS_BY_ID[gen];

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
  isUnreleased: 1,
  isChoice: 1,
  isBerry: 1,
  isGem: 1,
  megaStone: 1,
  megaEvolves: 1,
  zMove: 1,
  zMoveFrom: 1,
  zMoveType: 1,
  zMoveUser: 1,
  onPlate: 1,
  onDrive: 1,
  onMemory: 1
};

//for (let name in currentDmg) {
  //if (!current[toID(name)]) {
    //console.error(name);
    //process.exit(1);
  //}
//}

const result = {};
for (let id in current) {

  let old = oldDex.getItem(id);
  let val = dex.getItem(id);

  delete val['gen'];

  if (!val || (typeof val.exists === 'boolean' && !val.exists) || val.isNonstandard === 'gen2') {
    if (old && old.exists) {
      result[id] = {exists: false};
    } else {
      console.error([id, currentDmg[id], val.exists]);
    }
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
