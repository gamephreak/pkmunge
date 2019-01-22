#!/bin/bash -x
set -e

for gen in $(seq 2 7); do
    node inferred-items.js $gen > "items/inferred/$gen.json"
done

