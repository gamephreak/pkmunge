const fs = require('fs');

const dmg = require('dmgcalc');
const Dex = require('../Pokemon-Showdown/sim/dex');
const toID = require('../Pokemon-Showdown/sim/dex-data').Tools.getId;

var equal = require('deep-equal');

const gen = Number(process.argv[2]) || 7;

const GEN4CAPPREVOS = [-101, -102, -103, -104, -116, -117, -118, -119 ];
const GEN5CAPPREVOS = [-106, -107, -108, -109, -110];
const GEN6CAPPREVOS = [-111, -112, -113, -114, -115];
const GEN7CAPPREVOS = [-120];

function include(num, arr) {
  return arr.indexOf(num) !== -1;
}

function toGen(mon) {
  if (include(mon.forme, [ "Alola", "Totem", "Starter", "Alola-Totem", "Ash"])) {
    return 7;
  } else if (include(mon.forme, [ "Mega", "Mega-X", "Mega-Y", "Primal"])) {
    return 6;
  }

  if (mon.baseSpecies === "Pikachu" || mon.baseSpecies === "Zygarde" || mon.baseSpecies === 'Arceus') {
    return mon.gen;
  }

  if (mon.baseSpecies === "Pichu" && mon.species !== mon.baseSpecies) {
    return 4;
  }

  let num = mon.num;
  if (num > 721 || (num <= -23 && num >= -27) || include(num, GEN7CAPPREVOS))  {
    return 7;
  } else if (num > 649 || (num <= -17 && num >= -22) || include(num, GEN6CAPPREVOS))  {
    return 6;
  } else if (num > 493 || (num <= -12 && num >= -17) || include(num, GEN5CAPPREVOS)) {
    return 5;
  } else if (num > 386 || (num <= -1 && num >= -11) || include(num, GEN4CAPPREVOS)) {
    return 4;
  } else if (num > 251) {
    return 3;
  } else if (num > 151) {
    return 2;
  } else if (num > 0) {
    return 1;
  }
}

const previousDmg = dmg.ITEMS_BY_ID[gen - 1];
const currentDmg = dmg.ITEMS_BY_ID[gen];

const dex = Dex.forFormat('gen' + gen + 'ou');
const oldDex = Dex.forFormat('gen' + (gen - 1) + 'ou');

const requiredKeys = {
  id: 1,
  name: 1,
  num: 1
};

const optionalKeys = {
  desc: 1,
  shortDesc: 1,
  isNonstandard: 1,
  isUnreleased: 1,

  type1: 1,
  type2: 1,
  weight: 1,
  cosmeticForms: 1,

  baseStats: 1,
  gender: 1,
  abilities: 1,
  tier: 1,
  prevo: 1,
  evos: 1,
  baseSpecies: 1,
  baseForme: 1,
  forme: 1,
  formeLetter: 1,
  otherFormes: 1
};

/*
for (let g = 6; g <= 7; g++) {
  let mons = [];
  let ns = [];
  let nb = [];

  let mons0 = [];
  let ns0 = [];
  let nb0 = [];

  for (const k in dex.data.Pokedex) {
    let mon = dex.getTemplate(k);

    if (toGen(mon) <= g) {
      mons.push(mon.species);
      if (mon.isNonstandard) {
        ns.push(mon.species);
      }
      if (mon.species !== mon.baseSpecies && !mon.isNonstandard) {
        nb.push(mon.species);
      }
    }

    if (mon.gen <= g) {
      mons0.push(mon.species);
      if (mon.isNonstandard) {
        ns0.push(mon.species);
      }
      if (mon.species !== mon.baseSpecies && !mon.isNonstandard) {
        nb0.push(mon.species);
      }
    }
  }
  console.log(`${g}: ${mons.length} (${nb.length}, ${ns.length})`);
  console.log(`${g}: ${mons0.length} (${nb0.length}, ${ns0.length})`);
  console.log(JSON.stringify(nb, null, 2));
  break;
}
*/

function getMons(g, dex) {
  const mons = {};
  for (const k in dex.data.Pokedex) {
    let mon = dex.getTemplate(k);
    if (toGen(mon) <= g) {
      mons[mon.speciesid] = mon;
    }
  }
  return mons;
}

const current = getMons(gen, dex);
const previous = gen === 1 ? {} : getMons(gen - 1, oldDex);

const TIERS = ['Uber','OU','UUBL','UU','RUBL','RU','NUBL','NU','PUBL','PU','LC', 'NFE','Unreleased','Illegal','CAP','CAP NFE','CAP LC', 'LC Uber', 'AG'];


function cleanup(val, id, dex, g) {
  if (val.speciesid !== id) {
    console.error(val);
    process.exit(16);
  }

  val.id = val.speciesid;
  val.name = val.species;
  val.weight = val.weightkg;
  val.cosmeticForms = val.otherForms;
  val.type1 = val.types[0];
  if (val.types.length > 1) {
    val.type2 = val.types[1];
  }
  if (g < 2) {
    delete val['gender'];
  }
  if (g < 3) {
    delete val['abilities'];
  }
  if (val.prevo && toGen(dex.getTemplate(val.prevo)) > g) {
    delete val['prevo'];
  }

  if (val.tier) {
    val.tier = val.tier.replace(/(\(|\))/g, '');
    if (!include(val.tier, TIERS)) {
      console.error([id, val.tier]);
      delete val['tier'];
    }
  }

  if (val.evos) {
    let evos = [];
    for (let evo of val.evos) {
      if (toGen(dex.getTemplate(evo)) <= g) {
        evos.push(evo);
      }
    }
    if (evos.length > 0) {
      val.evos = evos;
    } else {
      delete val['evos'];
    }
  }

  if (val.otherFormes) {
    let fs = [];
    for (let f of val.otherFormes) {
      if (toGen(dex.getTemplate(f)) <= g) {
        fs.push(f);
      }
    }
    if (fs.length > 0) {
      val.otherFormes = fs;
    } else {
      delete val['otherFormes'];
    }
  }

  //if (val.cosmeticForms) {
    //let fs = [];
    //for (let f of val.cosmeticForms) {
      //if (toGen(dex.getTemplate(f)) <= g) {
        //fs.push(f);
      //}
    //}
    //if (fs.length > 0) {
      //val.cosmeticForms = fs;
    //} else {
      //delete val['cosmeticForms'];
    //}
  //}


  return val;
}

const result = {};
for (let id in current) {

  let old = oldDex.getTemplate(id);
  let val = dex.getTemplate(id);

  let g = toGen(val);
  if (g !== val.gen && !val.isNonstandard) {
    console.error(val);
    process.exit(42);
  }
  if (g > gen) {
    continue;
  }
  delete val['gen'];

  if (!val || (typeof val.exists === 'boolean' && !val.exists) || val.isNonstandard === 'gen2') {
    if (old && old.exists) {
      result[id] = {exists: false};
    } else {
      console.error([id, currentDmg[id], val.exists]);
    }
    continue;
  }

  // CLEANUP ------------------------
  cleanup(old, id, oldDex, gen -1);
  cleanup(val, id, dex, gen);
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
    if (g !== gen) process.exit(15);
    val.gen = g; // == gen
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

        if (k === 'baseStats') {
          patch[k] = patchBaseStats(val[k], old[k]);
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

// TODO check result to ensure it equals dmgcalc!

console.log(JSON.stringify(result, null, 2));

function patchBaseStats(newBS, oldBS) {
  let patch = {};
  for (let k in newBS) {
    if (!equal(newBS[k], oldBS[k])) {
      patch[k] = newBS[k];

    }
  }
  return patch;
}
