# NOTICE

We’re archiving Anvil Connect and all related packages. This code is entirely MIT Licensed. You’re free to do with it what you want. That said, we are recommending _**against**_ using it, due to the potential for security issues arising from unmaintained software. For more information, see the announcement at [anvil.io](https://anvil.io).

# Anvil Connect AngularJS Example

**Anvil Connect** aims to be a scalable, full-featured, ready-to-run
[**OpenID Connect**](http://openid.net/connect/) + [**OAuth 2.0**](http://tools.ietf.org/html/rfc6749) **Provider**.

This repository demonstrates authenticating users of an AngularJS app using Anvil Connect.

## Prerequisites
Setup [Anvil Connect authorization server](https://github.com/anvilresearch/connect/blob/master/README.md)

As a result the Anvil Authorization server should run on localhost:3000.

## Register the client and generate matching angular sources.
To allow the app to connect to the authorization server a client (representing)
the app must be configured in the authorization server.

In addition the angular app must make requests matching with the client
registration.

To achieve this the configuration information for the client is stored in file
`authconf.json`.

You will find that this file is **not** checked in. Instead there are files with
similar names which are checked in. These are good starting points for your
client registration. For example they differ
depending on whether boot2docker is involved or not. Also there can be
differences on how the authentication is displayed, for example using a popup or
a new page.

Use one of these as a starting point and copy them to `authconf.json`. For
example when using docker via boot2docker the following is a good starting
point:

```console
cp authconf.dev.b2d.json authconf.json
```
If you do not use boot2docker, for example if you want to serve directly
via `grunt serve` then use:

```console
cp authconf.dev.localhost.json authconf.json
```


The Anvil Authentication server recognizes clients by an id which is generated
when they are registered. Therefore the starting point is not yet final as the
id in there must be changed. To help with ensure that the client registration
matches what the generated angular app uses, a registration script is generated
in `dist/register_with_anvil_connect.sh`.

First generate the script by:

```console
grunt build
```

Use the generated `dist/register_with_anvil_connect.sh` as follows in the root directory of your Anvil Connect Authentication
server:

```console
mac:anvil-connect dev$ /Users/dev/code/connect-example-angularjs/dist/register_with_anvil_connect.sh
Registring nv add client {
  "client_name": "Angular Example App",
  "default_max_age": 36000,
  "redirect_uris": [
    "http://localhost:9000/callback_popup.html",
    "http://localhost:9000/callback_page.html",
    "http://localhost:9000/rp.html"],
  "post_logout_redirect_uris": ["http://localhost:9000"],
  "trusted": "true"
}
Succeeded.
Define CLIENT_ID as follows in authconf.json:
{
...
  "CLIENT_ID" : "d20dc3cf-cdfd-4e14-a070-0cb40bdb5d92",
...
}
```

The id shown will be unique to your authentication server. Replace the existing
`CLIENT_ID` in `authconf.json` with the one you see in your output.

## Run with angular app served by grunt serve

In this scenaria we are using a simple build server via grunt.

```console
igelmac:connect-example-angularjs dev$ grunt serve
Using authconf.json

Running "serve" task

Running "clean:server" (clean) task
Cleaning .tmp...OK
Cleaning dist...OK

Running "concurrent:server" (concurrent) task

    Using authconf.json

    Running "copy:styles" (copy) task
    Copied 1 files

    Done, without errors.


    Execution Time (2015-07-10 19:49:12 UTC)
    loading tasks  20ms  ▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇ 31%
    copy:styles    41ms  ▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇ 63%
    Total 65ms

    Using authconf.json

    Running "copy:dist" (copy) task
    Created 5 directories, copied 10 files

    Done, without errors.


    Execution Time (2015-07-10 19:49:12 UTC)
    loading tasks   18ms  ▇▇▇▇▇ 9%
    copy:dist      183ms  ▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇ 91%
    Total 202ms

Running "connect:livereload" (connect) task
Started connect web server on http://localhost:9000

Running "watch" task
Waiting...
```

As a result the browser should open the home page like this:

![Angular example index page](png/home_page_localhost.png)

When changes are made to the app this should readily refresh the browser.

These pages should look the same as in the docker use case which shows some more pages except that these are running under `http://localhost:9000` instead of `http://boot2docker:9000`.

## Run with angular app served by docker

In this scenario nginx serves the angular app running inside a docker container.

If you have not followed the steps in section **Prerequisites** do this first.
Otherwise regenerate the app with the latest sources and the registered
client-id.

    grunt build

Next build the docker image
    docker-compose build

Server the angular app via nginx running in a docker container:
    docker-compose up -d

To debug:
    docker-compose run --service-ports angular sh

If you are using boot2docker (typically used on OS X and Windows) nginx will
not be available from OS X (Windows) under localhost:9000 but rather at where
`boot2docker ip` reports it. In most cases this is at `192.168.59.103`.

To simplify referring to this we will assume that you will have a corresponding
entry in your `/etc/hosts` file:
```console
192.168.59.103	boot2docker
```

With that you can open your browser on either `http://localhost:9000` or `http://boot2docker:9000`. You should see something like this:

![Angular example index page](png/home_page.png)

After selecting SignIn with the configured popup display the following is shown:

![Angular signin popup](png/signin_popup.png)

When selecting *Protected* the session information is shown:

![Angular authentication page when authorized](png/requires_authentication.png)

When selecting *Scoped* logged in but not having the proper authorized level:

![Angular Scoped page unauthorized](png/requires_scope_unauthorized.png)

After having the user in Anvil Connect assigned authority:

```console
mac:anvil-connect dev$ nv assign jdoe@example.com authority
d1b9c2af-8d2f-4f8e-a739-f00552b09ef7 now has the role "authority."
```console

The scope page remained unauthorized until Signout followed by a new SignIn.
After this the page showed the following:

![Angular Scoped page authorized](png/requires_scope_authorized.png)
