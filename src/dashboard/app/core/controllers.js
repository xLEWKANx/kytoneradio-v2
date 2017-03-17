'use strict'
import angular from 'angular'

import './controllers/home'
import './controllers/layout'
import './controllers/main'
import './controllers/router'

const NAME = 'com.module.core.controllers'
const MODULES = [
  `${NAME}.home`,
  `${NAME}.layout`,
  `${NAME}.main`,
  `${NAME}.router`,
]

angular.module(NAME, MODULES)
