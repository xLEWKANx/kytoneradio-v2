"use strict";
const mpd = require("mpd");
const debug = require("debug");
const Promise = require("bluebird");
const request = require("request");
const log = debug("player:Player");

global.Promise = Promise;

module.exports = function(Player) {
  let client = {};
  let state = {
    isPlaying: false
  };
  Player.on("error", err => {
    Player.log({
      error: err
    });
  });

  Player.bootstrap = function(cb) {
    client = mpd.connect({
      port: process.env.MPD_PORT || 6600,
      host: "localhost"
    });
    client.on("error", err => {
      cb(err);
      Player.emit("error", err);
    });

    client.on("ready", () => {
      console.log("ready");
      cb(null, client);
    });
  };

  Player.play = function(index, cb) {
    if (typeof index === "function") {
      cb = index;
      index = undefined;
    }
    let arg = index === undefined ? [] : [index];
    client.sendCommand(mpd.cmd("play", arg), (err, msg) => {
      if (err) return cb(err);
      Player.emit("play");
      state.isPlaying = true;
      Player.log(
        {
          command: "play"
        },
        cb
      );
    });
  };

  Player.remoteMethod("play", {
    accepts: {
      arg: "index",
      type: "number"
    },
    returns: {
      arg: "message",
      type: "string"
    }
  });

  Player.stop = function(cb) {
    client.sendCommand(mpd.cmd("stop", []), (err, msg) => {
      if (err) return cb(err);
      Player.emit("stop");
      state.isPlaying = false;
      Player.log(
        {
          command: "stop"
        },
        cb
      );
    });
  };

  Player.remoteMethod("stop", {
    returns: {
      arg: "message",
      type: "string"
    }
  });

  Player.addTrack = function(name, cb) {
    client.sendCommand(mpd.cmd("add", [name]), (err, msg) => {
      if (err) return cb(err);
      log(`Added ${name} to MPD playlist`, err, msg);
      Player.log(
        {
          command: "play",
          messange: name
        },
        cb
      );
    });
  };

  Player.getCurrentPlaylist = function(cb) {
    client.sendCommand(mpd.cmd("playlistinfo", []), (err, msg) => {
      if (err) return cb(err);
      return cb(null, msg);
    });
  };

  Player.remoteMethod("getCurrentPlaylist", {
    returns: {
      arg: "tracks",
      type: "string"
    }
  });

  Player.clear = function(cb) {
    client.sendCommand(mpd.cmd("clear", []), (err, msg) => {
      if (err) return cb(err);
      Player.log(
        {
          command: "clear"
        },
        cb
      );
    });
  };

  Player.remoteMethod("clear", {
    returns: {
      arg: "message",
      type: "string"
    }
  });

  Player.deleteTrack = function(position, cb) {
    client.sendCommand(mpd.cmd("delete", [position]), (err, msg) => {
      if (err) return cb(err);
      return cb(null, msg);
    });
  };

  Player.moveTrack = function(require, to, cb) {
    client.sendCommand(mpd.cmd("move", [require, to]), (err, msg) => {
      if (err) return cb(err);
      return cb(null, msg);
    });
  };

  Player.getStatus = function(cb) {
    client.sendCommand(mpd.cmd("status", []), (err, msg) => {
      if (err) return cb(err);
      msg = mpd.parseKeyValueMessage(msg);
      return cb(null, msg);
    });
  };

  Player.remoteMethod("getStatus", {
    http: {
      verb: "get"
    },
    returns: {
      arg: "status",
      type: "string"
    }
  });

  Player.currentTrackIndex = function(cb) {
    Player.getStatus((err, status) => {
      if (err) return cb(err);
      return cb(null, status.song || 0);
    });
  };

  Player.nextTrackIndex = function(cb) {
    Player.getStatus((err, status) => {
      if (err) return cb(err);
      if (!status.nextsong) cb("Player.nextTrackIndex | no next song");
      return cb(null, status.nextsong);
    });
  };

  Player.updateDatabase = function(cb) {
    client.sendCommand(mpd.cmd("update", []), (err, msg) => {
      if (err) return cb(err);
      log("database updated", msg);
      return cb(null, msg);
    });
  };

  Player.getState = function() {
    return state;
  };

  Player.log = function(info, cb) {
    let log = Object.assign(
      {
        timestamp: new Date()
      },
      info
    );
    // Player.create(log, cb)
    cb && cb();
    // cb(null, [])
  };

  Player.stream = function(cb) {
    let stream = request("http://localhost:15001/stream");
    cb(null, stream, "application/octet-stream");
  };

  Player.remoteMethod("stream", {
    http: {
      verb: "get"
    },
    returns: [
      { arg: "body", type: "file", root: true },
      { arg: "Content-Type", type: "string", http: { target: "header" } }
    ]
  });

  Promise.promisifyAll(Player, { suffix: "Promised" });
};
