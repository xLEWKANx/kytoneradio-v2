'use strict'
import angular from 'angular'

import './controllers/login'
import './controllers/register'

const NAME = 'com.module.users.controllers'
const MODULES = [
  `${NAME}.login`,
  `${NAME}.register`,
]

angular.module(NAME, MODULES)
