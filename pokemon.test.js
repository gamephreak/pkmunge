const gen = Number(process.argv[2]) || 7;

const fs = require('fs');
const equal = require('deep-equal');

const dmg = require('dmgcalc').POKEDEX_BY_ID[gen];
const pkmn = require('pkmn');
const psim = require('../Pokemon-Showdown/sim/dex').forFormat('gen' + gen + 'ou');

function checkDmg(p, id) {
  let d = dmg[id];
  if (!d) {
    console.log(`DMG MISSING ${id}`);
    return;
  }

  if (!equal(p.name, d.name)) console.log(`DMG NAME ${id}: pkmn: '${p.name}', dmg: '${d.name}'`);
  if (!equal(p.type1, d.type1)) console.log(`DMG TYPE1 ${id}: pkmn: '${p.type1}', dmg: '${d.type1}'`);
  if (!equal(p.type2, d.type2)) console.log(`DMG TYPE2 ${id}: pkmn: '${p.type2}', dmg: '${d.type2}'`);
  // TODO basestats with spc
  if (!equal(p.weight, d.weight)) console.log(`DMG WEIGHT ${id}: pkmn: '${p.weight}', dmg: '${d.weight}'`);
  if (!!(p.evos && !!p.evos.length) !== !!d.canEvolve) console.log(`DMG CANEVOLVE ${id}: pkmn: '${p.evos}', dmg: '${d.canEvolve}'`);
  const toGender = (g) => {
    return g === 'genderless' ? 'N' :
           g === 'male' ? 'M' :
           g === 'female' ? 'F' :
           undefined;
  }
  if (!equal(p.gender, toGender(d.gender))) console.log(`DMG GENDER ${id}: pkmn: '${p.gender}', dmg: '${d.gender}'`);
  if (!equal(p.abilities, d.abilities)) console.log(`DMG ABILITIES ${id}: pkmn: '${p.abilities}', dmg: '${d.abilities}'`);
  if (!equal(!!(p.forme !== p.baseForme), !!d.isAlternateForme)) console.log(`DMG ALTERNATE FORME ${id}: pkmn: '${p.forme}' '${p.baseForme}', dmg: '${d.isAlternateForme}'`);
  // TODO formes
}

function sequal(p, s) {
  return equal(p, s) || (equal(p, undefined) && equal(s, ''));
}

function checkPsim(p, id) {
  let s = psim.getTemplate(id);;
  if (!s) {
    console.log(`PSIM MISSING ${id}`);
  }

  if (!equal(p.id, s.speciesid)) console.log(`PSIM ID ${id}: pkmn: '${p.id}', psim: '${s.speciesid}'`);
  if (!equal(p.name, s.species)) console.log(`PSIM NAME ${id}: pkmn: '${p.name}', psim: '${s.species}'`);
  if (!equal(p.type1, s.types[0])) console.log(`PSIM TYPE1 ${id}: pkmn: '${p.type1}', psim: '${s.types[0]}'`);
  if (!sequal(p.type2, s.types[1])) console.log(`PSIM TYPE2 ${id}: pkmn: '${p.type2}', dmg: '${s.types[1]}'`);
  if (!equal(p.baseStats, s.baseStats)) console.log(`PSIM STATS ${id}: pkmn: '${p.baseStats}', psim: '${s.baseStats}'`);
  if (!equal(p.weight, s.weightkg)) console.log(`PSIM WEIGHT ${id}: pkmn: '${p.weight}', psim: '${s.weightkg}'`);
  if (p.gen > 1 && !sequal(p.gender, s.gender)) console.log(`PSIM GENDER ${id}: pkmn: '${p.gender}', psim: '${s.gender}'`);
  if (p.gen > 2 && !equal(p.abilities, s.abilities)) console.log(`PSIM ABILITIES ${id}: pkmn: '${p.abilities}', psim: '${s.abilities}'`);
  if (!equal(p.tier, s.tier)) console.log(`PSIM TIER ${id}: pkmn: '${p.tier}', psim: '${s.tier}'`);
  if (!sequal(p.prevo, s.prevo)) console.log(`PSIM PREVO ${id}: pkmn: '${p.prevo}', psim: '${s.prevo}'`);
  if (!sequal(p.evos, s.evos)) console.log(`PSIM EVOS ${id}: pkmn: '${p.evos}', psim: '${s.evos}'`);
  if (!sequal(p.baseSpecies, s.baseSpecies)) console.log(`PSIM BASESPECIES ${id}: pkmn: '${p.baseSpecies}', psim: '${s.baseSpecies}'`);
  if (!sequal(p.baseForme, s.baseForme)) console.log(`PSIM BASEFORME ${id}: pkmn: '${p.baseForme}', psim: '${s.baseForme}'`);
  if (!sequal(p.forme, s.forme)) console.log(`PSIM FORME ${id}: pkmn: '${p.forme}', psim: '${s.forme}'`);
  if (!sequal(p.formeLetter, s.formeLetter)) console.log(`PSIM FORMELETTER ${id}: pkmn: '${p.formeLetter}', psim: '${s.formeLetter}'`);
  if (!sequal(p.otherFormes, s.otherFormes)) console.log(`PSIM OTHERFORMES ${id}: pkmn: '${p.otherFormes}', psim: '${s.otherFormes}'`);
  if (!sequal(p.cosmeticForms, s.otherForms)) console.log(`PSIM COSMETICFORMS ${id}: pkmn: '${p.otherForms}', psim: '${s.cosmeticForms}'`);
}

// MAIN

const species = pkmn.Species.forGen(gen);
for (let id in species) {
  let p = species[id];
  checkDmg(p, id);
  checkPsim(p, id);
}

for (let id in psim.data.Pokedex) {
  let s = psim.getTemplate(id);
  if (s.gen > gen || s.isNonstandard) continue;

  let p = species[id];
  if (!p) {
    console.log(`PKMN MISSING ${id} (PSIM)`);
  }
}

for (let id in dmg) {
  let p = species[id];
  if (!p) {
    console.log(`PKMN MISSING ${id} (DMG)`);
  }
}
