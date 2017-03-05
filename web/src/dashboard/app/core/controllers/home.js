'use strict'
import angular from 'angular'

function HomeCtrl ($scope, $rootScope) {
  $scope.count = {}
  $scope.boxes = $rootScope.dashboardBox
}

angular
  .module('com.module.core.controllers.home', [])
  .controller('HomeCtrl', HomeCtrl)
