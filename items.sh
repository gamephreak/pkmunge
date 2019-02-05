#!/bin/bash -x
set -e

#for gen in $(seq 1 7); do
    #node items.js $gen > "items/$gen.json" 2> "items/$gen.txt"
#done

#exit 1

node items.js 1 > "../pkmn/src/data/rby/items.json"
node items.js 2 > "../pkmn/src/data/gsc/items.json"
node items.js 3 > "../pkmn/src/data/adv/items.json"
node items.js 4 > "../pkmn/src/data/dpp/items.json"
node items.js 5 > "../pkmn/src/data/bw/items.json"
node items.js 6 > "../pkmn/src/data/xy/items.json"
node items.js 7 > "../pkmn/src/data/sm/items.json"
