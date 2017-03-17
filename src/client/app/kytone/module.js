(function () {
  'use strict';

  angular.module('kytoneApp', [
    'ngRoute',
    'ngAnimate',
    'ngAria',
    'ngCookies',
    'ngTouch',
    'ngResource',
    'slick',
    'hc.marked',
    'btford.socket-io',
    'LocalStorageModule',
    'lbServices'
  ]);

  angular.module('kytoneApp').config(config);

  /* @ngInject */

  function config(
    $routeProvider,
    $locationProvider,
    $sceProvider,
    localStorageServiceProvider
  ) {

    $routeProvider
      .when('/posters', {
        templateUrl: 'partials/postersLine',
        controller: 'postersCtrl'
      })
      .otherwise({ redirectTo: '/' });

    $sceProvider.enabled(false);

    localStorageServiceProvider
      .setPrefix('kytone');
  }
})();
