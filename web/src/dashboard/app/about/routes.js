'use strict'

import angular from 'angular'
import templateUrlMain from './views/main.html'
import templateUrlAbout from './views/about.html'

const app = angular.module('com.module.about.routes', [])

app.config(($stateProvider) => $stateProvider
  .state('app.about', {
    abstract: true,
    url: '/about',
    templateUrl: templateUrlMain,
  })
  .state('app.about.index', {
    url: '',
    templateUrl: templateUrlAbout,
    controller: function indexCtrl ($scope) {
      $scope.angular = angular
    },
  })
)

