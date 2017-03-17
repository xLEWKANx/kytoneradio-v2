'use strict'
import angular from 'angular'

import './components/admin-header'
import './components/date-button'
import './components/navbar'
import './components/small-box'

const NAME = 'com.module.core.components'
const MODULES = [
  `${NAME}.admin-header`,
  `${NAME}.date-button`,
  `${NAME}.navbar`,
  `${NAME}.small-box`,
]

angular.module(NAME, MODULES)
