#!/bin/sh


if [ "$#" -eq 2 ]; then
  sed s,CLIENT_ID,$1,g -i app/rp.html app/scripts/app.js
  sed s,HOST_URL,$2,g -i app/rp.html app/scripts/app.js
else
  echo Please pass client id and host as argument. for example: bin/replace-client-id.sh 6d327f50-0aa7-4b0a-9bab-b558d9027e27 http://my-server.com:9000
fi

