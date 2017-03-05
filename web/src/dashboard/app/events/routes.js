'use strict'
import angular from 'angular'

import templateUrlMain from './views/main.html'
import templateUrlList from './views/list.html'
import templateUrlForm from './views/form.html'
import templateUrlView from './views/view.html'

const app = angular.module('com.module.events.routes', [])

app.config(($stateProvider) => $stateProvider
  .state('app.events', {
    abstract: true,
    url: '/events',
    templateUrl: templateUrlMain,
  })
  .state('app.events.list', {
    url: '',
    templateUrl: templateUrlList,
    controllerAs: 'ctrl',
    controller: function listCtrl (events) {
      this.events = events
    },
    resolve: {
      events: (EventsService) => EventsService.getEvents(),
    },
  })
  .state('app.events.add', {
    url: '/add',
    templateUrl: templateUrlForm,
    controllerAs: 'ctrl',
    controller: function addCtrl ($state, EventsService, event) {
      this.event = event
      this.formFields = EventsService.getFormFields()
      this.formOptions = {}
      this.submit = () => EventsService.upsertEvent(this.event)
        .then(() => {
          $state.go('^.list')
        })
    },
    resolve: {
      event: () => {},
    },
  })
  .state('app.events.edit', {
    url: '/:id/edit',
    templateUrl: templateUrlForm,
    controllerAs: 'ctrl',
    controller: function editCtrl ($state, EventsService, event) {
      this.event = event
      this.formFields = EventsService.getFormFields()
      this.formOptions = {}
      this.submit = () => EventsService.upsertEvent(this.event)
        .then(() => {
          $state.go('^.list')
        })

    },
    resolve: {
      event: ($stateParams, EventsService) => EventsService.getEvent($stateParams.id),
    },
  })
  .state('app.events.view', {
    url: '/:id',
    templateUrl: templateUrlView,
    controllerAs: 'ctrl',
    controller: function viewCtrl (event) {
      this.event = event
    },
    resolve: {
      event: ($stateParams, EventsService) => EventsService.getEvent($stateParams.id),
    },
  })
  .state('app.events.delete', {
    url: '/:id/delete',
    template: '',
    controllerAs: 'ctrl',
    controller: function deleteCtrl ($state, EventsService, event) {
      EventsService.deleteEvent(event.id,
        () => {
          $state.go('^.list')
        },
        () => {
          $state.go('^.list')
        })
    },
    resolve: {
      event: ($stateParams, EventsService) => EventsService.getEvent($stateParams.id),
    },
  })
)
