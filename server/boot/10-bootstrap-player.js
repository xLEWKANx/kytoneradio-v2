const debug = require('debug');
const mpd = require('mpd');
const log = debug('player:boot');

module.exports = function(app, next) {
  if (process.env.ENV === 'codegen') return next();
  let Player = app.models.Player;
  let Playlist = app.models.Playlist;

  Player.bootstrap(mpd, (err, msg) => {
    debug('Player bootstrap run');
    if (err) return next();

    Playlist.play();
    return next();
  });
};
