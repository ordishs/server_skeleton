#!/bin/bash

cd $(dirname $BASH_SOURCE)

tail -f ./server.log | ./server/node_modules/.bin/pino