'use strict'
import angular from 'angular'

function DatepickerCtrl ($scope) {
  $scope.today = () => {
    $scope.dt = new Date()
  }
  $scope.today()
  $scope.clear = () => {
    $scope.dt = null
  }
  $scope.disabled = (date, mode) => {
    return (mode === 'day' && (date.getDay() === 0 || date.getDay() === 6))
  }
  $scope.toggleMin = () => {
    $scope.minDate = $scope.minDate ? null : new Date()
  }
  $scope.toggleMin()

  $scope.open = ($event) => {
    $event.preventDefault()
    $event.stopPropagation()
    $scope.opened = true
  }
  $scope.dateOptions = {
    formatYear: 'yy',
    startingDay: 1,
  }
  $scope.formats = [
    'dd-MMMM-yyyy',
    'yyyy/MM/dd',
    'dd.MM.yyyy',
    'shortDate',
  ]
  $scope.format = $scope.formats[ 0 ]
}

angular
  .module('com.module.sandbox.controllers.datepicker', [])
  .controller('DatepickerCtrl', DatepickerCtrl)
