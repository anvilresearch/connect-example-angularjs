# Anvil Connect AngularJS Example

**Anvil Connect** aims to be a scalable, full-featured, ready-to-run
[**OpenID Connect**](http://openid.net/connect/) + [**OAuth 2.0**](http://tools.ietf.org/html/rfc6749) **Provider**.

This repository demonstrates authenticating users of an AngularJS app using Anvil Connect.

## Run with Docker

    bin/replace-client-id.sh 060f4284-5e43-4ef1-874a-7d84143b8636 laptop-connect.anvil.io 80
    docker-compose build
    docker-compose up
    docker-compose run --service-ports app sh
    grunt serve
