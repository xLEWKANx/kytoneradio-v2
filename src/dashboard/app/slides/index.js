'use strict'
import angular from 'angular'

import './services'
import './routes'
import './style.css'

const NAME = 'com.module.slides'
const MODULES = [
  `${NAME}.services`,
  `${NAME}.routes`,
]

angular.module(NAME, MODULES)
  .run(($rootScope, Slide, gettextCatalog) => {

    $rootScope.addMenu(gettextCatalog.getString('Slides'), 'app.slides.list', 'fa-edit')
    Slide.find((slides) => $rootScope
      .addDashboardBox(gettextCatalog.getString('Slides'), 'bg-red', 'ion-document-text', slides.length, 'app.slides.list')
    )
  })
