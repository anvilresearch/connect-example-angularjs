#!/bin/sh
# This is a template which is expanded and stored in dist when building
# the app with grunt.

# Register client with anvil connect

fail() {
  local message
  message=${1-"Failed to register client"}
  echo "$message" >&2
  echo "You may need to login with 'nvl login'"  >&2
  echo "Perhaps nvl is not yet setup? Consult connect-cli getting started documentation"  >&2
  exit 2
}

echo "Registering this client with <%= ISSUER_NAME %>"

out=$(nvl client:register \
  --issuer "<%= ISSUER_NAME %>" \
  --trusted \
  --name "Angular example with <%= AUTH_DISPLAY %> for <%= APP_SERVER %>" \
  --uri "<%= APP_SERVER %>" \
  --logo-uri "<%= APP_SERVER %>/logo" \
  --application-type "web" \
  --response-type "id_token token" \
  --grant-type "implicit" \
  --default-max-age "3600" \
  --redirect-uri "<%= APP_SERVER %>/<%= APP_AUTH_CALLBACK %>" \
  --redirect-uri "<%= APP_SERVER %>/rp.html" \
  --post-logout-redirect-uri "<%= APP_SERVER %>/" \
  --post-logout-redirect-uri "<%= APP_SERVER %>/")

# duplication of --post-logout-redirect-uri see https://github.com/anvilresearch/connect-cli/issues/70

REGISTER_STATUS=$?
if [ $REGISTER_STATUS -ne 0 ]; then
  fail "nvl client:register failed with status $REGISTER_STATUS"
fi

# From OS X:
#  $ echo "$out" | grep "_id" | grep -o -E '([[:xdigit:]]*-){1,10}[[:xdigit:]]*'
#  ec8262ae-28d5-4943-8237-d8145042c3e0
client_id=$(echo "$out" | grep "_id" | grep -o -E '([[:xdigit:]]*-){1,10}[[:xdigit:]]*')

[ -n "$client_id" ] || fail

echo "Succeeded."
echo "Define CLIENT_ID as follows in authconf.json:"
printf '{\n'
printf '...\n'
printf '  "CLIENT_ID" : "%s",\n' "$client_id"
printf '...\n'
printf '}\n'
