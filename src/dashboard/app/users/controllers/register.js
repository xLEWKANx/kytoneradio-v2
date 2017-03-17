'use strict'
import angular from 'angular'
function RegisterCtrl ($scope, $routeParams, $location, $filter, CoreService, User, AppAuth, gettextCatalog) {

  $scope.registration = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  }

  $scope.schema = [ {
    label: '',
    property: 'firstName',
    placeholder: gettextCatalog.getString('First Name'),
    type: 'text',
    attr: {
      ngMinlength: 4,
      required: true,
    },
    msgs: {
      minlength: gettextCatalog.getString('Needs to have at least 4 characters'),
    },
  }, {
    label: '',
    property: 'lastName',
    placeholder: gettextCatalog.getString('Last Name'),
    type: 'text',
    attr: {
      ngMinlength: 4,
      required: true,
    },
    msgs: {
      minlength: gettextCatalog.getString('Needs to have at least 4 characters'),
    },
  }, {
    label: '',
    property: 'email',
    placeholder: gettextCatalog.getString('Email'),
    type: 'email',
    help: gettextCatalog.getString('Don\'t worry we won\'t spam your inbox'),
    attr: {
      required: true,
      ngMinlength: 4,
    },
    msgs: {
      required: gettextCatalog.getString('You need an email address'),
      email: gettextCatalog.getString('Email address needs to be valid'),
      valid: gettextCatalog.getString('Nice email address!'),
    },
  }, {
    type: 'multiple',
    fields: [ {
      label: '',
      property: 'password',
      placeholder: gettextCatalog.getString('Password'),
      type: 'password',
      attr: {
        required: true,
        ngMinlength: 6,
      },
    }, {
      label: '',
      property: 'confirmPassword',
      placeholder: gettextCatalog.getString('Confirm Password'),
      type: 'password',
      attr: {
        confirmPassword: 'user.password',
        required: true,
        ngMinlength: 6,
      },
      msgs: {
        match: gettextCatalog.getString('Your passwords need to match'),
      },
    } ],
    columns: 6,
  } ]

  $scope.options = {
    validation: {
      enabled: true,
      showMessages: false,
    },
    layout: {
      type: 'basic',
      labelSize: 3,
      inputSize: 9,
    },
  }

  $scope.confirmPassword = ''

  $scope.register = () => {
    $scope.registration.username = $scope.registration.email
    delete $scope.registration.confirmPassword
    $scope.user = User.save($scope.registration,
      () => {
        $scope.loginResult = User.login(
          {
            include: 'user',
            rememberMe: true,
          }, $scope.registration,
          () => {
            AppAuth.currentUser = $scope.loginResult.user
            CoreService.toastSuccess(gettextCatalog.getString(
              'Registered'), gettextCatalog.getString(
              'You are registered!'))
            $location.path('/')
          },
          (res) => {
            CoreService.toastWarning(gettextCatalog.getString(
              'Error signin in after registration!'), res.data.error
              .message)
            $scope.loginError = res.data.error
          })

      },
      (res) => {
        console.log(res.data.error)
        // CoreService.toastError(gettextCatalog.getString(
        //   'Error registering!'), res.data.error.message)
        $scope.registerError = res.data.error
      }
    )
  }
}

angular
  .module('com.module.users.controllers.register', [])
  .controller('RegisterCtrl', RegisterCtrl)
  .directive('confirmPassword', () => ({
    restrict: 'A',
    require: 'ngModel',
    link: (scope, element, attrs, ngModel) => {
      const validate = (viewValue) => {
        const password = scope.$eval(attrs.confirmPassword)
        ngModel.$setValidity('match', ngModel.$isEmpty(viewValue) || viewValue === password)
        return viewValue
      }
      ngModel.$parsers.push(validate)
      scope.$watch(attrs.confirmPassword, () => validate(ngModel.$viewValue))
    },
  }))
