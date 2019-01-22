const gen = Number(process.argv[2]) || 7;

// https://bulbapedia.bulbagarden.net/wiki/Held_item#List_of_Abilities_and_moves_affecting_held_items
//
// checkpouch
// frisk
// gluttony
// harvest
// klutz
// magician
// pickup
// pickpocket
// stickyhold
// symbiosis
// unburden
// unnerve
//
// acrobatics
// belch
// bestow
// bugbite
// covet
// embargo
// fling
// healblock
// incinerate
// knockoff
// magicroom
// naturalgift
// pluck
// recycle
// switcheroo
// thief
// trick

const pkmn = require('pkmn');

// type Type = 'observe' | // observed/revealed
//             'infer' | // deducible/percevied/inferrable
//             'probserve" | 
//             'prob';

const items = {};
for (let id in pkmn.Items.forGen(gen)) {
  items[id] = {group: null, type: "infer" };
}

console.log(JSON.stringify(items, null, 2));
