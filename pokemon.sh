#!/bin/bash -x
#for gen in $(seq 1 7); do
    #node pokemon.js $gen > "pokemon/$gen.json"
#done

node pokemon.js 1 > "../pkmn/data/rby/pokemon.json"
node pokemon.js 2 > "../pkmn/data/gsc/pokemon.json"
node pokemon.js 3 > "../pkmn/data/adv/pokemon.json"
node pokemon.js 4 > "../pkmn/data/dpp/pokemon.json"
node pokemon.js 5 > "../pkmn/data/bw/pokemon.json"
node pokemon.js 6 > "../pkmn/data/xy/pokemon.json"
node pokemon.js 7 > "../pkmn/data/sm/pokemon.json"

node pokemon.test.js 1 | sort > pokemon/1.diff.txt
node pokemon.test.js 2 | sort > pokemon/2.diff.txt
node pokemon.test.js 3 | sort > pokemon/3.diff.txt
node pokemon.test.js 4 | sort > pokemon/4.diff.txt
node pokemon.test.js 5 | sort > pokemon/5.diff.txt
node pokemon.test.js 6 | sort > pokemon/6.diff.txt
node pokemon.test.js 7 | sort > pokemon/7.diff.txt
