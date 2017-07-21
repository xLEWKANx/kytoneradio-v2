/* eslint-env jasmine, node */
const _ = require('lodash');
const chai = require('chai');
const expect = chai.expect;
chai.use(require('chai-datetime'));

describe('Track test', () => {
  let Promise = require('bluebird');
  let app = require('../server/server');
  let Playlist = app.models.Playlist;
  let Player = app.models.Player;
  let Track = app.models.Track;

  let db = app.loopback.createDataSource('db', { connector: 'memory' });

  Playlist.attachTo(db);
  Track.attachTo(db);
  let playlist, tracks;
  Player.getStatus = function(cb) {
    cb = cb || ((err, res) => Promise.resolve(res));

    return cb(null, { elapsed: 0 });
  };

  Player.deleteTrack = function(name, cb) {
    cb = cb || ((err, res) => Promise.resolve(res));

    return cb(null);
  };

  Player.addTrack = function(name, cb) {
    if (!cb) return Promise.resolve();
    return cb(null, true);
  };

  beforeEach(done => {
    Playlist.createFakeTracks(4, undefined, (err, ptracks) => {
      if (err) return done(err);
      playlist = ptracks;

      return Track.find({})
        .then(tr => {
          tracks = tr;
          return done();
        })
        .catch(done);
    });
  });

  it('Should add all tracks to playlist by track names', (done) => {
    Playlist.destroyAll({}, { skip: true }).then((info) => {
      let trackNames = tracks.map(track => track.name);
      Track.addAll(trackNames).then((ptracks) => {
        expect(ptracks[0]).to.be.an.instanceof(Playlist);
        return Playlist.find({});
      }).then((ptracks) => {
        expect(ptracks.length).to.be.equal(5);
        done();
      });
    }).catch(done);
  });
});
