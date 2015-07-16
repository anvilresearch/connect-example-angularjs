'use strict'
require('anvil-connect-js/lib/anvil-connect-angular')
require('angular-animate')
require('angular-cookies')
require('angular-resource')
require('angular-route')
require('angular-sanitize')
require('angular-touch')

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

    // CONFIGURE ANVIL CONNECT
    AnvilProvider.configure({
      issuer:       '<%=AUTH_SERVER%>',
      client_id:    '<%=CLIENT_ID%>',
      //redirect_uri: 'http://localhost:9000/callback.html',
      redirect_uri: '<%=APP_SERVER%>/<%=APP_AUTH_CALLBACK%>',
      display:      '<%=AUTH_DISPLAY%>' // ,
      // scope:        'realm email'
    });

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
      .when('/<%= APP_AUTH_CALLBACK %>', {
        resolve: {
          session: function ($location, Anvil) {
            log.debug('/<%= APP_AUTH_CALLBACK %>.resolve.session:', $location)
            if ($location.hash()) {
              Anvil.promise.authorize().then(

                // handle successful authorization
                function (response) {
                  var dest = Anvil.destination(false)
                  // $location.url( dest || '/'); did not react for me
                  // there may be solutions with scope apply but this seems
                  // to work fine, although this may not be the best solution.
                  console.log('/<%= APP_AUTH_CALLBACK %> authorize() succeeded, destination=', dest)
                  location.href =  dest || '/'
                },

                // handle failed authorization
                function (fault) {
                  // ...
                }

              );
            } else {
              $location.url(localStorage['anvil.connect.destination'] || '/');
              delete localStorage['anvil.connect.destination']
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
