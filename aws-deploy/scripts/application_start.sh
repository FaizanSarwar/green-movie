#!/bin/bash

# Start web server
cd /var/www/tgc-webfrontend
export HOME=/root
export PM2_HOME=/root/.pm2

pm2 start npm --name "TGC Web" -- start
pm2 startup
pm2 save
