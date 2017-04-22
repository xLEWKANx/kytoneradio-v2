/* eslint-env jasmine, node */

const app = require('../../../server/server')
const EventEmitter = require('events');


beforeAll((next) => {
  console.log('before all');
  let Player = app.models.Player
  let Playlist = app.models.Playlist
  let Track = app.models.Track

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
      return cb(null, true);
    }
  }


  Player.bootstrap(new MpdMock, (err) => {
    console.log('bootstrap error', err);
    next()
  })
})
