'use strict'
import angular from 'angular'

import './routes'
import './services'

const NAME = 'com.module.settings'
const MODULES = [
  `${NAME}.routes`,
  `${NAME}.services`,
]

angular.module(NAME, MODULES)
  .run(($rootScope, gettextCatalog) => {
    $rootScope.addMenu(gettextCatalog.getString('Settings'),
      'app.settings.list', 'fa-cog')

    $rootScope.getSetting = (key) => {
      let value = ''

      angular.forEach($rootScope.settings.data, (item) => {
        if (item.key === key) {
          value = item.value
        }
      })
      return value
    }
  })
