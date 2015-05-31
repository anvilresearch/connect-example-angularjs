#!/bin/sh

if [ "$#" -ne 2 ]; then
  sed "s/CLIENT_ID/$1/g" -i app/rp.html app/scripts/app.js
  sed "s/HOST/$1/$2" -i app/rp.html app/scripts/app.js
else
  echo Please pass client id and hosh as argument. for example: bin/replace-client-id.sh 6d327f50-0aa7-4b0a-9bab-b558d9027e27 http://my-server.com:9000
fi

