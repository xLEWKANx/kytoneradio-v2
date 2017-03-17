'use strict'

import angular from 'angular'

import {dependencies} from './dependencies'
import {modules} from './modules'

const angularModules = [].concat(dependencies, modules)

import './style'
import '../lib/config'
import '../lib/lb-services'

const app = angular.module('loopbackApp', angularModules)

// .run(function ($rootScope, $cookies, gettextCatalog) {
//
//   $rootScope.locales = {
//     'de': {
//       lang: 'de',
//       country: 'DE',
//       name: gettextCatalog.getString('German')
//     },
//     'en': {
//       lang: 'en',
//       country: 'US',
//       name: gettextCatalog.getString('English')
//     },
//     'es_MX': {
//       lang: 'es_MX',
//       country: 'MX',
//       name: gettextCatalog.getString('Spanish')
//     },
//     'fr': {
//       lang: 'fr',
//       country: 'FR',
//       name: gettextCatalog.getString('Français')
//     },
//     'nl': {
//       lang: 'nl',
//       country: 'NL',
//       name: gettextCatalog.getString('Dutch')
//     },
//     'pt-BR': {
//       lang: 'pt_BR',
//       country: 'BR',
//       name: gettextCatalog.getString('Portuguese Brazil')
//     },
//     'ru_RU': {
//       lang: 'ru_RU',
//       country: 'RU',
//       name: gettextCatalog.getString('Russian')
//     },
//     'zh_CN': {
//       lang: 'zh_CN',
//       country: 'CN',
//       name: gettextCatalog.getString('Chinese')
//     }
//   }
//
//   var lang = $cookies.lang || navigator.language || navigator.userLanguage
//
//   $rootScope.locale = $rootScope.locales[lang]
//
//   if (angular.isUndefined($rootScope.locale)) {
//     $rootScope.locale = $rootScope.locales[lang]
//     if (angular.isUndefined($rootScope.locale)) {
//       $rootScope.locale = $rootScope.locales['en']
//     }
//   }
//
//   gettextCatalog.setCurrentLanguage($rootScope.locale.lang)
//
// })
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
