#!/bin/bash 

cd /home/ubuntu/backendCode

pm2 stop all

pm2 delete all

pm2 start app.js

pm2 startup

sudo env PATH=$PATH:/home/ubuntu/.nvm/versions/node/v16.20.0/bin /home/ubuntu/.nvm/versions/node/v16.20.0/lib/node_modules/pm2/bin/pm2 startup systemd -u ubuntu --hp /home/ubuntu

pm2 save