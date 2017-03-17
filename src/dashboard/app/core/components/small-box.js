'use strict'
import angular from 'angular'
import templateUrl from './small-box.html'

angular
  .module('com.module.core.components.small-box', [])
  .directive('smallBox', () => ({
    restrict: 'E',
    templateUrl,
    scope: {
      name: '@',
      color: '@',
      icon: '@',
      quantity: '@',
      href: '@',
    },
  }))
