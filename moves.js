const fs = require('fs');
const equal = require('deep-equal');

const dmg = require('dmgcalc');
const Dex = require('../Pokemon-Showdown/sim/dex');
const toID = require('../Pokemon-Showdown/sim/dex-data').Tools.getId;

const gen = Number(process.argv[2]) || 7;

function readMoves(g) {
  const result = {};
  if (!g) return result;

  // TODO remove deleted moves

  for (let i = 1; i <= g; i++) {
    for (let s of fs.readFileSync('moves/clean/gen' + i).toString().split('\n')) {
      let id = toID(s);
      if (id) result[id] = 1;
    }
  }
  return result;
}

const previous = readMoves(gen - 1);
const current = readMoves(gen);

const dmgM = dmg.MOVES_BY_ID[gen];
const oldDmgM = dmg.MOVES_BY_ID[gen - 1];

const dex = Dex.forFormat('gen' + gen + 'ou');
const oldDex = Dex.forFormat('gen' + (gen - 1) + 'ou');

//console.log([Object.keys(previous).length, Object.keys(current).length]);
//process.exit();

const requiredKeys = {
  id: 1,
  name: 1,
  num: 1,
  //gen: 1

  accuracy: 1,
  pp: 1,
  type: 1,
  target: 1
};

const optionalKeys = {
  desc: 1,
  shortDesc: 1,
  isNonstandard: 1,

  flags: 1,
  basePower: 1,
  priority: 1,
  category: 1,

  defensiveCategory: 1,
  critRatio: 1,
  isZ: 1,
  zMovePower: 1,
  zMoveBoosts: 1,
  multihit: 1,
  breaksProtect: 1,
  secondaries: 1,
  ignoreDefensive: 1,
  willCrit: 1,

  status: 1,
  sideCondition: 1,
  volatileStatus: 1,
  boosts: 1,
  self: 1,

  percentHealed: 1,
  recoil: 1
};

const volatiles = {};
const statuses = {};
const sideConditions = {};

function cleanup(val, id, dex, dmgVal, g) {
  if (val.flags) {
    if (gen < 7) {
      delete val.flags.dance;
    }
    if (gen < 6) {
      delete val.flags.bite;
      delete val.flags.bullet;
      delete val.flags.nonsky;
      delete val.flags.pulse;
    }
    if (gen < 5) {
      delete val.flags.distance;
      delete val.flags.powder;
    }
    if (gen < 4) {
      delete val.flags.gravity;
      //val.flags.heal;
      delete val.flags.punch;
    }
    if (gen < 3) {
      delete val.flags.contact;
      delete val.flags.reflectable;
      delete val.flags.snatch;
      delete val.flags.sound;
    }
    if (gen < 2) {
      delete val.flags.defrost;
      delete val.flags.protect;
    }
  }// else {
  //  val.flags = {};
  //}
  if ((Object.keys(val.flags).length === 0 && val.flags.constructor === Object)) {
    delete val.flags;
  }

  if (g < 4) {
    val.category = val.category === 'Status' ? 'Status' : undefined;
  }
  val.zMoveBoosts = val.zMoveBoosts;
  if (g < 7) {
    val.zMovePower = undefined;
    val.isZ = undefined;
    val.zMoveBoosts = undefined;
  }
  if (dmgVal) {
    val.percentHealed = dmgVal.percentHealed;
    val.recoil = dmgVal.hasRecoil;
  }

  if (val.selfBoost) {
    val.self = val.self || {};
    val.self.boosts = val.selfBoost.boosts;
  }

  if (val.sideCondition) val.sideCondition = toID(val.sideCondition);
  if (val.volatileStatus) val.volatileStatus = toID(val.volatileStatus);

  if (val.status) statuses[val.status] = 1;
  if (val.volatileStatus) volatiles[val.volatileStatus] = 1;
  if (val.sideCondition) sideConditions[val.sideCondition] = 1;

  cleanupSelf(val);

  if (val.secondary === null) delete val.secondary;
  if (val.secondaries === null) delete val.secondaries;

  if (val.secondary && (!val.secondaries || !equal([val.secondary], val.secondaries))) {
    console.error(val.name);
    process.exit(42);
  }

  const secondaries = [];
  if (val.secondaries) {
    for (let s of val.secondaries) {
      cleanupSecondary(s);
      if (s && !(Object.keys(s).length === 0 && s.constructor === Object)) {
        secondaries.push(s);
      }
    }
  }

  if (secondaries.length > 0) {
    val.secondaries = secondaries;
  } else {
    delete val.secondaries;
  }
}

function cleanupSecondary(s) {
  if (s) {
    if (s.ability) console.error(val.name);

    if (s.status) statuses[s.status] = 1;
    if (s.volatileStatus) volatiles[s.volatileStatus] = 1;

    s.onAfterHit = undefined;
    s.onHit = undefined;

    cleanupSelf(s);
  }
}

function cleanupSelf(v) {
  if (v.self) {
    v.self.onHit = undefined;

    if (v.self.sideCondition) sideConditions[v.self.sideCondition] = 1;
    if (v.self.volatileStatus) volatiles[v.self.volatileStatus] = 1;
  }

  if (!v.self || (Object.keys(v.self).length === 0 && v.self.constructor === Object)) {
    delete v.self;
  }
}

const result = {};
for (let id in current) {
  let old = oldDex.getMove(id);
  let val = dex.getMove(id);

  let dmgOld = oldDmgM[id];
  let dmgVal = dmgM[id];

  if (!val || !val.exists ) {
    console.error([id, val, dmgVal]);
    continue;
  }

  // CLEANUP ------------------------
  cleanup(old, id, oldDex, dmgOld, gen -1);
  cleanup(val, id, dex, dmgVal, gen);
  // CLEANUP ------------------------

  for (let k in val) {
    const required = requiredKeys[k];
    const optional = optionalKeys[k];

    if (!(required || optional)) {
      delete val[k];
    } else if (required && !val[k]) {
      console.error([id, k]);
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
      if (!old) {
        patch = val;
        break;
      }
      if (val[k] && !equal(val[k], old[k])) {
        if (k === 'secondaries') {
          patch[k] = patchSecondaries(val[k], old[k]);
        } else if (k === 'flags') {
          patch[k] = patchBoosts(val[k], old[k]); // yes, boosts
        } else if (k === 'self') {
          patch[k] = patchSelf(val[k], old[k]);
        } else if (k === 'boosts' || k === 'zMoveBoosts') {
          patch[k] = patchBoosts(val[k], old[k]);
        } else {
          patch[k] = val[k];
        }
      }
    }

    if (!(Object.keys(patch).length === 0 && patch.constructor === Object)) {
      result[id] = patch;
    }
  }
}

function patchBoosts(n, o) {
  let patch = {};
  if (!o) {
    return n;
  }

  for (let k in n) {
    if (n[k] && !equal(n[k], o[k])) {
      patch[k] = n[k];
    }
  }
  for (let k in o) {
    if (o[k] && !equal(o[k], n[k])) {
      patch[k] = 0; // erase boost!
    }
  }
  return patch;
}

function patchSecondaries(newSecondaries, oldSecondaries) {
  if (!oldSecondaries) {
    return newSecondaries;
  }

  if (newSecondaries.length === 1 && oldSecondaries.length === 1) {
    if (!equal(newSecondaries[0], oldSecondaries[0])) {
      patch = [patchSecondary(newSecondaries[0], oldSecondaries[0])];
    } else {
      console.error(newSecondaries, oldSecondaries);
      process.exit(53);
    }
  }
  return patch;
}

function patchSecondary(newSecondary, oldSecondary) {
  let patch = {};
  for (let k in newSecondary) {

    if (!oldSecondary) {
      patch = newSecondary;
      break;
    }
    if (newSecondary[k] && !equal(newSecondary[k], oldSecondary[k])) {
      if (k === 'boosts') {
        patch[k] = patchBoosts(newSecondary[k], oldSecondary[k]);
      } else if (k === 'self') {
        patch[k] = patchSelf(newSecondary[k], oldSecondary[k]);
      } else {
        patch[k] = newSecondary[k];
      }
    }
  }
  return patch;
}

function patchSelf(newSelf, oldSelf) {
  let patch = {};
  for (let k in newSelf) {

    if (!oldSelf) {
      patch = newSelf;
      break;
    }
    if (newSelf[k] && !equal(newSelf[k], oldSelf[k])) {
      if (k === 'boosts') {
        patch[k] = patchBoosts(newSelf[k], oldSelf[k]);
      } else {
        patch[k] = newSelf[k];
      }
    }
  }
  return patch;
}

console.log(JSON.stringify(result, null, 2));

//[statuses, volatiles, sideConditions].map(Object.keys).map((x) => console.error(JSON.stringify(x.sort(), null, 2)));

