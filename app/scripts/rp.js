'use strict'
var bows = require('bows')
var Q = require('q')
window.Anvil = require('anvil-connect-js').default
// window allows access from setTimeout below.

var log = bows('rp.html')

Anvil.init({
  issuer:       '<%=AUTH_SERVER%>',
  client_id:    '<%= CLIENT_ID %>',
  redirect_uri: '<%=APP_SERVER%>/rp.html',
  display:      'page',
  scope:        'realm'
}, {
  http: {
    request: function (config) {
      return Q.xhr(config)
    },
    getData: function (response) {
      return response.data
    }
  }
});

Anvil.promise.deserialize();

var response = (location.hash) ? Anvil.parseFormUrlEncoded(location.hash.substring(1)) : {};

if (location.hash) {
  Anvil.promise.prepareAuthorization().then( function () {
    Anvil.promise.callback(response).then(
      function success (session) {
        log.info('RP CALLBACK SUCCESS', session, Anvil.sessionState);
        window.parent.postMessage(location.hash, location.origin);
      },
      function failure (fault) {
        log.info('RP CALLBACK FAILURE', fault);
      })
  })
}

// start checking the session every 30 seconds
function setTimer() {
  var timer = setInterval("Anvil.checkSession('op')", 30*1000);
}



// listen for changes to OP browser state
function receiveMessage(event) {
  if (event.origin !== Anvil.issuer) {
    log.debug('Houston, we have a problem', event.origin, Anvil.issuer);
    return;
  }

  if (event.data === 'error') {
    log.debug('ERROR FROM OP', event.data);
  }

  // SESSION STATE IS THE SAME
  if (event.data === 'unchanged') {
    log.info('session state: unchanged');
  }

  // SESSION STATE HAS CHANGED
  else {
    log.info('session state: changed');
    Anvil.promise.uri('authorize', {
      prompt: 'none',
      id_token_hint: Anvil.session.id_token
    }).then( function (uri) {
      log.info('RP REAUTHENTICATING', uri)
      window.location = uri;
    });
  }
}

window.addEventListener("message", receiveMessage, false);

setTimer()
