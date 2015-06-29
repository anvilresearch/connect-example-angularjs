#!/bin/sh

client_id=$1
host=$2
port=$3
server_host=$4

if [ "$#" -eq 4 ]; then
  sed s,CLIENT_ID,"$client_id",g -i app/rp.html app/scripts/app.js
  sed s,APP_HOST,"$host",g -i app/rp.html app/scripts/app.js
  sed s,APP_PORT,"$port",g -i app/rp.html app/scripts/app.js
  sed s,APP_HOST,"$host",g -i Gruntfile.js
  sed s,APP_PORT,"$port",g -i Gruntfile.js
  sed s,SERVER_HOST,"$server_host",g -i app/rp.html app/scripts/app.js app/index.html
else
  echo Please pass client id, host, port, and server host as arguments. for example: bin/replace-client-id.sh 6d327f50-0aa7-4b0a-9bab-b558d9027e27 my-server.com 9000 https://connect.anvil.io
fi

