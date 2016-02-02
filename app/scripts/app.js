'use strict'
require('./anvil-connect-angular')
require('angular-animate')
require('angular-cookies')
require('angular-resource')
require('angular-route')
require('angular-sanitize')
require('angular-touch')
var anvilConfig = require('../../app.config/anvil-config')

var bows = require('bows')

var log = bows('app')

/**
 * Anvil Connect AngularJS Example App
 */

angular
  .module('AnvilConnectClient', [
    'anvil',
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'anvil'
  ])

  .config(function ($locationProvider, $routeProvider, AnvilProvider) {
    var auth_callback_route = '/' + 'callback_' + anvilConfig.display;

    // CONFIGURE ANVIL CONNECT
    AnvilProvider.configure(
      angular.merge({
          redirect_uri: anvilConfig.app_server + auth_callback_route
        }, anvilConfig));

    $locationProvider.html5Mode(true);
    $locationProvider.hashPrefix = '!';

    $routeProvider
      .when('/', {
        templateUrl: '/views/main.html',
        controller: 'MainCtrl'
      })

      .when('/requires/authentication', {
        templateUrl: '/views/requiresAuthentication.html',
        controller: 'RequiresAuthenticationCtrl',
        resolve: {
          session: AnvilProvider.requireAuthentication
        }
      })

      .when('/requires/scope', {
        templateUrl: '/views/requiresScope.html',
        controller: 'RequiresScopeCtrl',
        resolve: {
          session: AnvilProvider.requireScope('profile', '/unauthorized')
        }
      })

      .when('/unauthorized', {
        templateUrl: '/views/unauthorized.html',
        controller: 'UnauthorizedCtrl'
      })

      // HANDLE CALLBACK (REQUIRED BY FULL PAGE NAVIGATION ONLY)
      .when(auth_callback_route, {
        resolve: {
          session: function ($location, Anvil) {
            log.debug('' + auth_callback_route + '.resolve.session:', $location)
            if ($location.hash()) {
              return Anvil.promise.authorize().then(
                // handle successful authorization
                function (response) {
                  var dest = Anvil.destination(false)
                  // $location.url( dest || '/'); did not react for me
                  // there may be solutions with scope apply but this seems
                  // to work fine, although this may not be the best solution.
                  console.log('' + auth_callback_route + ' authorize() succeeded, destination=', dest)
                  $location.url(dest || '/')
                },

                // handle failed authorization
                function (fault) {
                  // ...
                }

              );
            } else {
              var dest = Anvil.destination(false)
              $location.url(dest || '/');
            }
          }
        }
      })

      .otherwise({
        redirectTo: '/'
      });
  })
  .run(function (Anvil) {
    log.debug('run() entering')
    /**
     * Reinstate an existing session
     */
    Anvil.promise.deserialize().catch( function () {
      log.debug('Ignore promise rejection when reinstating session')
    })
    Anvil.promise.prepareAuthorization().then(function (result) {
      log.debug('prepareAuthorization succeeded:', result)
    }, function (err) {
      log.error('prepareAuthorization failed:', err)
    })
  })
  .controller('SigninCtrl', function ($scope, Anvil) {

    $scope.session = Anvil.session;

    log.debug('SigninCtrl() init: adding Anvil.once("authenticated"..) listener')
    Anvil.once('authenticated', function () {
      log.debug('SigninCtrl() init: authenticated callback: calling $scope.$apply')
      $scope.$apply();
    })

    $scope.signin = function () {
      log.debug('SigninCtrl.signin(): entering function')
      Anvil.promise.authorize()
      Anvil.once('authenticated', function () {
        log.debug('SigninCtrl.signin() authenticated callback: calling $scope.$apply')
        $scope.$apply();
      })
    };

    $scope.signout = function () {
      Anvil.signout('/');
    };

    $scope.$watch(
      // proper formatting allows easier setting of breakpoints.
      function () {
        return Anvil.session
      },
      function (newVal) {
        $scope.session = newVal
      },
      true
    );

  })

  .controller('MainCtrl', function ($scope, Anvil) {
    $scope.session = Anvil.session
  })

  .controller('RequiresAuthenticationCtrl', function ($scope, session) {
    $scope.session = session;
  })

  .controller('RequiresScopeCtrl', function ($scope, session) {
    $scope.session = session;
  })

  .controller('UnauthorizedCtrl', function ($scope) {
    $scope.scope = '?';
  })

  ;
