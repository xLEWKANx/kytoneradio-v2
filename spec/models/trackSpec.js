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

  it('should properly add seconds to Date', () => {
    let startTime = moment("12-00", "HH-mm").toDate()
    let endTime = Playlist.addSecond(startTime, 30 * 60)
    expect(moment(endTime).format("HH-mm")).toBe("12-30")
  })
  // it('should set startTime and endTime of track by previous', (done) => {

  //   MOCK_PLAYLIST_TRACK.setTimeFromPrevPromised()
  //     .then((playlistTrack) => {
  //       expect(simplifyTime(playlistTrack.startTime)).toBe(simplifyTime(TRACK_START))
  //       expect(simplifyTime(playlistTrack.endTime)).toBe(simplifyTime(TRACK_END))
  //       playlistTrack.track(MOCK_TRACK)
  //       return Playlist.createPromised(playlistTrack)
  //         .then((playlistTrack) => {
  //           return playlistTrack.setTimeFromPrevPromised()
  //         })
  //     })
  //     .then((playlistTrack) => {
  //       let endTime = Playlist.addSecond(TRACK_END, playlistTrack.track().duration).toString()
  //       console.log('track end', endTime)
  //       expect(simplifyTime(playlistTrack.startTime)).toBe(simplifyTime(TRACK_END))
  //       expect(simplifyTime(playlistTrack.endTime)).toBe(simplifyTime(endTime))
  //     })
  //     .catch((err) => {
  //       console.log(err)
  //       expect(err).toBe(null)
  //     })
  //     .finally(() => {
  //       done()
  //     })
  // })
  beforeEach(() => {

    jasmine.clock().install();
  })
  it('should add listener to next track', () => {
    let playlist = Playlist.createFakeTracks(5);
    playlist[0].play()
    jasmine.clock().tick(playlist[0].endTime);
  })

  afterEach(() => {
    jasmine.clock().uninstall();
  })

})
