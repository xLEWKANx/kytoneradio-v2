/* eslint-env jasmine, node */

describe('Playlist test', () => {

  let Promise = require('bluebird')
  let moment = require('moment')
  let app = require('../../server/server')
  let Playlist = app.models.Playlist
  let Player = app.models.Player

  global.Promise = Promise

  let db = app.loopback.createDataSource('db', { connector: 'memory' })

  Playlist.attachTo(db)

  // Player.getStatus = function (cb) {
  //   cb(null, {
      
  //   })
  // }

  let playlist;

  let simplifyTime = function (date) {
    return moment(Date.parse(date)).format("YYYY-MM-DD HH-mm")
  }

  beforeAll((done) => {
    Playlist.destroyAll({}, done)
  })

  it('it should calculate playlist time from prev', (done) => {
    Playlist.createFakeTracks(5, undefined, (err, tracks) => {
      expect(err).toBe(null)
      playlist = tracks;

      tracks.reduce((prev, current) => {
        expect(simplifyTime(prev.endTime)).toBe(simplifyTime(current.startTime))
        return current;
      })
      done();
    })
  })

   it('should properly add seconds to Date', () => {
    let startTime = moment("12-00", "HH-mm").toDate()
    let endTime = Playlist.addSecond(startTime, 30 * 60)
    expect(moment(endTime).format("HH-mm")).toBe("12-30")
  })

  beforeEach(() => {
    jasmine.clock().install();
  })
    
  it('should add listener to next track', (done) => {
    
    playlist[0].playPromised().then((track) => {
      
      expect(Playlist.info.current).toEqual(playlist[0]);
      
      jasmine.clock().tick(playlist[0].endTime + 1);
    }) 

    Playlist.on("playling", (track) => {

      done()
      expect(Playlist.info.current).toEqual(playlist[1]);
    })

    
  })

  afterEach(() => {
    jasmine.clock().uninstall();
  })

})
