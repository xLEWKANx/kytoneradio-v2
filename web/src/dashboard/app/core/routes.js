'use strict'
import angular from 'angular'

import templateUrlApp from './views/app.html'
import templateUrlHome from './views/home.html'

const app = angular.module('com.module.core.routes', [])

app.config($stateProvider => $stateProvider
  .state('router', {
    url: '/router',
    template: '<div class="lockscreen" style="height: 100%"></div>',
    controller: 'RouteCtrl',
  })
  .state('error', {
    url: '/error',
    template: '<div class="text-center alert alert-danger" style="margin: 100px">An error occurred.</div>',
  })
  .state('app', {
    abstract: true,
    url: '/app',
    templateUrl: templateUrlApp,
    controller: 'MainCtrl',
  })
  .state('app.home', {
    url: '',
    templateUrl: templateUrlHome,
    controller: 'HomeCtrl',
  })
)

app.config($urlRouterProvider => $urlRouterProvider.otherwise('/router'))

