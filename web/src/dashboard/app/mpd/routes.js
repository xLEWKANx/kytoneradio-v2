'use strict'
import angular from 'angular'

import templateUrlMain from './views/main.html'
import templateUrlModels from './views/models.html'

const app = angular.module('com.module.mpd.routes', [])
app.config(($stateProvider) => $stateProvider
  .state('app.mpd', {
    abstract: true,
    url: '/mpd',
    templateUrl: templateUrlMain,
  })
  .state('app.mpd.models', {
    url: '',
    templateUrl: templateUrlModels,
    controllerAs: 'ctrl',
    controller: 'MpdCtrl',
    resolve: {
      models: (MetaService) => MetaService.find(),
    },
  })

)
