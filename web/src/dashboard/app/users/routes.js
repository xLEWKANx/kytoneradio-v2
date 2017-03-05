'use strict'
import angular from 'angular'

import templateUrlForm from './views/form.html'
import templateUrlList from './views/list.html'
import templateUrlMain from './views/main.html'
import templateUrlView from './views/view.html'
import templateUrlProfile from './views/profile.html'

const app = angular.module('com.module.users.routes', [])

app.config($stateProvider => $stateProvider
  .state('login', {
    url: '/login',
    template: '<login></login>',
  })
  .state('register', {
    url: '/register',
    template: '<register></register>',
    controller: 'RegisterCtrl',
  })
  .state('app.users', {
    abstract: true,
    url: '/users',
    templateUrl: templateUrlMain,
  })
  .state('app.users.list', {
    url: '',
    templateUrl: templateUrlList,
    controllerAs: 'ctrl',
    controller: function listCtrl (users) {
      this.users = users
    },
    resolve: {
      users: (UserService) => UserService.find(),
    },
  })
  .state('app.users.add', {
    url: '/add',
    templateUrl: templateUrlForm,
    controllerAs: 'ctrl',
    controller: function addCtrl ($state, UserService, user) {
      this.user = user
      this.formFields = UserService.getFormFields('add')
      this.formOptions = {}
      this.submit = () => UserService.upsert(this.user)
        .then(() => $state.go('^.list'))
        .catch((err) => console.log(err))
    },
    resolve: {
      user: () => {},
    },
  })
  .state('app.users.edit', {
    url: '/edit/:id',
    templateUrl: templateUrlForm,
    controllerAs: 'ctrl',
    controller: function editCtrl ($state, UserService, user) {
      this.user = user
      this.formFields = UserService.getFormFields('edit')
      this.formOptions = {}
      this.submit = () => UserService.upsert(this.user)
        .then(() => $state.go('^.list'))
        .catch((err) => console.log(err))
    },
    resolve: {
      user: ($stateParams, UserService) => UserService.findById($stateParams.id),
    },
  })
  .state('app.users.view', {
    url: '/view/:id',
    templateUrl: templateUrlView,
    controllerAs: 'ctrl',
    controller: function viewCtrl (user) {
      this.user = user
    },
    resolve: {
      user: ($stateParams, UserService) => UserService.findById($stateParams.id),
    },
  })
  .state('app.users.delete', {
    url: '/:id/delete',
    template: '',
    controller: ($stateParams, $state, UserService) => UserService.delete($stateParams.id,
      () => $state.go('^.list'),
      () => $state.go('^.list')
    ),
  })
  .state('app.users.profile', {
    url: '/profile',
    templateUrl: templateUrlProfile,
    controllerAs: 'ctrl',
    controller: function profileCtrl ($state, UserService, user) {
      this.user = user
      this.formFields = UserService.getFormFields('edit')
      this.formOptions = {}
      this.submit = () => UserService.upsert(this.user)
        .then(() => $state.go('^.profile'))
        .catch((err) => console.log(err))
    },
    resolve: {
      user: User => User.getCurrent((user) => user, (err) => console.log(err)),
    },
  })
)

