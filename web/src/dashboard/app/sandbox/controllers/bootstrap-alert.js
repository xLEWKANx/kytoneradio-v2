'use strict'
import angular from 'angular'

function SandboxBootstrapAlertCtrl ($scope) {
  $scope.alerts = [ {
    type: 'danger',
    msg: 'Oh snap! Change a few things up and try submitting again.',
  }, {
    type: 'success',
    msg: 'Well done! You successfully read this important alert message.',
  } ]

  $scope.addAlert = () => {
    $scope.alerts.push({ msg: 'Another alert!' })
  }
  $scope.closeAlert = (index) => $scope.alerts.splice(index, 1)
}

angular
  .module('com.module.sandbox.controllers.bootstrap-alert', [])
  .controller('SandboxBootstrapAlertCtrl', SandboxBootstrapAlertCtrl)
