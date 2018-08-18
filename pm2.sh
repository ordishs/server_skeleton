#!/bin/bash

cd $(dirname $BASH_SOURCE)

./server/node_modules/.bin/pm2 $@
