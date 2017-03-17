'use strict'
import angular from 'angular'

import './services/events'

const NAME = 'com.module.events.services'
const MODULES = [
  `${NAME}.events`,
]

angular.module(NAME, MODULES)
