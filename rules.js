const Dex = require('../Pokemon-Showdown/sim/dex');
const Formats = require('../pkmnx/wip/formats');

for (let format of Formats) {
  console.log(format.name + '\n');
  console.log(JSON.stringify(Dex.getRuleTable(Dex.getEffect(format.name)), null, 2));
}
