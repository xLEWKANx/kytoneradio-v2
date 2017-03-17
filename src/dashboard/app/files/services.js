'use strict'
import angular from 'angular'

import './services/track'
import './services/player'
import './services/playlist'

const NAME = 'com.module.files.services'
const MODULES = [
  `${NAME}.track`,
  `${NAME}.playlist`,
  `${NAME}.player`
]

angular.module(NAME, MODULES)
