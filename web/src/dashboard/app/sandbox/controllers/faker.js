'use strict'
import angular from 'angular'

function FakeService ($window) {
  this.faker = $window.faker
}

// TODO Invoke the methods on the model for creating fake data
function SandboxFakerCtrl ($scope, $window, CoreService, FakeService, Event, Post, User, Page, Note) {
  $scope.faker = []
  $scope.records = 10
  $scope.fakeUsers = () => {
    $scope.faker = []
    for (let i = 0; i < $scope.records; i++) {
      const fake = {
        email: FakeService.faker.internet.email(),
        userName: FakeService.faker.internet.userName(),
        firstName: FakeService.faker.name.firstName(),
        lastName: FakeService.faker.name.lastName(),
        password: FakeService.faker.internet.password(),
      }
      $scope.faker.push(fake)
      User.create(fake)
    }
    CoreService.toastSuccess(`Created ${$scope.records} users`)
  }

  $scope.fakePosts = () => {
    $scope.faker = []
    for (let i = 1; i <= $scope.records; i++) {
      const fake = {
        title: FakeService.faker.lorem.sentence(),
        content: FakeService.faker.lorem.paragraph(),
        image: FakeService.faker.image.imageUrl(),
      }
      $scope.faker.push(fake)
      Post.create(fake)
    }
    CoreService.toastSuccess(`Created ${$scope.records} posts`)
  }

  $scope.fakePages = () => {
    $scope.faker = []
    for (let i = 1; i <= $scope.records; i++) {
      const fake = {
        name: FakeService.faker.lorem.sentence(),
        content: FakeService.faker.lorem.paragraph(),
      }
      $scope.faker.push(fake)
      Page.create(fake)
    }
    CoreService.toastSuccess(`Created ${$scope.records} pages`)
  }

  $scope.fakeNotes = () => {
    $scope.faker = []
    for (let i = 1; i <= $scope.records; i++) {
      const fake = {
        title: FakeService.faker.lorem.sentence(),
        body: FakeService.faker.lorem.paragraph(),
      }
      $scope.faker.push(fake)
      Note.create(fake)
    }
    CoreService.toastSuccess(`Created ${$scope.records} notes`)
  }

  $scope.fakeEvents = () => {
    $scope.faker = []
    for (let i = 0; i < $scope.records; i++) {
      const fake = {
        name: FakeService.faker.lorem.sentence(),
        description: FakeService.faker.lorem.paragraph(),
        startDate: FakeService.faker.date.future(),
        endDate: FakeService.faker.date.future(),
      }
      $scope.faker.push(fake)
      Event.create(fake)
    }
  }
}

angular
  .module('com.module.sandbox.controllers.faker', [])
  .service('FakeService', FakeService)
  .controller('SandboxFakerCtrl', SandboxFakerCtrl)
