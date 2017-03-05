'use strict'
import angular from 'angular'

function SandboxCtrl ($scope) {
  $scope.items = [ {
    name: 'CoreService',
    sref: '.coreservice',
  }, {
    name: 'Bootstrap',
    sref: '.bootstrap',
  }, {
    name: 'Dashboard',
    sref: '.dashboard',
  }, {
    name: 'Forms',
    sref: '.forms',
  }, {
    name: 'Faker',
    sref: '.faker',
  }, {
    name: 'Icons',
    sref: '.icons',
  }, {
    name: 'Grid',
    sref: '.grid',
  }, {
    name: 'Trees',
    sref: '.trees',
  } ]
}

angular
  .module('com.module.sandbox.controllers.sandbox', [])
  .controller('SandboxCtrl', SandboxCtrl)
