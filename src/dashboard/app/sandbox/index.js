'use strict'
import angular from 'angular'

import './controllers'
import './routes'

const NAME = 'com.module.sandbox'
const MODULES = [
  `${NAME}.controllers`,
  `${NAME}.routes`,
]

angular.module(NAME, MODULES)
  .run(($rootScope) => $rootScope.addMenu('Sandbox', 'app.sandbox.index', 'fa-inbox'))
