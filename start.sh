#!/bin/bash

cd $(dirname $BASH_SOURCE)

# The following commented lines are to remind us how to forward 80 and 443 traffic
# sudo iptables -A PREROUTING -t nat -i eth0 -p tcp --dport 80 -j REDIRECT --to-port 3000
# sudo iptables -A PREROUTING -t nat -i eth0 -p tcp --dport 443 -j REDIRECT --to-port 3443
# sudo iptables -t nat -L
# sudo iptables -t nat -L --line-numbers
# sudo iptables -t nat -D PREROUTING <n>

./server/node_modules/.bin/pm2 start server.config.js $@

echo "Use './tailLog.sh' to see current activity."
