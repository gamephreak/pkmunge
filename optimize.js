const fs = require('fs');

const Dex = require('../Pokemon-Showdown/sim/dex');

const dex = Dex; //.forFormat('gen' + gen + 'ou');

function numEffects(o) {
  let effects = {};
  for (let k in o) {
    if (o[k].effect) {
      effects[k] = o[k];
      console.log(k);
    }
  }
  console.log('\n');
  return effects;
}

console.log(`
    statuses: ${Object.keys(dex.data.Statuses).length}
    moves: ${Object.keys(dex.data.Movedex).length}
    abilities: ${Object.keys(dex.data.Abilities).length}
    items: ${Object.keys(dex.data.Items).length}
    formats: ${Object.keys(dex.data.Formats).length}`);

console.log(`
    statuses: ${Object.keys(numEffects(dex.data.Statuses)).length}
    moves: ${Object.keys(numEffects(dex.data.Movedex)).length}
    abilities: ${Object.keys(numEffects(dex.data.Abilities)).length}
    items: ${Object.keys(numEffects(dex.data.Items)).length}
    formats: ${Object.keys(numEffects(dex.data.Formats)).length}`);


