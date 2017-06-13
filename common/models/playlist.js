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
      startTime: moment.utc(this.startTime).format('HH:mm:ss'),
      endTime: moment.utc(this.endTime).format('HH:mm:ss')
    });

    return inst;
  };

  Playlist.prototype.setIndex = function(prev) {
    this.index = prev ? prev.index + 1 : 0;
    return this;
  };

  Playlist.prototype.setTime = function(prev) {
    this.startTime = prev ? prev.endTime : new Date();
    this.endTime = Playlist.addSecond(this.startTime, this.duration);
    return this;
  };

  Playlist.prototype.setOrder = function(prev) {
    this.order = prev ? prev.order + 1 : 0;
    return this;
  };

  Playlist.prototype.setPlayCount = function() {
    this.playedTimes += 1;
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
      .then(last => this.updateInfoFromPrev(last).setPlayCount().save())
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

    Playlist.find(
      {
        order: ['order ASC', 'index ASC']
      },
      cb
    );

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

  Playlist.updatePlaylist = function(status, cb) {
    console.log('Updating time!'.green, status);
    cb = cb || createPromiseCallback();

    Playlist.find({
      order: 'index ASC'
    })
      .then(tracks => {
        if (!tracks.length) return Promise.reject('Playlist empty!');
        let startTime;

        switch (status.state) {
          case 'play':
            startTime = Playlist.addSecond(new Date(), -status.elapsed);
            break;
          default:
            startTime = new Date();
        }
        tracks.reduce((prev, track) => {
          if (prev.index !== track.index - 1) track.setIndex(prev);
          return track;
        });
        let orderedPlaylsit = [
          ...tracks.slice(status.song || 0),
          ...tracks.slice(0, status.song || 0)
        ];

        let startValues = {
          endTime: startTime,
          order: -1
        };
        orderedPlaylsit.reduce((prev, track) => {
          if (prev.endTime !== track.startTime) track.setTime(prev);
          if (prev.order !== track.order - 1) track.setOrder(prev);
          return track;
        }, startValues);

        return orderedPlaylsit;
      })
      .tap(tracks => {
        log('changed tracks', tracks);
      })
      .map(track => track.save())
      .then(tracks => cb(null, tracks))
      .catch(cb);

    return cb.promise;
  };

  Playlist.remoteMethod('updatePlaylist', {
    returns: {
      arg: 'tracks',
      type: 'array',
      root: true
    }
  });

  Playlist.deleteTracks = function(indexes, cb) {
    cb = cb || createPromiseCallback();

    let Player = Playlist.app.models.Player;
    if (!Array.isArray(indexes)) {
      indexes = [indexes];
    }

    Playlist.destroyAll({
      index: {
        inq: indexes
      }
    })
      .then(() => Player.getStatus())
      .then(status => Playlist.updatePlaylist(status, cb))
      .catch(cb);

    return cb.promise;
  };

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

  Playlist.play = function(index, cb) {
    if (typeof index === 'function') cb = index;
    cb = cb || createPromiseCallback();

    let Player = Playlist.app.models.Player;
    Player.getStatus()
      .then(status => {
        log('Playlist.play | status', status);
        return Playlist.updatePlaylist(status);
      })
      .then(tracks => {
        if (!tracks.length) return cb('Playlist empty');

        return tracks[0].play().then(track => cb(null, tracks[0]));
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

  Playlist.prototype.play = function(cb) {
    cb = cb || createPromiseCallback();
    let Player = Playlist.app.models.Player;

    this.scheduleNext();
    Player.play(this.index)
      .then(() => Playlist.getSchedule())
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
      process.nextTick(() => {
        Playlist.play(cb);
      });
    });

    return cb.promise;
  };

  Promise.promisifyAll(Playlist, { suffix: 'Promised' });
  Promise.promisifyAll(Playlist.prototype, { suffix: 'Promised' });
};
