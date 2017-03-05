'use strict'
import angular from 'angular'

const app = angular.module('com.module.core.config', [])

app.config((cfpLoadingBarProvider) => {
  cfpLoadingBarProvider.includeSpinner = false
})

app.run(($rootScope, Setting, gettextCatalog) => {

  // Left Sidemenu
  $rootScope.menu = []

  // Add Sidebar Menu
  $rootScope.addMenu = (name, sref, icon) => $rootScope.menu.push({ name, sref, icon })

  // Add Menu Dashboard
  $rootScope.addMenu(gettextCatalog.getString('Dashboard'), 'app.home', 'fa-dashboard')

  // Dashboard
  $rootScope.dashboardBox = []

  // Add Dashboard Box
  $rootScope.addDashboardBox = (name, color, icon, quantity, href) => {
    $rootScope.dashboardBox.push({ name, color, icon, quantity, href })
  }

  // Get Settings for Database
  $rootScope.setSetting = (key, value) => {

    Setting.find({
      filter: {
        where: {
          key,
        },
      },
    }, (data) => {
      if (data.length) {
        data[ 0 ].value = value
        data[ 0 ].$save()
      } else {
        Setting.create({
          key,
          value,
        }, (data) => console.log(data))
      }
      $rootScope.loadSettings()
    })
  }

  // Load Settings blank
  $rootScope.settings = {}

  // Get Settings for Loopback Service
  $rootScope.loadSettings = () => {
    Setting.find((settings) => {
      $rootScope.settings.data = settings
    })
  }

})
