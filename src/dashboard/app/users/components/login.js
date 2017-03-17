import angular from 'angular'
import templateUrl from './login.html'

angular.module('com.module.users.components.login', [])
  .component('login', {
    templateUrl,
    controller: 'LoginCtrl',
  })
