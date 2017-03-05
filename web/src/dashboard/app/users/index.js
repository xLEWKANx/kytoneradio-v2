'use strict'
import angular from 'angular'
import _ from 'lodash'

import './components'
import './controllers'
import './routes'
import './services'

const NAME = 'com.module.users'
const MODULES = [
  `${NAME}.components`,
  `${NAME}.controllers`,
  `${NAME}.routes`,
  `${NAME}.services`,
]

angular.module(NAME, MODULES)
  .run(($rootScope, gettextCatalog) => $rootScope
    .addMenu(gettextCatalog.getString('Users'), 'app.users.list', 'fa-user'))
  .config(($httpProvider) => {
    // Intercept 401 responses and redirect to login screen
    $httpProvider.interceptors.push(($q, $location, CoreService) => {
      return {
        responseError: (rejection) => {
          if (rejection.status === 401) {
            // $rootScope.currentUser = null
            // save the current location so that login can redirect back
            $location.nextAfterLogin = $location.path()

            if ($location.path() === '/router' || $location.path() ===
              '/login') {
              console.log('401 while on router on login path')
            } else {
              if ($location.path() !== '/register') {
                $location.path('/login')
              }
              CoreService.toastWarning('Error 401 received',
                'We received a 401 error from the API! Redirecting to login'
              )
            }
          }
          if (rejection.status === 404) {
            console.log(rejection)
            CoreService.toastError('Error 404 received', _.get(rejection, 'data.error.message'))
          }
          if (rejection.status === 422) {
            console.log(rejection)
            CoreService.toastError('Error 422 received', _.get(rejection, 'data.error.message'))
          }
          if (rejection.status === 0) {
            $location.path('/')
            CoreService.toastError('Connection Refused',
              'The connection to the API is refused. Please verify that the API is running!'
            )
          }
          return $q.reject(rejection)
        },
      }
    })
  })
