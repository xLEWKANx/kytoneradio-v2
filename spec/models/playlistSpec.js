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

  let simplifyTime = function (date) {
    return moment(Date.parse(date)).format("YYYY-MM-DD HH-mm")
  }

  beforeAll((done) => {
    Playlist.destroyAll({}, done)
  })

  it('privet', (done) => {
    Playlist.createFakeTracks(5, undefined, (err, tracks) => {
      expect(err).toBe(null)

      tracks.reduce((prev, current) => {
        expect(simplifyTime(prev.endTime)).toBe(simplifyTime(current.startTime))
        return current;
      })
      done();
    })
  })

})
