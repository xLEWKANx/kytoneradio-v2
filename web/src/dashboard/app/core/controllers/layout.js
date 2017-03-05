"use strict";
import angular from "angular";

function LayoutCtrl($scope, $rootScope, $cookies, CoreService, gettextCatalog) {
  // angular translate
  $scope.locale = {
    isopen: false
  };

  $scope.locales = $rootScope.locales;
  $scope.selectLocale = $rootScope.locale;

  $scope.setLocale = locale => {
    // set the current lang
    $scope.locale = $scope.locales[locale];
    $scope.selectLocale = $scope.locale;
    $rootScope.locale = $scope.locale;
    $cookies.lang = $scope.locale.lang;

    // You can change the language during runtime
    $scope.locale.isopen = !$scope.locale.isopen;

    gettextCatalog.setCurrentLanguage($scope.locale.lang);
  };

  $scope.appName = "LoopBack Admin";

  $scope.appTheme = "skin-blue";
  $scope.appThemes = [
    {
      name: "Black",
      class: "skin-black"
    },
    {
      name: "Blue",
      class: "skin-blue"
    }
  ];
  $scope.appLayout = "";
  $scope.appLayouts = [
    {
      name: "Fixed",
      class: "fixed"
    },
    {
      name: "Scrolling",
      class: "not-fixed"
    }
  ];

  $scope.toggleSidebar = () => {
    const $ = angular.element;
    const row = $(".row-offcanvas");
    const left = $(".left-side");
    const right = $(".right-side");
    if ($(window).width() <= 992) {
      row.toggleClass("active");
      left.removeClass("collapse-left");
      right.removeClass("stretch");
      row.toggleClass("relative");
    } else {
      // Else, enable content stretching
      left.toggleClass("collapse-left");
      right.toggleClass("stretch");
    }
  };

  $scope.settings = $rootScope.settings;
  $rootScope.loadSettings();
}

angular
  .module("com.module.core.controllers.layout", [])
  .controller("LayoutCtrl", LayoutCtrl);
