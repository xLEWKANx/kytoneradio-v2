'use strict'
import angular from 'angular'

function SandboxBootstrapTabsCtrl ($scope, CoreService) {
  $scope.tabs = [ {
    title: 'Dynamic Title 1',
    content: 'Dynamic content 1',
  }, {
    title: 'Dynamic Title 2',
    content: 'Dynamic content 2',
    disabled: true,
  } ]

  $scope.alertMe = () => CoreService.alert('You\'ve selected the alert tab!')
}

angular
  .module('com.module.sandbox.controllers.bootstrap-tabs', [])
  .controller('SandboxBootstrapTabsCtrl', SandboxBootstrapTabsCtrl)
