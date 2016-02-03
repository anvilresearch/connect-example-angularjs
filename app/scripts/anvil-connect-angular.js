'use strict'

require('angular')
var bows = require('bows')

var log = bows('ac-angular')

var Anvil = require('anvil-connect-js').default

function init (providerOptions, $http, $q, $location, $window, $document) {
  Anvil.init(providerOptions, {
    http: {
      request: function (config) {
        return $http(config)
      },
      getData: function (response) {
        return response.data
      }
    },
    location: {
      hash: function () {
        return $location.hash()
      },
      path: function () {
        return $location.path()
      }
    },
    dom: {
      getWindow: function () {
        return $window
      },
      getDocument: function () {
        return $document[0]
      }
    }
  })
  return Anvil
}

angular.module('anvil', [])

  .provider('Anvil', function AnvilProvider () {
    /**
     * Require Authentication
     */

    function requireAuthentication ($location, Anvil) {
      if (!Anvil.isAuthenticated()) {
        return Anvil.promise.authorize()
          .catch(function (err) {
            log.debug('requireAuthentication: authorize() failed', err)
            return false
          })
      }
      return Anvil.session
    }

    Anvil.requireAuthentication = ['$location', 'Anvil', requireAuthentication]

    /**
     * Require Scope
     */

    Anvil.requireScope = function (scope, fail) {
      return ['$location', 'Anvil', function requireScope ($location, Anvil) {
        if (!Anvil.isAuthenticated()) {
          return Anvil.promise.authorize()
            .catch(function (err) {
              log.debug('requireScope: authorize() failed', err)
              return false
            })
        } else if (Anvil.session.access_claims.scope.indexOf(scope) === -1) {
          $location.path(fail)
          return false
        } else {
          return Anvil.session
        }
      }]
    }

    /**
     * Provider configuration
     */

    this.configure = function (options) {
      Anvil.configure(options)
    }

    /**
     * Factory
     */

    Anvil.$get = [
      '$q',
      '$http',
      '$rootScope',
      '$location',
      '$document',
      '$window', function ($q, $http, $rootScope, $location, $document, $window) {
        init(null, $http, $q, $location, $window, $document)
        return Anvil
      }]

    return Anvil
  })
