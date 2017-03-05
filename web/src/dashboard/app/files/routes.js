'use strict'
import angular from 'angular'

import templateUrlMain from './views/main.html'
import templateUrlList from './views/list.html'
import templateUrlUpload from './views/upload.html'

const app = angular.module('com.module.files.routes', [])

app.config(($stateProvider) => $stateProvider
  .state('app.files', {
    abstract: true,
    url: '/files',
    templateUrl: templateUrlMain,
  })
  .state('app.files.list', {
    url: '',
    templateUrl: templateUrlList,
    controllerAs: 'ctrl',
    controller: 'TracksCtrl',
    resolve: {
      tracks: (TracksService) => TracksService.getTracks(),
      playlist: (PlaylistService) => PlaylistService.getPlaylist()
    },
  })
  .state('app.files.upload', {
    url: '/upload',
    templateUrl: templateUrlUpload,
    controllerAs: 'ctrl',
    controller: function uploadCtrl (CoreService) {
      // this.uploader = new FileUploader({
      //   url: `${CoreService.env.apiUrl}/containers/files/upload`,
      //   formData: [ {
      //     key: 'value',
      //   } ],
      // })
    },
  })
  .state('app.files.delete', {
    url: '/:fileName/delete',
    template: '',
    controllerAs: 'ctrl',
    controller: function deleteCtrl ($stateParams, $state, FileService) {
      FileService.delete($stateParams.fileName,
        () => $state.go('^.list'),
        () => $state.go('^.list')
      )
    },
  })
)
