'use strict'
import angular from 'angular'

import './components'
import './config'
import './controllers'
import './routes'
import './services'

const NAME = 'com.module.core'
const MODULES = [
  `${NAME}.components`,
  `${NAME}.config`,
  `${NAME}.controllers`,
  `${NAME}.routes`,
  `${NAME}.services`,
]

angular.module(NAME, MODULES)

