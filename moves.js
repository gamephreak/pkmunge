const fs = require('fs');
        
const dmg = require('dmgcalc');
const Dex = require('../Pokemon-Showdown/sim/dex');
const toID = require('../Pokemon-Showdown/sim/dex-data').Tools.getId;

const gen = Number(process.argv[2]) || 7;

function readMoves(g) {
  const result = {};
  if (!g) return result;

  // TODO remove deleted moves

  for (let i = 1; i <= g; i++) {
    for (let s of fs.readFileSync('tmp/moves/clean/gen' + i).toString().split('\n')) {
      let id = toID(s);
      if (id) result[id] = 1;
    }
  }
  return result;
}

const previous = readMoves(gen - 1);
const current = readMoves(gen);
const dex = Dex.forFormat('gen' + gen + 'ou');
const moves = dmg.MOVES_BY_ID[gen];

//console.log([Object.keys(previous).length, Object.keys(current).length]);
//process.exit();

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
    let val = {};
    
    let psMove = dex.getMove(id);
    let dmgMove = moves[id];


    if (!psMove || !psMove.exists || !dmgMove) {
        console.error([id, psMove, dmgMove]);
        continue;
    }

    //for (let k in val) {
      //const required = requiredKeys[k];
      //const optional = optionalKeys[k];

      //if (!(required || optional)) {
        //delete val[k];
      //} else if (required && !val[k]) {
        //console.error(id);
      //} else if (optional && !val[k]) {
        //delete val[k];
      //}
    //}
    //val.gen = gen;
    //result[id] = val;
  }
}

//console.log(JSON.stringify(result, null, 2));
