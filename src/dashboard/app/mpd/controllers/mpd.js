'use strict'
import angular from 'angular'
import moment from 'moment'
import _ from 'lodash'


function MpdCtrl($scope, Player) {

  this.mpdInfo = function () {
    Player.getStatus().$promise.then((response) => {
      this.status = JSON.stringify(response.status, null, 2)
    })
    Player.getCurrentPlaylist().$promise.then((response) => {
      console.log(response)
      this.mpdPlaylist = response.tracks
    })
  }

  this.mpdInfo()
}


angular
  .module('com.module.mpd.controllers.mpd', [])
  .controller('MpdCtrl', MpdCtrl)
