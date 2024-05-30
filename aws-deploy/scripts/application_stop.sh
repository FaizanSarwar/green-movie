#!/bin/bash

set +e
which pm2
RET=$?
set -e
if [ $RET -eq 0 ] ; then
    pm2 kill
    pm2 cleardump
    pm2 unstartup
fi
