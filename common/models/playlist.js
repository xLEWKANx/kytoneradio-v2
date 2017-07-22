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
    cb = cb || createPromiseCallback();

    let Track = Playlist.app.models.Track;
    const TRACK_DURATION = 30 * 60;

    const MOCK_TRACK = new Track({
      name: 'test track ' + tracks.length,
      processed: true,
      duration: TRACK_DURATION,
      path: 'e:/music'
    });

    MOCK_TRACK.save()
      .then(track => {
        return Playlist.add(MOCK_TRACK).then(ptrack => {
          tracks = tracks.concat(ptrack);
          if (count === 0) return cb(null, tracks);

          return Playlist.createFakeTracks(count - 1, tracks, cb);
        });
      })
      .catch(cb);

    return cb.promise;
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
      .then(prev =>
        playlistTrack.setIndex(prev).updateInfoFromPrev(prev).save()
      )
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
    Player.currentTrackIndex()
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
        include: ['track'],
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

  Playlist.checkIndex = function(cb) {
    cb = cb || createPromiseCallback();

    let Player = Playlist.app.models.Player;

    let promises = [Playlist.find({}), Player.playlist()];

    Promise.all(promises)
      .then(res => {
        let [playlist, mpdPlaylist] = res;
        log('check index', mpdPlaylist, playlist);

        if (playlist.length !== Object.keys(mpdPlaylist).length) {
          return Promise.reject(new Error("playlist don't match"));
        }
        let allMatch = playlist.every(
          track => mpdPlaylist[track.index] === track.name
        );

        if (!allMatch) {
          return Promise.reject(new Error('playlist have wrong index'));
        }

        return cb(null, true);
      })
      .catch(cb);

    return cb.promise;
  };

  Playlist.remoteMethod('checkIndex', {
    http: {
      verb: 'get'
    },
    returns: {
      arg: 'match',
      type: 'boolean'
    }
  });

  Playlist.resetPlaylist = function(mpdPlaylist, cb) {
    cb = cb || createPromiseCallback();

    const Track = Playlist.app.models.Track;
    const trackNames = [];

    for (let key in mpdPlaylist) {
      trackNames.push(mpdPlaylist[key]);
    }
    Playlist.destroyAll({}, { skip: true })
      .then(() => {
        return Track.find({
          where: {
            name: {
              inq: trackNames
            }
          }
        });
      })
      .then(tracks => {
        let mpdTracks = _.values(mpdPlaylist);
        let sorted = [];
        tracks.forEach(track => {
          let index = mpdTracks.indexOf(track.name);
          sorted[index] = track;
        });

        return sorted;
      })
      .mapSeries(track => Playlist.add(track))
      .then(tracks => cb(null, tracks))
      .catch(cb);

    return cb.promise;
  };

  Playlist.resetPlaylistRemote = function(cb) {
    cb = cb || createPromiseCallback();

    const Player = Playlist.app.models.Player;

    Player.playlist()
      .then(mpdPlaylist => {
        return Playlist.resetPlaylist(mpdPlaylist);
      })
      .then(ptracks => cb(null, ptracks))
      .catch(cb);

    return cb.promise;
  };

  Playlist.remoteMethod('resetPlaylistRemote', {
    http: {
      verb: 'get'
    },
    returns: {
      arg: 'tracks',
      type: 'array',
      root: true
    }
  });

  const setOrder = (ptracks, status) => {
    let startTime;

    switch (status.state) {
      case 'play':
        startTime = Playlist.addSecond(new Date(), -status.elapsed);
        break;
      default:
        startTime = new Date();
    }
    console.log('status', status.song);
    let orderedPlaylsit = [
      ...ptracks.slice(status.song || 0),
      ...ptracks.slice(0, status.song || 0)
    ];

    orderedPlaylsit.reduce(
      (prev, track) => {
        if (prev.endTime !== track.startTime) track.setTime(prev);
        if (prev.order !== track.order - 1) track.setOrder(prev);
        return track;
      },
      {
        endTime: startTime,
        order: -1
      }
    );

    return ptracks;
  };

  Playlist.updatePlaylist = function(inputStatus, cb) {
    // TODO check before update
    console.log('Updating time!'.green, inputStatus);

    cb = cb || createPromiseCallback();
    let Player = Playlist.app.models.Player;

    let getStatus = inputStatus ?
      Promise.resolve(inputStatus) :
      Player.getStatus();

    Player.playlist()
      .then(mpdPlaylist => {
        return Promise.all([Playlist.resetPlaylist(mpdPlaylist), getStatus]);
      })
      .then(res => {
        let [tracks, status = inputStatus] = res;
        if (!tracks.length) return Promise.reject('Playlist empty!');
        let ordered = setOrder(tracks, status);
        return ordered;
      })
      .map(track => track.save())
      .then(tracks => cb(null, _.sortBy(tracks, 'order')))
      .catch(cb);

    return cb.promise;
  };

  Playlist.remoteMethod('updatePlaylist', {
    accepts: {
      arg: 'status',
      type: 'object'
    },
    returns: {
      arg: 'tracks',
      type: 'array',
      root: true
    }
  });

  Playlist.moveTrack = function(fromIndex, toIndex, cb) {
    cb = cb || createPromiseCallback();
    const Player = Playlist.app.models.Player;
    Player.moveTrack(fromIndex, toIndex).then(() => {
      return Playlist.updatePlaylist();
    }).then(tracks => cb(null, tracks))
    .catch(cb);

    return cb.promise;
  };

  Playlist.remoteMethod('moveTrack', {
    accepts: [{
      arg: 'fromIndex',
      type: 'number'
    }, {
      arg: 'toIndex',
      type: 'number'
    }],
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

  Playlist.observe('before delete', (ctx, next) => {
    if (ctx.options.skip) return next();
    console.log('before delete', ctx.where);
    let Player = ctx.Model.app.models.Player;
    Playlist.find({
      where: ctx.where
    })
      .then(ptracks => {
        if (!ptracks.length) return next('Track not in playlist');
        return Promise.all(
          ptracks.map(ptrack => Player.deleteTrack(ptrack.index))
        );
      })
      .then(res => {
        next();
      })
      .catch(next);
  });

  Playlist.observe('after delete', (ctx, next) => {
    if (ctx.options.skip) return next();
    console.log('after delete');
    Playlist.updatePlaylist(null, next);
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

  Playlist.play = function(index, cb) {
    if (typeof index === 'function') {
      cb = index;
      index = null;
    }

    const Player = Playlist.app.models.Player;

    const plaingTrack = index ?
      Playlist.findOne({
        where: { index }
      }) :
      Player.getStatus().then(status => {
        return Playlist.findOne({
          where: { index: status.song }
        });
      });

    cb = cb || createPromiseCallback();

    plaingTrack
      .then(track => {
        if (!track) {
          return Promise.reject(new Error('No track with index ' + index));
        }
        return track.play();
      })
      .then(() => {
        return Playlist.updatePlaylist();
      })
      .then(tracks => {
        log('Playlist.play | playing', tracks[0]);
        return cb(null, tracks[0]);
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
      type: 'object',
      root: true
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
    console.log('>>> Next track in: '.cyan, endTime);
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
