/* eslint-env jasmine, node */

describe('Playlist test', () => {

  let Promise = require('bluebird')
  let moment = require('moment')
  let app = require('../../server/server')
  let Playlist = app.models.Playlist
  let Player = app.models.Player

  Player.addTrackPromised = function (name, cb) {
    return Promise.resolve()
  }

  global.Promise = Promise

  let db = app.loopback.createDataSource('db', { connector: 'memory' })

  Playlist.attachTo(db)

  let firstTrack, secondTrack, thirdTrack

   it('privet', () => {
    expect('privet').toBe('privet')
  })

})
