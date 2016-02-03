'use strict'
var bows = require('bows')
var Q = require('q-xhr')(window.XMLHttpRequest, require('q'))
var Anvil = require('anvil-connect-js').default
var anvilConfig = require('../../app.config/anvil-config')

function copy(dst, src) {
  for (var prop in src) {
    if (src.hasOwnProperty(prop))
      dst[prop] = src[prop];
  }
  return dst;
}

window.addEventListener('load', function () {
  var log = bows('popup callback')

  Anvil.init(
    copy(
      {
        scope:        'realm'
      },
      anvilConfig),
    {
      http: {
        request: function (config) {
          return Q.xhr(config)
        },
        getData: function (response) {
          return response.data
        }
      }
    });

  function show (id) {
    document.getElementById('signing_in').style.display = 'none'
    document.getElementById(id).style.display = 'block'
  }

  var pageUrl = window.location.href
    , opener = window.opener
    , pageOrigin
  if (opener) {
    pageOrigin = opener.location.origin;
  } else {
    log.debug("No opener for window: ", window.location)
  }

  log.debug("load callback")
  log.debug("pageUrl=" , pageUrl);
  log.debug("pageOrigin=" , pageOrigin);
  log.debug("opener=" , opener);
  if (opener) {
    opener.postMessage(pageUrl, pageOrigin);
  } else {
    var fragment = Anvil.getUrlFragment(pageUrl)
    var response = Anvil.parseFormUrlEncoded(fragment)
    Anvil.promise.callback(response).then(
      function (result) {
        log.info("Anvil.callback succeeded: ", result)
        show('signed_in')
        window.close();
      },
      function (fault) {
        log.info("Anvil.callback failed: ", fault)
        show('not_signed_in')
      }
    )
  }
});