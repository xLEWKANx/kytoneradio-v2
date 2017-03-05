'use strict'

import angular from 'angular'
import templateUrl from './admin-header.html'

angular
  .module('com.module.core.components.admin-header', [])
  .directive('adminHeader', () => ({
    templateUrl,
    transclude: true,
    scope: {
      title: '@',
      subTitle: '@',
    },
    restrict: 'A',
  }))
