'use strict'
import angular from 'angular'

import './controllers/mpd'
// import './controllers/layout'


const NAME = 'com.module.mpd.controllers'
const MODULES = [
  `${NAME}.mpd`,
]

angular.module(NAME, MODULES)
