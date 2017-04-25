"use strict";
import angular from "angular";
import moment from "moment";
import _ from "lodash";

const SECONDS_TO_PIXEL = 1200 / (24 * 60 * 60);
const TIME_NOW = Date.now() / 1000;
const SECOND_FROM_START = moment().diff(moment().startOf("day"), "seconds");

const TINE_END = function(time) {
  return +moment(time);
};

function timeTox(time) {
  return `${SECONDS_TO_PIXEL * time}px`;
}

function TracksCtrl(
  $scope,
  tracks,
  playlist,
  Track,
  TracksService,
  Player,
  Playlist,
  PlaylistService,
  $q,
  FileUploader,
  LoopBackAuth,
  CoreService
) {
  this.playlist = playlist;
  this.tracks = tracks;
  this.changeTime = function(date) {
    PlaylistService.getPlaylist(date).then(res => this.playlist = res);
  };

  this.scanDir = function() {
    Track.scanDir()
      .$promise.then(() => Track.find({
        filter: {
          where: {
            proccessed: true
          }
        }
      }).$promise)
      .then(tracks => this.tracks = tracks);
  };

  let url = "/api/musicStorages/music/upload";
  let token = LoopBackAuth.accessTokenId;

  this.uploader = new FileUploader({
    url: url,
    headers: {
      Authorization: token
    }
  });

  this.uploader.onAfterAddingFile = (item) => {
    item.upload();
  };

  this.uploader.onSuccessItem = (item, response, status, headers) => {
    this.uploader.removeFromQueue(item)
    CoreService.toastSuccess(
      'File uploaded',
      JSON.stringify(response, null, 4)
    )
  };
  this.uploader.onErrorItem = (item, response, status, headers) => {
    this.uploader.removeFromQueue(item)
    CoreService.toastError(
      'File upload error',
      JSON.stringify(response)
    )
  };
  this.addFile = function() {};

  this.addItemToPlaylist = function(item) {
    let playlistItem = angular.copy(item);

    playlistItem
      .$prototype$addToPlaylist()
      .then(responce => {
        this.dt = responce.startTime;
      })
      .catch(err => {
        console.error("error", err);
      });
  };

  this.delete = function(item) {
    console.log(item);
    Playlist
      .deleteById({
        id: item.id
      })
      .$promise.then(() => {
        PlaylistService.getPlaylist(this.date).then(res => this.playlist = res);
      })
  };

  this.deleteTrack = function(item) {
    console.log(item);
    item.$delete()
      .then(() => {
        CoreService.toastSuccess(
          'Track delete success',
          'good!'
        )
      })
      .catch((err) => {
        let message = err.data && err.data.error ? err.data.error.message : 'Uknown error';
        console.error(err);
        CoreService.toastError(
          'Track delete error',
          err.data.error.message
        )
      })
  };
  this.date = new Date();
  $scope.$watch(() => this.dt, date => {
    this.changeTime(date);
  });

  this.formatTime = date => {
    return moment(date).format("HH:mm");
  };

  this.play = function() {
    Playlist.play();
  };
  this.stop = function() {
    Playlist.stop();
  };
  this.refresh = function() {
    Playlist.updateTime();
  };

  this.clearPlaylist = function() {
    PlaylistService.clear()
      .then(() =>
        PlaylistService.getPlaylist(this.date)
          .then(res => this.playlist = res));
  };

  this.storage = { tracks };
  this.moment = moment;
  this.formats = ["dd.MM.yyyy"];
  this.format = this.formats[0];
  this.today = () => {
    this.dt = moment();
  };
  this.today();

  this.clear = () => {
    this.today();
  };

  this.open = $event => {
    $event.preventDefault();
    $event.stopPropagation();
    this.opened = true;
  };
  this.dateOptions = {
    formatYear: "yyyy",
    startingDay: 1,
    minDate: Date.now()
  };
}

angular
  .module("com.module.files.controllers.tracks", [])
  .controller("TracksCtrl", TracksCtrl);
