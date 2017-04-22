"use strict";
const debug = require("debug");
const Promise = require("bluebird");
const moment = require("moment");
const _ = require("lodash");
const schedule = require("node-schedule");
const colors = require("colors")

const log = debug("player:playlist");
global.Promise = Promise;

module.exports = function(Playlist) {
  let scheduleNext;
  Playlist.info = {
    status: 'Stop',
    current: null
  };

  Playlist.getCurrentTrack = function(cb) {
    let Player = Playlist.app.models.Player;

    Player.currentTrackIndexPromised()
      .then(index => {
        return Playlist.findOne({
          where: {
            index: index
          },
          include: ["track"]
        });
      })
      .then(track => cb(null, track))
      .catch(cb);
  };

  Playlist.remoteMethod("now", {
    http: {
      verb: "get"
    },
    returns: {
      arg: "track",
      root: true,
      type: "obj"
    }
  });

  Playlist.nextTrack = function(cb) {
    let Player = Playlist.app.models.Player;

    Player.nextTrackIndexPromised()
      .then(index => {
        return Playlist.findOnePromised({ where: { index: index } });
      })
      .then(track => cb(null, track))
      .catch(cb);
  };

  Playlist.remoteMethod("nextTrack", {
    http: {
      verb: "get"
    },
    returns: {
      arg: "track",
      type: "object"
    }
  });

  Playlist.getSchedule = function(cb) {
    let Player = Playlist.app.models.Player;

    Player.currentTrackIndexPromised()
      .then(index =>
        Playlist.findPromised({
          where: {
            index: {
              gt: index
            }
          },
          include: ["track"],
          limit: 5
        }))
      .then(tracks => cb(null, tracks))
      .catch(cb);
  };

  Playlist.remoteMethod("getSchedule", {
    http: {
      verb: "get"
    },
    returns: {
      arg: "tracks",
      root: true,
      type: "array"
    }
  });

  Playlist.createFakeTracks = function (count, tracks = [], cb) {
    let Track = Playlist.app.models.Track;
    const TRACK_DURATION = 30 * 60;

    let playlist = [];
    let startTime = new Date();

    const MOCK_TRACK = new Track({
      name: 'test track',
      processed: true,
      duration: TRACK_DURATION
    })

    let MOCK_PLAYLIST_TRACK = new Playlist({
      name: 'test playlist track',
      duration: TRACK_DURATION,
      index: 0
    })

    MOCK_TRACK.playlist.create(MOCK_PLAYLIST_TRACK, (err, track) => {
      if (err) return cb(err);
      if (count === 0) return cb(null, tracks);

      return Playlist.createFakeTracks(count - 1, tracks.concat(track), cb);
    })
  };

  Playlist.addSecond = (date, duration) => {
    if (!date) throw new Error(`date is ${date}`);
    return moment(date).add(duration, "seconds").toDate();
  };

  Playlist.remoteMethod("decIndexFrom", {
    accepts: {
      arg: "index",
      type: "number"
    },
    returns: {
      arg: "tracks",
      type: "array"
    }
  });

  Playlist.clear = function(cb) {
    let Player = Playlist.app.models.Player;

    Player.clearPromised()
      .then(() => {
        log("before destroy");
        return Playlist.destroyAllPromised({}, { skip: true });
      })
      .then(result => {
        log("Playlist clear", result);
        cb(null, result);
      })
      .catch(err => {
        cb(err);
      });
  };

  Playlist.remoteMethod("clear", {
    returns: {
      arg: "log",
      type: "object"
    }
  });

  Playlist.play = function(cb) {
    if (!cb) cb = function() {};
    let Player = Playlist.app.models.Player;
    Player.currentTrackIndexPromised()
      .then(index => {
        log("static play | index:", index);
        return Playlist.findPromised({
          where: {
            index: {
              gte: index
            }
          }
        });
      })
      .then(tracks => {
        log("static play | tracks", tracks);
        return Playlist.updateTimeAndIndexPromised(tracks, {
          startTime: new Date()
        });
      })
      .then(tracks => {
        if (tracks.length) {
          return tracks[0].playPromised().then(track => cb(null, track));
        } else {
          cb("static play | No tracks to play");
        }
      })
      .catch(cb);
  };

  Playlist.remoteMethod("play", {
    returns: {
      arg: "track",
      type: "object"
    }
  });

  Playlist.stop = function(cb) {
    let Player = Playlist.app.models.Player;
    if (scheduleNext) scheduleNext.cancel();
    Player.stopPromised()
      .then(msg => {
        cb(null, msg);
      })
      .catch(cb);
  };

  Playlist.remoteMethod("stop", {
    returns: {
      arg: "track",
      type: "obj"
    }
  });

  Playlist.getIndex = function(cb) {
    Playlist.count(
      {
        index: {
          gte: 0
        }
      },
      cb
    );
  };

  Playlist.prototype.setIndex = function(cb) {
    Playlist.findOne(
      {
        order: 'index DESC'
      },
      (err, track) => {
        if (err) return cb(err);
        this.index = track ? track.index + 1 : 0;
        log("set index", this.index, "for", this.name);
        return cb(null, this);
      }
    );
  };

  Playlist.setTimeForTracks = function(tracks, startTime) {
    let beginingTrack = {
      endTime: startTime
    };
    tracks.reduce((prev, track) => track.setTime(prev), beginingTrack);
    return tracks;
  };

  Playlist.setIndexesForTracks = function(tracks, startIndex) {
    tracks.reduce(
      (prev, track) => Object.assign(track, { index: prev.index + 1 }),
      { index: startIndex - 1 }
    );
    return tracks;
  };

  Playlist.saveTracks = function(tracks, cb) {
    return Promise.all(tracks)
      .mapSeries(track => track.savePromised())
      .then(tracks => cb(null, tracks))
      .catch(cb);
  };

  Playlist.updateTimeAndIndex = function(tracks, options, cb) {
    let index = options.index;
    let startTime = options.startTime;
    if (isFinite(index)) tracks = Playlist.setIndexesForTracks(tracks, index);
    if (startTime) tracks = Playlist.setTimeForTracks(tracks, startTime);
    log("updateTimeAndIndex | track updated", tracks);
    return Playlist.saveTracks(tracks, cb);
  };

  Playlist.prototype.setTime = function(prev) {
    return Object.assign(this, {
      startTime: prev.endTime,
      endTime: Playlist.addSecond(prev.endTime, this.duration)
    });
  };

  Playlist.prototype.setTimeFromPrev = function(cb) {
    log("set time for", this);
    Playlist.findOnePromised({
      where: {
        and: [
          {
            index: {
              gte: 0
            }
          },
          {
            index: {
              lt: this.index
            }
          }
        ]
      },
      order: "index DESC",
      include: "track"
    })
      .then(lastPlaylistTrack => {
        log("lastPlaylistTrack", lastPlaylistTrack);
        if (!lastPlaylistTrack || lastPlaylistTrack.endTime < Date.now()) {
          lastPlaylistTrack = {
            endTime: new Date()
          };
        }
        this.setTime(lastPlaylistTrack);
        log("setTime track:", this);
        cb(null, this);
      })
      .catch(err => {
        cb(err);
      });
  };

  Playlist.prototype.play = function(cb) {
    let Player = Playlist.app.models.Player;
    let index = this.index;
 
    Player.playPromised(index)
      .then(() => {
        Playlist.emit("playing", this);
        return cb(null, this);
      })
      .catch(cb);
  };
  Playlist.prototype.playNext = function(cb) {
    let Player = Playlist.app.models.Player;
    let triggerNext = this.endTime;

    if (scheduleNext) scheduleNext.cancel();

    scheduleNext = schedule.scheduleJob(triggerNext, () => {
      Playlist.nextTrackPromised()
        .then(track => {
          log("play next track", track);
          if (!track) {
            console.log(">>> !! QUEUE END");
            return Player.stopPromised();
          } else {
            Playlist.emit("playing", track);
            // return this.destroyPromised()
          }
        })
        .catch(err => Playlist.emit("error", err));
    });

    if (cb) return cb(null, "success");
  };

  Playlist.observe("before save", (ctx, next) => {
    if (ctx.options.skip) return next();
    log("before save | ctx", _.keys(ctx));
    if (ctx.instance && ctx.isNewInstance) {
      log("instance", ctx.instance);
      return updateTrackInfo(ctx.instance, next);
    } else if (ctx.where && ctx.where.index) {
      next();
    } else {
      return next();
    }
  });

  function updateTrackInfo(track, next) {
    return track
      .setIndexPromised()
      .then(track => {
        return track.setTimeFromPrevPromised();
      })
      .catch(next);
  }

  Playlist.on("playing", playlistTrack => {


    Playlist.info.current = playlistTrack;
    Playlist.info.status = 'Playing';

    console.log('>>> Player info:\n'.magenta, JSON.stringify(Playlist.info, null, 2));
    log(">>> Next track in: ".cyan, playlistTrack.endTime);

    playlistTrack.track((err, track) => {
      if (err) return console.error(err);
      Playlist.app.io.emit("track", track);
    });

    Playlist.getSchedulePromised().then(tracks => {
      Playlist.app.io.emit("playlist", tracks);
    });

    playlistTrack.playNext();
  });

  Promise.promisifyAll(Playlist, { suffix: "Promised" });
  Promise.promisifyAll(Playlist.prototype, { suffix: "Promised" });
};
