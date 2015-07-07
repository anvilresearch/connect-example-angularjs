#!/bin/bash

client_id=$1
host=$2
port=$3
server_host=$4

# sed with in place editing is not portable between OSX and Linux (see http://stackoverflow.com/questions/5694228/sed-in-place-flag-that-works-both-on-mac-bsd-and-linux)
# Changing a file, see pitfall http://mywiki.wooledge.org/BashPitfalls#cat_file_.7C_sed_s.2Ffoo.2Fbar.2F_.3E_file and
# http://unix.stackexchange.com/a/38106 used for a function to chomp.
sponge() {
  local file=$1
  local line lines
  while IFS= read -r line; do
    lines+=( "$line" )
  done
  printf '%s\n' "${lines[@]}" > "$file"
}


if [ "$#" -eq 4 ]; then
  sed s,CLIENT_ID,"$client_id",g app/rp.html | sponge app/rp.html
  sed s,CLIENT_ID,"$client_id",g app/scripts/app.js | sponge app/scripts/app.js
  sed s,APP_HOST,"$host",g app/rp.html | sponge app/rp.html
  sed s,APP_HOST,"$host",g app/scripts/app.js | sponge app/scripts/app.js
  sed s,APP_PORT,"$port",g app/rp.html | sponge app/rp.html
  sed s,APP_PORT,"$port",g app/scripts/app.js | sponge app/scripts/app.js
  sed s,APP_HOST,"$host",g Gruntfile.js | sponge Gruntfile.js
  sed s,APP_PORT,"$port",g Gruntfile.js | sponge Gruntfile.js
  sed s,SERVER_HOST,"$server_host",g app/rp.html | sponge app/rp.html
  sed s,SERVER_HOST,"$server_host",g app/scripts/app.js | sponge app/scripts/app.js
  sed s,SERVER_HOST,"$server_host",g app/index.html | sponge app/index.html
else
  echo Please pass client id, host, port, and server host as arguments. for example: bin/replace-client-id.sh 6d327f50-0aa7-4b0a-9bab-b558d9027e27 my-server.com 9000 https://connect.anvil.io
fi
