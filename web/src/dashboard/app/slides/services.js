'use strict'
import angular from 'angular'

import './services/slides'

const NAME = 'com.module.slides.services'
const MODULES = [
  `${NAME}.slides`,
]

angular.module(NAME, MODULES)
