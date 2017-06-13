const mpd = require('mpd');
const debug = require('debug');

const createPromiseCallback = require('../../lib/utils').createPromiseCallback;
const request = require('request');
const log = debug('player:Player');

module.exports = function(Player) {
  let client = {};

  let state = {
    isPlaying: false
  };
  Player.on('error', err => {
    Player.log({
      error: err
    });
  });

  Player.bootstrap = function(mpd, cb) {
    client = mpd.connect({
      port: process.env.MPD_PORT || 6600,
      host: 'localhost'
    });
    client.on('error', err => {
      cb(err);
      console.error('Player | boostrap error:', err);
      Player.emit('error', err);
    });

    client.on('ready', () => {
      console.log('ready?');
      cb(null, client);
    });
  };

  Player.play = function(index, cb) {
    if (typeof index === 'function') {
      cb = index;
      index = undefined;
    }
    cb = cb || createPromiseCallback();

    let arg = index === undefined ? [] : [index];
    Player.getStatus().then(status => {
      if (status.state === 'play' && status.song == index) {
        return cb(null, status);
      } else {
        client.sendCommand(mpd.cmd('play', arg), (err, msg) => {
          if (err) return cb(err);
          Player.log({
            command: 'play'
          }).then((log) => Player.getStatus(cb));
        });
      }
    })
    .catch(cb);

    return cb.promise;
  };

  Player.remoteMethod('play', {
    accepts: {
      arg: 'index',
      type: 'number'
    },
    returns: {
      arg: 'message',
      type: 'string'
    }
  });

  Player.stop = function(cb) {
    client.sendCommand(mpd.cmd('stop', []), (err, msg) => {
      if (err) return cb(err);
      Player.emit('stop');
      state.isPlaying = false;
      Player.log(
        {
          command: 'stop'
        },
        cb
      );
    });
  };

  Player.remoteMethod('stop', {
    returns: {
      arg: 'message',
      type: 'string'
    }
  });

  Player.addTrack = function(name, cb) {
    console.log('add track', name);
    client.sendCommand(mpd.cmd('add', [name]), (err, msg) => {
      if (err) return cb(err);
      log(`Added ${name} to MPD playlist`, err, msg);
      Player.log(
        {
          command: 'play',
          messange: name
        },
        cb
      );
    });
  };

  Player.getCurrentPlaylist = function(cb) {
    client.sendCommand(mpd.cmd('playlistinfo', []), (err, msg) => {
      if (err) return cb(err);
      return cb(null, msg);
    });
  };

  Player.remoteMethod('getCurrentPlaylist', {
    returns: {
      arg: 'tracks',
      type: 'string'
    }
  });

  Player.clear = function(cb) {
    client.sendCommand(mpd.cmd('clear', []), (err, msg) => {
      if (err) return cb(err);
      Player.log(
        {
          command: 'clear'
        },
        cb
      );
    });
  };

  Player.remoteMethod('clear', {
    returns: {
      arg: 'message',
      type: 'string'
    }
  });

  Player.deleteTrack = function(position, cb) {
    client.sendCommand(mpd.cmd('delete', [position]), (err, msg) => {
      if (err) return cb(err);
      return cb(null, msg);
    });
  };

  Player.moveTrack = function(require, to, cb) {
    client.sendCommand(mpd.cmd('move', [require, to]), (err, msg) => {
      if (err) return cb(err);
      return cb(null, msg);
    });
  };

  Player.getStatus = function(cb) {
    cb = cb || createPromiseCallback();
    client.sendCommand(mpd.cmd('status', []), (err, msg) => {
      if (err) return cb(err);
      if (msg) msg = mpd.parseKeyValueMessage(msg);
      return cb(null, msg || {});
    });

    return cb.promise;
  };

  Player.remoteMethod('getStatus', {
    http: {
      verb: 'get'
    },
    returns: {
      arg: 'status',
      type: 'string'
    }
  });

  Player.currentTrackIndex = function(cb) {
    cb = cb || createPromiseCallback();

    Player.getStatus((err, status) => {
      if (err) return cb(err);
      return cb(null, status.song || 0);
    });

    return cb.promise;
  };

  Player.nextTrackIndex = function(cb) {
    Player.getStatus((err, status) => {
      if (err) return cb(err);
      // if (status.nextsong) cb("Player.nextTrackIndex | no next song");
      return cb(null, status.nextsong);
    });
  };

  Player.updateDatabase = function(cb) {
    client.sendCommand(mpd.cmd('update', []), (err, msg) => {
      if (err) return cb(err);
      log('database updated', msg);
      return cb(null, msg);
    });
  };

  Player.log = function(info, cb) {
    cb = cb || createPromiseCallback();

    let getStatus = info.status ?
      () => Promise.resolve(info.status) :
      Player.getStatus;

    getStatus()
      .then(status => {
        let log = Object.assign(
          {
            timestamp: new Date(),
            status
          },
          info
        );
        return Player.create(log, cb);
      })
      .catch(cb);

    return cb.promise;
  };

  Player.stream = function(req, res, cb) {
    let stream = request('http://localhost:15001/stream')
      .on('error', err => {
        return cb('Stream is no avalible');
      })
      .on('response', () => {
        return cb(null, stream, 'application/octet-stream');
      });

    req.on('close', () => {
      stream.abort();
    });
  };

  Player.remoteMethod('stream', {
    http: {
      verb: 'get'
    },
    accepts: [
      { arg: 'req', type: 'object', http: { source: 'req' } },
      { arg: 'req', type: 'object', http: { source: 'res' } }
    ],
    returns: [
      { arg: 'body', type: 'file', root: true },
      { arg: 'Content-Type', type: 'string', http: { target: 'header' } }
    ]
  });

  Promise.promisifyAll(Player, { suffix: 'Promised' });
};
