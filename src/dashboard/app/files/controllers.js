'use strict'
import angular from 'angular'

import './controllers/tracks'
// import './controllers/layout'


const NAME = 'com.module.files.controllers'
const MODULES = [
  `${NAME}.tracks`,
]

angular.module(NAME, MODULES)
