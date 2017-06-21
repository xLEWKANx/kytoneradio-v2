const debug = require('debug');
const mpd = require('mpd');
const log = debug('player:boot');

module.exports = function(app, next) {
  if (process.env.ENV === 'codegen') return next();
  let Player = app.models.Player;
  let Playlist = app.models.Playlist;

  Player.bootstrap(mpd, (err, msg) => {
    debug('Player bootstrap run');
    if (err) return next(err);

    Playlist.play();
    return next();
  });

  app.on('inititated', () => {
    app.io.on('connection', () => {
      Playlist.getCurrentTrackPromised().then(track => {
        if (track) Playlist.app.io.emit('track', track.track());
      });

      Playlist.getSchedulePromised().then(tracks => {
        Playlist.app.io.emit('playlist', tracks);
      });
    });
  });
};
