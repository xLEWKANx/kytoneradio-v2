'use strict'
import angular from 'angular'
function DashboardCtrl ($scope) {

  $scope.boxes = []
  $scope.addComponent = (name, color, icon, quantity, href) => $scope.boxes.push({ name, color, icon, quantity, href })
  $scope.addComponent('Autofields', 'bg-blue', 'ion-document-text', '1', 'app.components.autofields')

}
angular
  .module('com.module.sandbox.controllers.dashboard', [])
  .controller('DashboardCtrl', DashboardCtrl)
