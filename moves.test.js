const gen = Number(process.argv[2]) || 7;

const fs = require('fs');
const equal = require('deep-equal');

const dmg = require('dmgcalc').MOVES_BY_ID[gen];
const pkmn = require('pkmn');
const psim = require('../Pokemon-Showdown/sim/dex').forFormat('gen' + gen + 'ou');

function checkDmg(p, id) {
  let d = dmg[id];
  if (!d) {
    console.log(`|DMG MISSING ${id}`);
    return;
  }

  if (!equal(p.name, d.name)) console.log(`DMG NAME ${id}: pkmn: '${p.name}', dmg: '${d.name}'`);
  if (!equal(p.type, d.type)) console.log(`DMG TYPE ${id}: pkmn: '${p.type}', dmg: '${d.type}'`);
  if (gen >= 4 && !equal(p.category, d.category || 'Status')) console.log(`DMG CATEGORY ${id}: pkmn: '${p.category}', dmg: '${d.category}'`);
  if (!!(p.secondaries && !!p.secondaries.length) !== !!d.hasSecondaryEffect) console.log(`DMG HASSECONDARY ${id}: pkmn: '${JSON.stringify(p.secondaries)}', dmg: '${d.hasSecondaryEffect}'`);
  if (gen >= 3 && !!(p.flags && !!p.flags.contact) !== !!d.makesContact) console.log(`DMG MAKESCONTACT ${id}: pkmn: '${JSON.stringify(p.flags)}', dmg: '${d.makesContact}'`);
  if (!equal(p.recoil, d.recoil)) console.log(`DMG RECOIL ${id}: pkmn: '${p.recoil}', dmg: '${d.hasRecoil}'`);
  if (!equal(p.willCrit, d.alwaysCrit)) console.log(`DMG ALWAYSCRIT ${id}: pkmn: '${p.willCrit}', dmg: '${d.alwaysCrit}'`);
  if (!!(p.flags && !!p.flags.heal) !== !!d.givesHealth) console.log(`DMG GIVESHEALTH ${id}: pkmn: '${JSON.stringify(p.flags)}', dmg: '${d.givesHealth}'`);
  // TODO percentHealed
  if (gen >= 4 && !!(p.flags && !!p.flags.punch) !== !!d.isPunch) console.log(`DMG ISPUNCH ${id}: pkmn: '${JSON.stringify(p.flags)}', dmg: '${d.isPunch}'`);
  if (gen >= 6 && !!(p.flags && !!p.flags.bite) !== !!d.isBite) console.log(`DMG ISBUTE ${id}: pkmn: '${JSON.stringify(p.flags)}', dmg: '${d.isBite}'`);
  if (gen >= 6 && !!(p.flags && !!p.flags.bullet) !== !!d.isBullet) console.log(`DMG ISBULLET ${id}: pkmn: '${JSON.stringify(p.flags)}', dmg: '${d.isBullet}'`);
  if (gen >= 3 && !!(p.flags && !!p.flags.sound) !== !!d.isSound) console.log(`DMG ISSOUND ${id}: pkmn: '${JSON.stringify(p.flags)}', dmg: '${d.isSound}'`);
  if (gen >= 6 && !!(p.flags && !!p.flags.pulse) !== !!d.isPulse) console.log(`DMG ISPULSE ${id}: pkmn: '${JSON.stringify(p.flags)}', dmg: '${d.isPulse}'`);
  if (!equal(p.priority === 0, !!d.hasPriority)) console.log(`DMG HASPRIORITY ${id}: pkmn: '${p.priority}', dmg: '${d.hasPriority}'`);
  // TODO dropsStats
  if (!equal(p.defensiveCategory === 'Physical', !!d.dealsPhysicalDamage)) console.log(`DMG DEALSPHYSICAL ${id}: pkmn: '${p.defensiveCategory}', dmg: '${d.dealsPhysicalDamage}'`);
  if (!equal(p.izZ, d.isZ)) console.log(`DMG ISZ ${id}: pkmn: '${p.isZ}', dmg: '${d.isZ}'`);
  if (!equal(p.breaksProtect, d.bypassesProtect)) console.log(`DMG BYPASSPROTECT ${id}: pkmn: '${p.breaksProtect}', dmg: '${d.bypassesProtect}'`);
  if (!equal(p.zMovePower, d.zp)) console.log(`DMG ZP ${id}: pkmn: '${p.zMovePower}', dmg: '${d.zMovePower}'`);
  if (!equal(!!p.multihit, !!d.isMultiHit)) console.log(`DMG ISMULTIHIT ${id}: pkmn: '${p.multihit}', dmg: '${d.isMultiHit}'`);
  if (!equal(p.multihit === 2, !!d.isTwoHit)) console.log(`DMG ISTWOHIT ${id}: pkmn: '${p.multihit}', dmg: '${d.isTwoHit}'`);

  // TODO: hardcode 'ignoresBurn' and 'usesHighestAttackStat'
}

function sequal(p, s) {
  return equal(p, s) || (equal(p, undefined) && equal(s, ''));
}

function checkPsim(p, id) {
  let s = psim.getTemplate(id);;
  if (!s) {
    console.log(`PSIM MISSING ${id}`);
  }

  //if (!equal(p.id, s.speciesid)) console.log(`PSIM ID ${id}: pkmn: '${p.id}', psim: '${s.speciesid}'`);
  //if (!equal(p.name, s.species)) console.log(`PSIM NAME ${id}: pkmn: '${p.name}', psim: '${s.species}'`);
  //if (!equal(p.type1, s.types[0])) console.log(`PSIM TYPE1 ${id}: pkmn: '${p.type1}', psim: '${s.types[0]}'`);
  //if (!sequal(p.type2, s.types[1])) console.log(`PSIM TYPE2 ${id}: pkmn: '${p.type2}', dmg: '${s.types[1]}'`);
  //if (!equal(p.baseStats, s.baseStats)) console.log(`PSIM STATS ${id}: pkmn: '${p.baseStats}', psim: '${s.baseStats}'`);
  //if (!equal(p.weight, s.weightkg)) console.log(`PSIM WEIGHT ${id}: pkmn: '${p.weight}', psim: '${s.weightkg}'`);
  //if (p.gen > 1 && !sequal(p.gender, s.gender)) console.log(`PSIM GENDER ${id}: pkmn: '${p.gender}', psim: '${s.gender}'`);
  //if (p.gen > 2 && !equal(p.abilities, s.abilities)) console.log(`PSIM ABILITIES ${id}: pkmn: '${p.abilities}', psim: '${s.abilities}'`);
  //if (!equal(p.tier, s.tier)) console.log(`PSIM TIER ${id}: pkmn: '${p.tier}', psim: '${s.tier}'`);
  //if (!sequal(p.prevo, s.prevo)) console.log(`PSIM PREVO ${id}: pkmn: '${p.prevo}', psim: '${s.prevo}'`);
  //if (!sequal(p.evos, s.evos)) console.log(`PSIM EVOS ${id}: pkmn: '${p.evos}', psim: '${s.evos}'`);
  //if (!sequal(p.baseSpecies, s.baseSpecies)) console.log(`PSIM BASESPECIES ${id}: pkmn: '${p.baseSpecies}', psim: '${s.baseSpecies}'`);
  //if (!sequal(p.baseForme, s.baseForme)) console.log(`PSIM BASEFORME ${id}: pkmn: '${p.baseForme}', psim: '${s.baseForme}'`);
  //if (!sequal(p.forme, s.forme)) console.log(`PSIM FORME ${id}: pkmn: '${p.forme}', psim: '${s.forme}'`);
  //if (!sequal(p.formeLetter, s.formeLetter)) console.log(`PSIM FORMELETTER ${id}: pkmn: '${p.formeLetter}', psim: '${s.formeLetter}'`);
  //if (!sequal(p.otherFormes, s.otherFormes)) console.log(`PSIM OTHERFORMES ${id}: pkmn: '${p.otherFormes}', psim: '${s.otherFormes}'`);
  //if (!sequal(p.cosmeticForms, s.otherForms)) console.log(`PSIM COSMETICFORMS ${id}: pkmn: '${p.otherForms}', psim: '${s.cosmeticForms}'`);
}

// MAIN

(async () => {
  const moves = await pkmn.Moves.forGen(gen);
  for (let id in moves) {
    let p = moves[id];
    checkDmg(p, id);
    checkPsim(p, id);
  }

  for (let id in psim.data.Movedex) {
    let s = psim.getTemplate(id);
    if (!s.gen || s.gen > gen || s.isNonstandard) continue;

    let p = moves[id];
    if (!p) {
      console.log(`|PKMN MISSING ${id} (PSIM)`);
    }
  }

  for (let id in dmg) {
    let p = moves[id];
    if (!p) {
      console.log(`|PKMN MISSING ${id} (DMG)`);
    }
  }
})();
