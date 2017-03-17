'use strict'
import angular from 'angular'

import './components/login'
import './components/register'

const NAME = 'com.module.users.components'
const MODULES = [
  `${NAME}.login`,
  `${NAME}.register`,
]

angular.module(NAME, MODULES)
