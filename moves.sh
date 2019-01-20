#!/bin/bash -x
set -e

#for gen in $(seq 1 7); do
#    node moves.js $gen > "moves/$gen.json" #2> "moves/$gen.txt"
#done

#exit 1

node moves.js 1 > "../pkmn/data/rby/moves.json"
node moves.js 2 > "../pkmn/data/gsc/moves.json"
node moves.js 3 > "../pkmn/data/adv/moves.json"
node moves.js 4 > "../pkmn/data/dpp/moves.json"
node moves.js 5 > "../pkmn/data/bw/moves.json"
node moves.js 6 > "../pkmn/data/xy/moves.json"
node moves.js 7 > "../pkmn/data/sm/moves.json"

exit 1

node moves.test.js 1 | sort > moves/1.diff.txt
node moves.test.js 2 | sort > moves/2.diff.txt
node moves.test.js 3 | sort > moves/3.diff.txt
node moves.test.js 4 | sort > moves/4.diff.txt
node moves.test.js 5 | sort > moves/5.diff.txt
node moves.test.js 6 | sort > moves/6.diff.txt
node moves.test.js 7 | sort > moves/7.diff.txt
