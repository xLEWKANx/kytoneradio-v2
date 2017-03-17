'use strict'
import angular from 'angular'

import './routes'
import './services'

const NAME = 'com.module.events'
const MODULES = [
  `${NAME}.routes`,
  `${NAME}.services`,
]

const app = angular.module(NAME, MODULES)

app.run(($rootScope, Event, gettextCatalog) => {
  $rootScope.addMenu(gettextCatalog.getString('Events'), 'app.events.list', 'fa-calendar-o')

  Event.find((data) => {
    $rootScope.addDashboardBox('Events', 'bg-purple', 'ion-calendar', data.length, 'app.events.list')
  })

})
