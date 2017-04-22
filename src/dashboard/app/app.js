'use strict'

import angular from 'angular'

import {dependencies} from './dependencies'
import {modules} from './modules'

const angularModules = [].concat(dependencies, modules)

import './style'
import '../lib/config'
import '../lib/lb-services'

const app = angular.module('loopbackApp', angularModules)

app.run((formlyConfig) => {
  /*
   ngModelAttrs stuff
   */
  let ngModelAttrs = {}

  function camelize (string) {
    string = string.replace(/[\-_\s]+(.)?/g, (match, chr) => {
      return chr ? chr.toUpperCase() : ''
    })
    // Ensure 1st char is always lowercase
    return string.replace(/^([A-Z])/, (match, chr) => {
      return chr ? chr.toLowerCase() : ''
    })
  }

  /*
   timepicker
   */
  ngModelAttrs = {}

  // attributes
  angular.forEach([ 'meridians', 'readonly-input', 'mousewheel', 'arrowkeys' ], (attr) => {
    ngModelAttrs[ camelize(attr) ] = { attribute: attr }
  })

  // bindings
  angular.forEach([ 'hour-step', 'minute-step', 'show-meridian' ], (binding) => {
    ngModelAttrs[ camelize(binding) ] = { bound: binding }
  })

  formlyConfig.setType({
    name: 'timepicker',
    template: '<timepicker ng-model="model[options.key]"></timepicker>',
    wrapper: [
      'bootstrapLabel',
      'bootstrapHasError',
    ],
    defaultOptions: {
      ngModelAttrs: ngModelAttrs,
      templateOptions: {
        timepickerOptions: {},
      },
    },
  })

  formlyConfig.setType({
    name: 'datepicker',
    template: '<datepicker ng-model="model[options.key]" ></datepicker>',
    wrapper: [
      'bootstrapLabel',
      'bootstrapHasError',
    ],
    defaultOptions: {
      ngModelAttrs: ngModelAttrs,
      templateOptions: {
        datepickerOptions: {},
      },
    },
  })
})

app.config([ 'ngToastProvider', (ngToast) => ngToast.configure({
  verticalPosition: 'bottom',
}) ])
