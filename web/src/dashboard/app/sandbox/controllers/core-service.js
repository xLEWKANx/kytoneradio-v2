'use strict'
import angular from 'angular'

function SandboxCoreServiceCtrl ($scope, $timeout, CoreService) {

  $scope.basicAlert = () => CoreService.alert('This is the most basic alert!')
  $scope.basicAlertBody = () => CoreService.alert('This is the most basic alert!', 'I am the alert text!')
  $scope.basicAlertSuccess = () => CoreService.alertSuccess('This is a success alert!', 'I am the success text!')
  $scope.basicAlertError = () => CoreService.alertError('This is a error alert!', 'I am the error text!')
  $scope.basicAlertWarning = () => CoreService.alertWarning('This is a warning alert!', 'I am the warning text!')
  $scope.basicAlertInfo = () => CoreService.alertInfo('This is a info alert!', 'I am the info text!')
  $scope.basicConfirm = () => CoreService.confirm('This is an agreement', 'So do you agree?',
    () => CoreService.alert('You agree!'),
    () => CoreService.alert('You don\'t agree!'))

  $scope.toasty = {
    title: 'Notify me!',
    text: 'This is the body!',
  }

  $scope.toastSuccess = () => CoreService.toastSuccess($scope.toasty.title, $scope.toasty.text)
  $scope.toastError = () => CoreService.toastError($scope.toasty.title, $scope.toasty.text)
  $scope.toastWarning = () => CoreService.toastWarning($scope.toasty.title, $scope.toasty.text)
  $scope.toastInfo = () => CoreService.toastInfo($scope.toasty.title, $scope.toasty.text)
  $scope.toastAll = () => {
    CoreService.toastSuccess($scope.toasty.title, $scope.toasty.text)
    CoreService.toastError($scope.toasty.title, $scope.toasty.text)
    CoreService.toastWarning($scope.toasty.title, $scope.toasty.text)
    CoreService.toastInfo($scope.toasty.title, $scope.toasty.text)
  }
}

angular
  .module('com.module.sandbox.controllers.core-service', [])
  .controller('SandboxCoreServiceCtrl', SandboxCoreServiceCtrl)
