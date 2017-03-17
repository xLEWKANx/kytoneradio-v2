'use strict'
import angular from 'angular'
function SandboxGridCtrl ($scope, uiGridConstants) {

  $scope.dataset = []

  const loadData = () => {
    for (let i = 1; i < 10; i++) {
      const newRow = {
        name: `Name field ${i}`,
        address: {
          street: `Street Col ${i}`,
        },
        age: (i * 10),
        registered: Date.now(),
      }
      $scope.dataset.push(newRow)
    }
  }

  loadData()

  const footerCellTemplate = `
    <div class="ui-grid-cell-contents" style="background-color: Red;color: White">
      custom template
    </div>
  `

  $scope.gridOptions = {
    showGridFooter: true,
    showColumnFooter: true,
    enableFiltering: true,
    columnDefs: [ {
      field: 'name',
      width: '13%',
    }, {
      field: 'address.street',
      aggregationType: uiGridConstants.aggregationTypes.sum,
      width: '13%',
    }, {
      field: 'age',
      aggregationType: uiGridConstants.aggregationTypes.avg,
      aggregationHideLabel: true,
      width: '13%',
    }, {
      name: 'ageMin',
      field: 'age',
      aggregationType: uiGridConstants.aggregationTypes.min,
      width: '13%',
      displayName: 'Age for min',
    }, {
      name: 'ageMax',
      field: 'age',
      aggregationType: uiGridConstants.aggregationTypes.max,
      width: '13%',
      displayName: 'Age for max',
    }, {
      name: 'customCellTemplate',
      field: 'age',
      width: '14%',
      footerCellTemplate,
    }, {
      name: 'registered',
      field: 'registered',
      width: '20%',
      cellFilter: 'date',
      footerCellFilter: 'date',
      aggregationType: uiGridConstants.aggregationTypes.max,
    } ],
    data: $scope.dataset,
    onRegisterApi: (gridApi) => {
      $scope.gridApi = gridApi
    },
  }
}

angular
  .module('com.module.sandbox.controllers.grid', [])
  .controller('SandboxGridCtrl', SandboxGridCtrl)
