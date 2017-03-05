"use strict";
import angular from "angular";

function MainCtrl(
  $scope,
  $rootScope,
  $state,
  AppAuth,
  CoreService,
  User,
  gettextCatalog
) {
  AppAuth.ensureHasCurrentUser(() => {
    // This call also serves to redirect a user to the login screen
    // via the interceptor in users.auth.js, if they are not authenticated.
    $scope.currentUser = User.getCurrent();
    console.log("user", $scope.currentUser);
  });

  $scope.menuoptions = $rootScope.menu;

  $scope.logout = () => {
    AppAuth.logout(() => {
      CoreService.toastSuccess(
        gettextCatalog.getString("Logged out"),
        gettextCatalog.getString("You are logged out!")
      );
      $state.go("login");
    });
  };
}

angular
  .module("com.module.core.controllers.main", [])
  .controller("MainCtrl", MainCtrl);
