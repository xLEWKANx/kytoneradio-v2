'use strict'

import angular from 'angular'

import './routes'

const NAME = 'com.module.about'
const MODULES = [
  `${NAME}.routes`,
]

angular.module(NAME, MODULES)
  .run(($rootScope, gettextCatalog) => $rootScope
    .addDashboardBox(gettextCatalog.getString('About'), 'bg-maroon', 'fa-info', 0, 'app.about.index')
  )

