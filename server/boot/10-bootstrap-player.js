'use strict'
import { default as debug } from 'debug'
import Promise from 'bluebird'

const log = debug('player:boot')

module.exports = function (app, next) {
  let Player = app.models['Player']
  let Playlist = app.models['Playlist']
  let Counter = app.models['Counter']

  Player.bootstrap((err, msg) => {
    if (err) next(err)
    Player.clearPromised()
      .then(() => {
        return Playlist.findPromised({
          where: {
            index: {
              gte: 0
            }
          },
          order: 'index ASC'
        })
      })
      .then((tracks) => {
        let promises = tracks.map((track) => Player.addTrackPromised(track.name))
        return Promise.all(promises).then(() => tracks)
      })
      .then((tracks) => {
        return Playlist.updateTimeAndIndexPromised(tracks, { startTime: new Date })
      })
      .then((tracks) => {
        log('tracks', tracks)
        if (tracks.length) tracks[0].play((err, res) => { console.log(err, res) });
        next()
      })
      .catch((err) => {
        console.error('Bootstrap mpd error:', err)
        next(err);
      })
  })

  app.on('inititated', () => {
    app.io.on('connection', () => {
      Playlist.getCurrentTrackPromised()
        .then((track) => {
          if (track) Playlist.app.io.emit('track', track.track());
        })

      Playlist.getSchedulePromised()
        .then((tracks) => {
          Playlist.app.io.emit('playlist', tracks);
        })
    })
  })
}
