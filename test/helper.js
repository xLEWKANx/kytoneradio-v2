/* eslint-env jasmine, node */

const EventEmitter = require('events');
const Promise = require('bluebird');

global.Promise = Promise;

before((next) => {
  const app = require('../server/server')
  let Player = app.models.Player
  let Playlist = app.models.Playlist
  let Track = app.models.Track

  app.io = new EventEmitter;

  let db = app.loopback.createDataSource('db', { connector: 'memory' })

  Track.attachTo(db)
  Playlist.attachTo(db)  
  Player.attachTo(db)

  class MpdMock {
    connect() {
      let client = new Client();
      process.nextTick(() => {
        client.emit('ready', client);
      })
      return client;
    }
  }

  class Client extends EventEmitter {
    sendCommand(args, cb) {
      return cb(null, null);
    }
  }


  Player.bootstrap(new MpdMock, (err) => {
    console.log('bootstrap error', err);
    next()
  })
})
