'use strict'
import angular from 'angular'

import './services/app-auth'
import './services/user'

const NAME = 'com.module.users.services'
const MODULES = [
  `${NAME}.app-auth`,
  `${NAME}.user`,
]

angular.module(NAME, MODULES)
