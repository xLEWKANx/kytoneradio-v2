'use strict'
import angular from 'angular'

import templateUrlForm from './views/form.html'
import templateUrlList from './views/list.html'
import templateUrlMain from './views/main.html'
import templateUrlView from './views/view.html'

const app = angular.module('com.module.settings.routes', [])

app.config(($stateProvider) => $stateProvider
  .state('app.settings', {
    abstract: true,
    url: '/settings',
    templateUrl: templateUrlMain,
  })
  .state('app.settings.list', {
    url: '',
    templateUrl: templateUrlList,
    controllerAs: 'ctrl',
    controller: function listCtrl (settings) {
      this.settings = settings
    },
    resolve: {
      settings: (SettingService) => SettingService.find(),
    },
  })
  .state('app.settings.add', {
    url: '/add',
    templateUrl: templateUrlForm,
    controllerAs: 'ctrl',
    controller: function addCtrl ($state, SettingService, setting) {
      this.setting = setting
      this.formFields = SettingService.getFormFields()
      this.formOptions = {}
      this.submit = () => SettingService.upsert(this.setting).then(() => $state.go('^.list'))
    },
    resolve: {
      setting: () => {},
    },
  })
  .state('app.settings.edit', {
    url: '/:id/edit',
    templateUrl: templateUrlForm,
    controllerAs: 'ctrl',
    controller: function editCtrl ($state, SettingService, setting) {
      this.setting = setting
      this.formFields = SettingService.getFormFields()
      this.formOptions = {}
      this.submit = () => SettingService.upsert(this.setting).then(() => $state.go('^.list'))
    },
    resolve: {
      setting: ($stateParams, SettingService) => SettingService.findById($stateParams.id),
    },
  })
  .state('app.settings.view', {
    url: '/:id',
    templateUrl: templateUrlView,
    controllerAs: 'ctrl',
    controller: function viewCtrl (setting) {
      this.setting = setting
    },
    resolve: {
      setting: ($stateParams, SettingService) => SettingService.findById($stateParams.id),
    },
  })
  .state('app.settings.delete', {
    url: '/:id/delete',
    template: '',
    controllerAs: 'ctrl',
    controller: ($stateParams, $state, SettingService) => SettingService.delete($stateParams.id,
      () => $state.go('^.list'),
      () => $state.go('^.list')
    ),
  })
)
