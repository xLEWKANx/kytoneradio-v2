const debug = require('debug');
const Promise = require('bluebird');
const moment = require('moment');
const _ = require('lodash');
const schedule = require('node-schedule');
const colors = require('colors');
const createPromiseCallback = require('../../lib/utils').createPromiseCallback;

const log = debug('player:playlist');
global.Promise = Promise;

module.exports = function(Playlist) {
  let scheduleNext;
  Playlist.info = {
    status: 'Stop',
    current: null
  };

  Playlist.addSecond = (date, duration) => {
    if (!date) throw new Error(`date is ${date}`);
    return moment(date).add(duration, 'seconds').toDate();
  };

  Playlist.prototype.simplifyTime = function() {
    let inst = Object.assign({}, this.toJSON(), {
      startTime: moment('2017-06-12T16:47:48.818Z').format('HH:mm:ss'),
      endTime: moment('2017-06-12T16:47:48.818Z').format('HH:mm:ss')
    });

    return inst;
  };

  Playlist.prototype.setIndex = function(prev) {
    this.index = prev ? prev.index + 1 : 0;
    this.isChanged = true;
    return this;
  };

  Playlist.prototype.setTime = function(prev) {
    this.startTime = prev ? prev.endTime : new Date();
    this.endTime = Playlist.addSecond(this.startTime, this.duration);
    this.isChanged = true;
    return this;
  };

  Playlist.prototype.setOrder = function(prev) {
    this.order = prev ? prev.order + 1 : 0;
    this.isChanged = true;
    return this;
  };

  Playlist.prototype.updateInfoFromPrev = function(prev) {
    return this.setTime(prev).setOrder(prev);
  };

  Playlist.createFakeTracks = function(count, tracks = [], cb) {
    let Track = Playlist.app.models.Track;
    const TRACK_DURATION = 30 * 60;

    const MOCK_TRACK = new Track({
      name: 'test track',
      processed: true,
      id: 1,
      duration: TRACK_DURATION
    });

    Playlist.add(MOCK_TRACK, (err, track) => {
      if (err) return cb(err);
      tracks = tracks.concat(track);
      if (count === 0) return cb(null, tracks);

      return Playlist.createFakeTracks(count - 1, tracks, cb);
    });
  };

  Playlist.add = function(track, cb) {
    cb = cb || createPromiseCallback();

    let playlistTrack = new Playlist({
      name: track.name,
      duration: track.duration,
      trackId: track.id
    });

    Playlist.findOne({
      order: 'index DESC'
    })
      .then(prev => playlistTrack.setIndex(prev).updateInfoFromPrev(prev).save())
      .then(track => cb(null, track))
      .catch(cb);
    return cb.promise;
  };

  Playlist.prototype.moveToEnd = function(cb) {
    cb = cb || createPromiseCallback();

    Playlist.findOne({
      order: ['order DESC', 'index DESC']
    })
      .then(last => this.updateInfoFromPrev(last).save())
      .then(track => cb(null, track))
      .catch(cb);

    return cb.promise;
  };

  Playlist.getCurrentTrack = function(cb) {
    cb = cb || createPromiseCallback();

    let Player = Playlist.app.models.Player;
    Player.currentTrackIndexPromised()
      .then(index => {
        return Playlist.findOne({
          where: {
            index: index
          },
          include: ['track']
        });
      })
      .then(track => cb(null, track))
      .catch(cb);

    return cb.promise;
  };

  Playlist.remoteMethod('getCurrentTrack', {
    http: {
      verb: 'get'
    },
    returns: {
      arg: 'track',
      root: true,
      type: 'object'
    }
  });

  Playlist.tracksByOrder = function(cb) {
    cb = cb || createPromiseCallback();

    let Player = Playlist.app.models.Player;
    let playlist;

    Playlist.find({
      order: ['order ASC', 'index ASC']
    })
      .then(pl => {
        playlist = pl;
        return Player.currentTrackIndex();
      })
      .then(index => {
        return cb(null, playlist);
      })
      .catch(cb);

    return cb.promise;
  };

  Playlist.remoteMethod('tracksByOrder', {
    http: {
      verb: 'get'
    },
    returns: {
      arg: 'tracks',
      root: true,
      type: 'array'
    }
  });

  Playlist.getSchedule = function(cb) {
    cb = cb || createPromiseCallback();

    Playlist.find(
      {
        order: ['order ASC', 'index ASC'],
        limit: 5
      },
      cb
    );

    return cb.promise;
  };

  Playlist.remoteMethod('getSchedule', {
    http: {
      verb: 'get'
    },
    returns: {
      arg: 'tracks',
      root: true,
      type: 'array'
    }
  });

  Playlist.clear = function(cb) {
    let Player = Playlist.app.models.Player;

    Player.clearPromised()
      .then(() => {
        log('before destroy');
        return Playlist.destroyAllPromised({}, { skip: true });
      })
      .then(result => {
        log('Playlist clear', result);
        cb(null, result);
      })
      .catch(err => {
        cb(err);
      });
  };

  Playlist.remoteMethod('clear', {
    returns: {
      arg: 'log',
      type: 'object'
    }
  });

  Playlist.play = function(index = 0, cb) {
    if (typeof index === 'function') cb = index;
    cb = cb || createPromiseCallback();

    let Player = Playlist.app.models.Player;
    let statusTmp;
    Player.play(index)
      .then(status => {
        statusTmp = status;
        log('Playlist.play | status', status);
        return Playlist.tracksByOrder();
      })
      .then(tracks => {
        if (!tracks.length) return cb('Playlist empty');
        if (statusTmp.song === index) return cb(null, tracks[0]);
        let trackStartTime = moment(
          Playlist.addSecond(tracks[0].startTime, -statusTmp.elapsed)
        ).format('HH:mm:ss');
        let currentStartTime = moment(Playlist.addSecond(new Date(), -statusTmp.elapsed)).format(
          'HH:mm:ss'
        );
        let isStartTimeProper = trackStartTime === currentStartTime;

        if (isStartTimeProper) {
          return tracks;
        } else {
          log(
            `Start time doens't match | db startTime: ${trackStartTime}
            currentStartTime ${currentStartTime}`
          );
          return Playlist.updateTime();
        }
      })
      .then(tracks => {
        if (tracks.length) {
          return tracks[0].play().then(track => cb(null, tracks[0]));
        } else {
          cb('static play | No tracks to play');
        }
      })
      .catch(cb);

    return cb.promise;
  };

  Playlist.remoteMethod('play', {
    accepts: [
      {
        arg: 'index',
        type: 'number'
      }
    ],
    returns: {
      arg: 'track',
      type: 'object'
    }
  });

  Playlist.updatePlaylist = function(cb) {
    console.log('Updating time!'.green);
    cb = cb || createPromiseCallback();

    let tracks;
    let Player = Playlist.app.models.Player;

    Playlist.tracksByOrder()
      .then(tr => {
        if (!tr.length) return Promise.reject('Playlist empty!');
        tracks = tr;

        return Player.getStatus();
      })
      .then(status => {
        let first = tracks[0];
        let startTime;

        switch (status.state) {
          case 'playing':
            startTime = Playlist.addSecond(new Date(), status.elapsed);
            break;
          default:
            startTime = new Date();
        }
        _.chain(tracks)
          .orderBy(['index'], ['asc'])
          .reduce((prev, track) => {
            if (prev.index !== track.index - 1) track.setIndex(prev);
            return track;
          })
          .value();

        log('Updated indexes', tracks);
        let startValues = {
          endTime: startTime,
          index: -1,
          order: first.order - 1
        };
        tracks.reduce((prev, track) => {
          if (prev.endTime !== track.startTime) track.setTime(prev);
          if (prev.order !== track.order - 1) track.setOrder(prev);
          return track;
        }, startValues);

        return tracks;
      })
      .filter(track => track.isChanged)
      .tap((tracks) => { log('changed tracks', tracks); })
      .map(track => track.save())
      .then(tracks => cb(null, tracks))
      .catch(cb);

    return cb.promise;
  };

  Playlist.remoteMethod('updatePlaylist', {
    returns: {
      arg: 'tracks',
      type: 'array'
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

  Playlist.remoteMethod('stop', {
    returns: {
      arg: 'track',
      type: 'obj'
    }
  });

  Playlist.setTimeForTracks = function(tracks, startTime) {
    let beginingTrack = {
      endTime: startTime
    };
    tracks.reduce((prev, track) => track.setTime(prev), beginingTrack);
    return tracks;
  };

  Playlist.prototype.setTimeFromPrev = function(cb) {
    cb = cb || createPromiseCallback();

    Playlist.findOne({
      order: 'index DESC'
    })
      .then(lastPlaylistTrack => {
        if (!lastPlaylistTrack || lastPlaylistTrack.endTime < Date.now()) {
          lastPlaylistTrack = {
            endTime: new Date()
          };
        }
        return this.setTime(lastPlaylistTrack);
      })
      .then(() => cb(null, this))
      .catch(err => {
        cb(err);
      });

    return cb.promise;
  };

  Playlist.prototype.play = function(cb) {
    cb = cb || createPromiseCallback();

    this.scheduleNext();

    Playlist.getSchedule()
      .then(tracks => {
        Playlist.app.io.emit('track', tracks[0]);
        Playlist.app.io.emit('playlist', tracks);
        return cb(null, { nextTrack: this.endTime });
      })
      .catch(cb);

    return cb.promise;
  };

  Playlist.prototype.scheduleNext = function(cb) {
    cb = cb || createPromiseCallback();

    let Player = Playlist.app.models.Player;
    let { endTime, index } = this;
    console.log('>>> Next track in: '.cyan, endTime, this);
    if (scheduleNext) scheduleNext.cancel();

    scheduleNext = schedule.scheduleJob(endTime, () => {
      console.log('Scheduler starts');

      Player.currentTrackIndex()
        // .then(() => Playlist.getCurrentTrack())
        .then(newIndex => {
          log('prev track', index, 'new track', newIndex);
          return Playlist.play(newIndex);
        })
        .then(track => {
          return this.setTime(track).then(() => track);
        })
        .then(track => cb(null, track))
        .catch(cb);
    });

    return cb.promise;
  };

  Promise.promisifyAll(Playlist, { suffix: 'Promised' });
  Promise.promisifyAll(Playlist.prototype, { suffix: 'Promised' });
};
