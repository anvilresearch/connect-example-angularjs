#!/bin/sh
# This is a template which is expanded and stored in dist when building
# the app with grunt.

# Register client with anvil connect

client='{
  "client_name": "Angular example with <%= AUTH_DISPLAY %> for <%= APP_SERVER %>",
  "default_max_age": 36000,
  "redirect_uris": [
    "<%= APP_SERVER %>/<%= APP_AUTH_CALLBACK %>",
    "<%= APP_SERVER %>/rp.html"],
  "post_logout_redirect_uris": ["<%= APP_SERVER %>"],
  "trusted": "true"
}'

echo "Registring nv add client $client"

out=$(nv add client "$client") || {
  echo "failed to register client"  >&2  exit 2
}

# From OS X:
#  $ echo "$out" | grep "_id" | grep -o -E '([[:xdigit:]]*-){1,10}[[:xdigit:]]*'
#  ec8262ae-28d5-4943-8237-d8145042c3e0
client_id=$(echo "$out" | grep "_id" | grep -o -E '([[:xdigit:]]*-){1,10}[[:xdigit:]]*')

echo "Succeeded."
echo "Define CLIENT_ID as follows in authconf.json:"
printf '{\n'
printf '...\n'
printf '  "CLIENT_ID" : "%s",\n' "$client_id"
printf '...\n'
printf '}\n'
