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
      client_id:    '58148b70-85aa-4726-af7d-42bd109dcc49',
      redirect_uri: 'http://localhost:9000/callback.html',
      display:      'popup',
      scope:        'realm'
    });

    $locationProvider.html5Mode(true);
    $locationProvider.hashPrefix = '!';

    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })

      // HANDLE CALLBACK (REQUIRED BY FULL PAGE NAVIGATION ONLY)
      .when('/callback', {
        resolve: {
          session: function ($location, Anvil) {
            Anvil.authorize().then(

              // handle successful authorization
              function (response) {
                $location.url('/');
              },

              // handle failed authorization
              function (fault) {
                // ...
              }

            );
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
      Anvil.signout();
    };

    $scope.$watchCollection(function () { return Anvil.session }, function (newVal) {
      $scope.session = newVal;
    });

  })

  .controller('MainCtrl', function ($scope, Anvil) {
    // ...
  });
