/* eslint-env jasmine, node */
const tk = require('timekeeper');
const chai = require('chai');
const expect = chai.expect;
chai.use(require('chai-datetime'));
const sinon = require('sinon');
const EventEmitter = require('events');

describe('Playlist test', () => {
  let Promise = require('bluebird');
  let moment = require('moment');
  let app = require('../server/server');
  let Playlist = app.models.Playlist;
  let Player = app.models.Player;

  app.io = new EventEmitter();

  let clock, playlist;

  global.Promise = Promise;

  let db = app.loopback.createDataSource('db', { connector: 'memory' });

  Playlist.attachTo(db);

  Player.getStatus = function(cb) {
    cb = cb || ((err, res) => Promise.resolve(res));

    return cb(null, { elapsed: 0 });
  };

  let simplifyTime = function(date) {
    return moment(Date.parse(date)).format('YYYY-MM-DD HH-mm');
  };

  before(done => {
    Playlist.destroyAll({}, done);
  });

  beforeEach(done => {
    Playlist.createFakeTracks(4, undefined, (err, tracks) => {
      playlist = tracks;
      console.log('create tracks', tracks.length);
      done();
    });
  });

  it('it should calculate playlist time from prev', done => {
    Playlist.destroyAll({})
      .then(() => {
        Playlist.createFakeTracks(4, undefined, (err, tracks) => {
          expect(err).to.be.equal(null);
          playlist = tracks;

          tracks.reduce((prev, current) => {
            expect(simplifyTime(prev.endTime)).to.be.equal(
              simplifyTime(current.startTime)
            );
            return current;
          });
          done();
        });
      })
      .catch(done);
  });

  it('should properly add seconds to Date', () => {
    let startTime = moment('12-00', 'HH-mm').toDate();
    let endTime = Playlist.addSecond(startTime, 30 * 60);
    expect(moment(endTime).format('HH-mm')).to.be.equal('12-30');
  });

  it('should properly substracts seconds from Date', () => {
    let startTime = moment('12-00', 'HH-mm').toDate();
    let endTime = Playlist.addSecond(startTime, -30 * 60);
    expect(moment(endTime).format('HH-mm')).to.be.equal('11-30');
  });

  it('should return playlist by playing order depents on Player.status index', done => {
    Player.currentTrackIndex = function(cb) {
      cb = cb || (() => Promise.resolve(3));
      return cb(null, 3);
    };

    Playlist.tracksByOrder((err, playlist) => {
      if (err) done(err);
      expect(playlist[0].index).to.be.equal(3);
      done();
    });
  });

  it('should calculate time after delete tracks', done => {
    playlist[3]
      .destroy()
      .then(() => {
        return Playlist.find({});
      })
      .then(tracks => {
        return Playlist.updateTimePromised();
      })
      .then(tracks => {
        done();
      });
  });

  it('should update time for all tracks starts from playing', done => {
    Player.currentTrackIndex = function(cb) {
      cb = cb || (() => Promise.resolve(4));
      return cb(null, 4);
    };

    Player.getStatus = function(cb) {
      cb = cb || ((err, res) => Promise.resolve(res));

      return cb(null, { elapsed: 120 });
    };

    Playlist.updateTime().then(tracks => {
      let startTime = moment().add(-120, 'second').format('HH:mm:ss');
      expect(tracks[0].index).to.be.equal(4);
      expect(moment(tracks[0].startTime).format('HH:mm:ss')).to.be.equal(
        startTime
      );
      expect(moment(tracks[0].endTime).format('HH:mm:ss')).to.be.equal(
        moment(tracks[1].startTime).format('HH:mm:ss')
      );
      expect(moment(tracks[3].endTime).format('HH:mm:ss')).to.be.equal(
        moment(tracks[4].startTime).format('HH:mm:ss')
      );
      done();
    });
  });

  it('should add listener to next track', done => {
    let spy = sinon.spy(Playlist, 'play');
    var now =  Date.now();

    let time;

    clock = sinon.useFakeTimers(Date.now());
    Player.currentTrackIndex = function(cb) {
      cb = cb || (() => Promise.resolve(1));
      return cb(null, 0);
    };
    Playlist.play(0).then(track => {
      Player.currentTrackIndex = function(cb) {
        cb = cb || (() => Promise.resolve(1));
        return cb(null, 1);
      };
      Player.getStatus = function(cb) {
        cb = cb || ((err, res) => Promise.resolve(res));

        return cb(null, { elapsed: 0, song: 1 });
      };
      time = playlist[0].endTime.getTime();
      console.log('time', time, moment.utc(time).format('HH:mm:ss'));
      clock.tick(time);
    });
    setTimeout(() => {
      process.nextTick(() => {
        expect(spy.calledOnce).to.be.true;
        done();
      });
    }, time);
  });

  // it('track after play must go to end of queue', done => {
  //   playlist[0].moveToEnd((err, track) => {
  //     if (err) return done(err);
  //     expect(track.index).to.be.equal(5);
  //     expect(track.startTime).to.be.equalDate(playlist[4].endTime);
  //     done();
  //   });
  // });

  afterEach(done => {
    if (clock) clock.restore();
    Playlist.destroyAll({}).then((info) => {
      console.log('destroy all', info);
      done();
    });
  });
});
