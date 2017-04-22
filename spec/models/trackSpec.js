/* eslint-env jasmine, node */

describe('Track test', () => {

  let Promise = require('bluebird')
  let moment = require('moment')
  let app = require('../../server/server')
  let Playlist = app.models.Playlist
  let Track = app.models.Track

  let db = app.loopback.createDataSource('db', { connector: 'memory' })

  Track.attachTo(db)
  Playlist.attachTo(db)

  const TRACK_DURATION = 2 * 60 * 60
  const TRACK_START = new Date()
  const TRACK_END = Playlist.addSecond(TRACK_START, TRACK_DURATION)

  const MOCK_TRACK = new Track({
    id: 0,
    name: 'test track',
    processed: true,
    duration: TRACK_DURATION
  })

  let MOCK_PLAYLIST_TRACK = new Playlist({
    id: 0,
    name: 'test playlist track',
    startTime: TRACK_START,
    endTime: TRACK_END,
    duration: TRACK_DURATION,
    trackId: 0,
    index: 0
  })
  MOCK_PLAYLIST_TRACK.track(MOCK_TRACK)

  let simplifyTime = function (date) {
    return moment(Date.parse(date)).format("YYYY-MM-DD HH-mm")
  }

 

})
