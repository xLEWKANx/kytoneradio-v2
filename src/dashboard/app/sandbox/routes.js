'use strict'
import angular from 'angular'

import templateUrlMain from './views/main.html'
import templateUrlForms from './views/forms.html'
import templateUrlIcons from './views/icons.html'
import templateUrlFaker from './views/faker.html'
import templateUrlCoreService from './views/core-service.html'
import templateUrlBootstrap from './views/bootstrap.html'
import templateUrlTrees from './views/trees.html'
import templateUrlDashboard from './views/dashboard.html'
import templateUrlGrid from './views/grid.html'

const app = angular.module('com.module.sandbox.routes', [])

app.config(($stateProvider) => $stateProvider
  .state('app.sandbox', {
    abstract: true,
    url: '/sandbox',
    templateUrl: templateUrlMain,
    controller: 'SandboxCtrl',
  })
  .state('app.sandbox.index', {
    url: '',
    controller: ($state) => $state.go('app.sandbox.bootstrap'),
  })
  .state('app.sandbox.forms', {
    url: '/forms',
    templateUrl: templateUrlForms,
    controller: 'SandboxFormsCtrl',
  })
  .state('app.sandbox.icons', {
    url: '/icons',
    templateUrl: templateUrlIcons,
    controller: 'SandboxIconsCtrl',
  })
  .state('app.sandbox.faker', {
    url: '/faker',
    templateUrl: templateUrlFaker,
    controller: 'SandboxFakerCtrl',
  })
  .state('app.sandbox.coreservice', {
    url: '/coreservice',
    templateUrl: templateUrlCoreService,
    controller: 'SandboxCoreServiceCtrl',
  })
  .state('app.sandbox.bootstrap', {
    url: '/bootstrap',
    templateUrl: templateUrlBootstrap,
  })
  .state('app.sandbox.trees', {
    url: '/trees',
    templateUrl: templateUrlTrees,
    controller: 'SandboxTreesCtrl',
  })
  .state('app.sandbox.dashboard', {
    url: '/dashboard',
    templateUrl: templateUrlDashboard,
    controller: 'DashboardCtrl',
  })
  .state('app.sandbox.grid', {
    url: '/grid',
    templateUrl: templateUrlGrid,
    controller: 'SandboxGridCtrl',
  })
)
