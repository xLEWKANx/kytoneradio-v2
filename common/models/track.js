const Promise = require('bluebird');
const _ = require('underscore');
const mm = require('musicmetadata');
const fs = require('fs');
const path = require('path');
const debug = require('debug');

const log = debug('player:Track');
const MUSIC_EXTENTION_REGEXP = /.mp3$/;

module.exports = function(Track) {
  Track.createFakeData = function(faker, count) {
    let name = `track # - ${count}.mp3`;
    return Track.create({
      name: name,
      duration: Math.floor(Math.random() * 200),
      path: `storage/${name}`
    });
  };

  Track.prototype.getMeta = function(cb) {
    let readStream = fs.createReadStream(this.path);
    log('getting meta for', this);
    mm(readStream, { duration: true }, (err, meta) => {
      let artist = meta.artist[0] || null;
      let title = meta.title || null;
      let songtitle = '';
      if (artist && title) songtitle += artist + ' - ' + title;
      else songtitle = this.title;
      let info = err ?
      {
        err: err.toString(),
        processed: false
      } :
      {
        duration: meta.duration,
        title: songtitle,
        processed: true
      };
      Object.assign(this, info);
      log(`Track | Added meta to ${this.name}`);
      readStream.close();
      return Track.destroyAll({ name: this.name })
        .then(() => cb(null, info))
        .catch(cb);
    });
  };

  Track.remoteMethod('getMeta', {
    isStatic: false
  });

  Track.observe('before save', (ctx, next) => {
    if (ctx.options.skip) return next();
    log('before save | ctx', _.keys(ctx));

    if (ctx.instance && !ctx.instance.processed) {
      ctx.instance.getMeta(next);
    } else {
      next();
    }
  });

  Track.beforeRemote('deleteById', (ctx, instance, next) => {
    if (ctx.options.skip) return next();
    log('after remote | ctx', _.keys(ctx));
    let Storage = Track.app.models.musicStorage;
    let id = ctx.args.id;
    Track.findById(id, {
      include: ['playlist']
    })
      .then(track => {
        log('track to delete', track);
        let length;
        if (track.playlist()) {
          length = track.playlist().length;
        } else {
          return next();
        }
        if (length)
          return Promise.reject(
            next(new Error(`${length} tracks in playlist, delete first`))
          );
        else return track;
      })
      .then(track => {
        return Storage.removeFilePromised('music', track.name);
      })
      .then(() => next())
      .catch(next);
  });

  Track.scanDir = function(cb) {
    let app = Track.app;
    let musicStorage = app.models.musicStorage;
    let Player = app.models.Player;

    musicStorage
      .getFilesPromised('music')
      .filter(filterOnlyMusic)
      .then(files => {
        let filenames = files.map(file => file.name);

        return Track.find({
          where: {
            name: {
              inq: filenames
            },
            processed: true
          }
        }).then(processed => {
          log('processed', processed);
          let filtered = filterProcessed(processed, files);
          return filtered;
        });
      })
      .map(file => {
        let track = fileToTrack(file);
        return Track.createPromised(track);
      })
      .then(files => {
        return Player.updateDatabasePromised().then(msg => {
          console.log(msg);
          return files;
        });
      })
      .then(res => cb(null, res))
      .catch(err => cb(err));

    function fileToTrack(file) {
      let trackPath = `${app.get('storagePath')}/music/${file.name}`;

      return {
        name: file.name,
        title: file.name.replace(MUSIC_EXTENTION_REGEXP, ''),
        path: trackPath,
        container: file.container,
        processed: false
      };
    }

    function filterOnlyMusic(file, tracks) {
      if (!MUSIC_EXTENTION_REGEXP.test(file.name)) return false;
      else return true;
    }

    function filterProcessed(processed, files) {
      return files.filter(file => {
        return !processed.some(pFile => {
          return pFile.name === file.name;
        });
      });
    }
  };

  Track.prototype.addToPlaylist = function(cb) {
    let Player = Track.app.models.Player;

    this.playlist
      .create({
        name: this.name,
        duration: this.duration
      })
      .then(playlistTrack => {
        return Player.addTrackPromised(this.name).then(() => playlistTrack);
      })
      .then(playlistTrack => cb(null, playlistTrack))
      .catch(cb);
  };

  Promise.promisifyAll(Track, { suffix: 'Promised' });
  Promise.promisifyAll(Track.prototype, { suffix: 'Promised' });
};
