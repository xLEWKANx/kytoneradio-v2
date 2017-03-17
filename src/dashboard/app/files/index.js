'use strict'
import angular from 'angular'

import './controllers'
import './routes'
import './services'
import './style.css'

const NAME = 'com.module.files'
const MODULES = [
  `${NAME}.controllers`,
  `${NAME}.routes`,
  `${NAME}.services`,
]

const app = angular.module(NAME, MODULES)

// TODO: Use FileService for this counter
app.run(($rootScope, $http, CoreService, gettextCatalog) => {
  $rootScope.addMenu(gettextCatalog.getString('Files'), 'app.files.list', 'fa-file')

  // $http.get(`${CoreService.env.apiUrl}/containers/files/files`)
  //   .success((data) => $rootScope
  //     .addDashboardBox(gettextCatalog.getString('Files'), 'bg-blue', 'ion-paperclip', data.length, 'app.files.list'))

})
