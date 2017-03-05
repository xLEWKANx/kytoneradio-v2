'use strict'
import angular from 'angular'

import './controllers/bootstrap-alert'
import './controllers/bootstrap-tabs'
import './controllers/core-service'
import './controllers/dashboard'
import './controllers/datepicker'
import './controllers/faker'
import './controllers/forms'
import './controllers/grid'
import './controllers/icons'
import './controllers/sandbox'
import './controllers/trees'

const NAME = 'com.module.sandbox.controllers'
const MODULES = [
  `${NAME}.bootstrap-alert`,
  `${NAME}.bootstrap-tabs`,
  `${NAME}.core-service`,
  `${NAME}.dashboard`,
  `${NAME}.datepicker`,
  `${NAME}.faker`,
  `${NAME}.forms`,
  `${NAME}.grid`,
  `${NAME}.icons`,
  `${NAME}.sandbox`,
  `${NAME}.trees`,
]

angular.module(NAME, MODULES)
