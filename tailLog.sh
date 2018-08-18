#!/bin/bash

cd $(dirname $BASH_SOURCE)

tail -f ./server.log | ./node_modules/.bin/pino