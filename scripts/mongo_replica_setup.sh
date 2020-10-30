#!/bin/bash

MONGODB1=mongo1:27018
MONGODB2=mongo2:27019
MONGODB3=mongo3:27020

until curl http://${MONGODB1}/serverStatus\?text\=1 2>&1 | grep uptime | head -1; do
  sleep 1
done

mongo --host ${MONGODB1} <<EOF
var cfg = {
    "_id": "rs0",
    "protocolVersion": 1,
    "version": 1,
    "members": [
        {
            "_id": 0,
            "host": "${MONGODB1}",
            "priority": 2
        },
        {
            "_id": 1,
            "host": "${MONGODB2}",
            "priority": 0
        },
        {
            "_id": 2,
            "host": "${MONGODB3}",
            "priority": 0
        }
    ],settings: {chainingAllowed: true}
};
rs.initiate(cfg, { force: true });
rs.reconfig(cfg, { force: true });
rs.slaveOk();
db.getMongo().setReadPref('nearest');
db.getMongo().setSlaveOk(); 
EOF
