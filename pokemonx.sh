#!/bin/bash -x
#for gen in $(seq 1 7); do
    #node pokemonx.js $gen > "pokemonx/$gen.json"
#done

node pokemonx.js 1 > "../pkmnx/src/data/rby/species.json"
node pokemonx.js 2 > "../pkmnx/src/data/gsc/species.json"
node pokemonx.js 3 > "../pkmnx/src/data/adv/species.json"
node pokemonx.js 4 > "../pkmnx/src/data/dpp/species.json"
node pokemonx.js 5 > "../pkmnx/src/data/bw/species.json"
node pokemonx.js 6 > "../pkmnx/src/data/xy/species.json"
node pokemonx.js 7 > "../pkmnx/src/data/sm/species.json"

#node pokemonx.test.js 1 | sort > pokemonx/1.diff.txt
#node pokemonx.test.js 2 | sort > pokemonx/2.diff.txt
#node pokemonx.test.js 3 | sort > pokemonx/3.diff.txt
#node pokemonx.test.js 4 | sort > pokemonx/4.diff.txt
#node pokemonx.test.js 5 | sort > pokemonx/5.diff.txt
#node pokemonx.test.js 6 | sort > pokemonx/6.diff.txt
#node pokemonx.test.js 7 | sort > pokemonx/7.diff.txt
