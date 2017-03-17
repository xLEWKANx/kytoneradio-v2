'use strict'
import angular from 'angular'

import './routes.js'
import './controllers.js'

const NAME = 'com.module.mpd'
const MODULES = [
  `${NAME}.routes`,
  `${NAME}.controllers`,
]

angular.module(NAME, MODULES)
  .run(($rootScope, gettextCatalog) => $rootScope
    .addMenu(gettextCatalog.getString('Mpd'), 'app.mpd.models', 'fa-globe')
  )
