'use strict'
import angular from 'angular'

angular
  .module('com.module.core.components.date-button', [])
  .directive('dateButton', () => {
    const linkFn = function link (scope) {
      scope.options.open = false
      scope.switchOpen = (event) => {
        event.preventDefault()
        event.stopPropagation()
        scope.options.open = true
        return true
      }
    }

    return {
      restrict: 'A',
      scope: false,
      compile: (element) => {
        const span = angular.element('<span></span>')
        const button = angular.element('<button></button>')
        const i = angular.element('<i></i>')

        span.addClass('input-group-btn')

        button.attr('type', 'button')
        button.addClass('btn btn-default')
        button.attr('ng-click', 'switchOpen($event)')

        i.addClass('glyphicon glyphicon-calendar')

        button.append(i)
        span.append(button)
        element.after(span)

        return linkFn
      },
    }
  })

