'use strict';

/**
 * Anvil Connect AngularJS Example App
 */

angular
  .module('AnvilConnectClient', [
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
      issuer:       'http://localhost:3000',
      client_id:    'CLIENT_ID',
      //redirect_uri: 'http://localhost:9000/callback.html',
      redirect_uri: 'HOST/callback',
      //display:      'popup',
      scope:        'realm'
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
          session: AnvilProvider.requireScope('realm', '/unauthorized')
        }
      })

      .when('/unauthorized', {
        templateUrl: '/views/unauthorized.html',
        controller: 'UnauthorizedCtrl'
      })

      // HANDLE CALLBACK (REQUIRED BY FULL PAGE NAVIGATION ONLY)
      .when('/callback', {
        resolve: {
          session: function ($location, Anvil) {
            if ($location.hash()) {
              Anvil.authorize().then(

                // handle successful authorization
                function (response) {
                  $location.url(localStorage['anvil.connect.destination'] || '/');
                  delete localStorage['anvil.connect.destination']
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
    Anvil.getKeys().then(function (jwks) {
      console.log('Loaded JWKs', jwks)
    })
  })

  .controller('SigninCtrl', function ($scope, Anvil) {

    $scope.signin = function () {
      Anvil.authorize()
    };

    $scope.signout = function () {
      Anvil.signout('/');
    };

    $scope.$watch(function () { return Anvil.session }, function (newVal) {
      $scope.session = newVal;
    });

  })

  .controller('MainCtrl', function ($scope, Anvil) {
    // ...
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
