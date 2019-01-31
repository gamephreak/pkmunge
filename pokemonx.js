const fs = require('fs');

const pkmn = require('pkmn');
const Dex = require('../Pokemon-Showdown/sim/dex');
const toID = require('../Pokemon-Showdown/sim/dex-data').Tools.getId;

var equal = require('deep-equal');

const gen = Number(process.argv[2]) || 7;


const dex = Dex.forFormat('gen' + gen + 'ou');
const oldDex = Dex.forFormat('gen' + (gen - 1) + 'ou');


const optionalKeys = {
  eggGroups: 1,
  genderRatio: 1,
  evoLevel: 1,
  maleOnlyHidden: 1,
  unreleasedHidden: 1,
  eventOnly: 1,
  eventPokemon: 1,
  learnset: 1,
  incompatibleMoves: 1,
  battleOnly: 1,
  requiredAbility: 1,
  requiredItems: 1,
  requiredMove: 1
};


const current = pkmn.Species.forGen(gen);
const previous = gen === 1 ? {} : pkmn.Species.forGen(gen - 1);

function cleanupEventPokemon(eps, g) {
  if (!eps || !eps.length) return undefined;
  let result = [];
  for (let ep of eps) {
    if (ep.generation > g) continue;
    ep.gen = ep.generation;
    delete ep.generation;

    // TODO ???

    result.push(ep);
  }

  return result.length ? result : undefined;
}


function cleanup(val, id, g) {
  if (val.speciesid !== id) {
    console.error(val);
    process.exit(16);
  }

  if (gen < 2) {
    delete val.eggGroups;
    delete val.genderRatio;
  } else {
    val.genderRatio = val.genderRatio || (
        val.gender === 'M' ? {M: 1, F: 0} :
	val.gender === 'F' ? {M: 0, F: 1} :
        val.gender === 'N' ? {M: 0, F: 0} :
			     {M: 0.5, F: 0.5});
  }

  if (val.evoLevel) {
    if (!val.evos || !val.evos.length || !pkmn.Species.get(val.evos[0], g)) {
      delete val.evoLevel;
    }
  }

  // TODO don't seem to be carried through?
  if (gen < 5) {
    delete val.maleOnlyHidden;
    delete val.unreleasedHidden;
  }

  val.eventPokemon = cleanupEventPokemon(val.eventPokemon, g);

  // LEARNSET
  const learnset = {};
  for (let id in val.learnset) {
    // Ignore moves in the learnset which didn't exist
    if (!pkmn.Moves.get(id, g)) continue;

    let mss = [];
    for (let ms of val.learnset[id]) {
      // Ignore moves learned in later gens unless RBY tradeback
      moveGen = Number(ms[0]);
      if (moveGen <= g || (moveGen === 2 && g === 1)) {
        mss.push(ms);
      }
    }
    if (mss.length) {
      learnset[id] = mss;
    }
  }
  val.learnset = learnset;

  // TODO incompatibleMoves

  if (val.requiredAbility && (gen < 3  || !pkmn.Abilities.get(val.requiredAbility, g))) {
    delete val.requiredAbility;
  }

  if (val.requiredItem) {
    val.requiredItems = [val.requiredItem];
    delete val.requiredItem;
  }
  if (val.requiredItems && gen < 2) {
    delete val.requiredItems;
  }

  if (val.requiredMove && !pkmn.Moves.get(val.requiredMove, g)) {
    delete val.requiredMove;
  }

  return val;
}

const result = {};
for (let id in current) {

  let old = oldDex.getTemplate(id);
  let val = dex.getTemplate(id);

  // CLEANUP ------------------------
  cleanup(old, id, gen -1);
  cleanup(val, id, gen);
  // CLEANUP ------------------------

  for (let k in val) {
    const optional = optionalKeys[k];

    if (!optional) {
      delete val[k];
    } else if (optional && !val[k]) {
      delete val[k];
    }
  }

  //if (!previous[id]) {
    result[id] = val;
  //} else if (!equal(val, old)) {
    //let patch = {};

    //for (let k in optionalKeys) {
      //if (val[k] && !equal(val[k], old[k])) {
        //// Event Pokemon: always additions, never patching
        //// Learnset: always additions
        //// Gender ratio: OK to just replace entire thing (only 2 keys always)
        //// TODO: do eggGroups or requiredItems ever change?

        ////if (k === 'incompatibleMoves') {
          ////patch[k] = patchIncompatibleMoves(val[k], old[k]);
        ////} else {
          //patch[k] = val[k];
        ////}
      //}
    //}

    //if (!(Object.keys(patch).length === 0 && patch.constructor === Object)) {
      //result[id] = patch;
    //}
  //}
}

console.log(JSON.stringify(result, null, 2));

function patchBaseStats(newBS, oldBS) {
  let patch = {};
  for (let k in newBS) {
    if (newBS[k] && !equal(newBS[k], oldBS[k])) {
      patch[k] = newBS[k];

    }
  }
  return patch;
}
