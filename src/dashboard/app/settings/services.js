'use strict'
import angular from 'angular'

import './services/settings'

const NAME = 'com.module.settings.services'
const MODULES = [
  `${NAME}.settings`,
]

angular.module(NAME, MODULES)
