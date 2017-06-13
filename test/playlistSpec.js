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
      done();
    });
  });

  it('it should calculate playlist time from prev', done => {
    Playlist.destroyAll({})
      .then(() => {
        Playlist.createFakeTracks(4, undefined, (err, tracks) => {
          console.error(err);
          expect(err).to.be.equal(null);
          playlist = tracks;

          tracks.reduce((prev, current) => {
            expect(simplifyTime(prev.endTime)).to.be.equal(
              simplifyTime(current.startTime)
            );
            expect(prev.index).to.be.equal(current.index - 1);
            expect(prev.order).to.be.equal(current.order - 1);
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

  it('track after play must go to end of queue', done => {
    playlist[0].moveToEnd((err, track) => {
      console.log('err', err);
      expect(err).not.to.be.ok;
      expect(track.order).to.be.equal(5);
      expect(track.startTime).to.be.equalDate(playlist[4].endTime);
      done();
    });
  });

  it('should return playlist by playing order depents on order and index', done => {
    Player.currentTrackIndex = function(cb) {
      cb = cb || (() => Promise.resolve(2));
      return cb(null, 2);
    };

    playlist[0].moveToEnd().then(() => playlist[1].moveToEnd())
      .then(() => {
        return Playlist.tracksByOrder();
      }).then((playlist) => {
        expect(playlist[0].index).to.be.equal(2);
        done();
      })
      .catch((err) => expect(err).not.to.be.ok);
  });

  it('should update time for all tracks starts from playing', done => {
    playlist[1].startTime = new Date();
    playlist[1].endTime = new Date();

    playlist[2].index = 4;
    playlist[3].index = 5;
    playlist[3].index = 5;
    playlist[4].index = 6;
    playlist[4].order = 15;
    console.log('playlist before', playlist);
    Promise.all(playlist)
    .map((track) => track.save())
    .then(() => {
      return Playlist.find({}).then(pl => console.log(pl));
    }).then(() => {
      return Playlist.updatePlaylist({ elapsed: 120, state: 'play' });
    }).then(tracks => {
      let startTime = moment.utc().add(-120, 'second').format('HH:mm:ss');
      console.log('tracks', tracks);
      expect(tracks[0].simplifyTime().startTime).to.be.equal(startTime);
      tracks.reduce((prev, track, i) => {
        let prevS = prev.simplifyTime();
        let trackS = track.simplifyTime();
        expect(track.index).to.be.equal(i);
        expect(prevS.endTime).to.be.equal(trackS.startTime);
        return track;
      });
      done();
    }).catch(err => {
      console.log('error', err);
      expect(err).not.to.be.ok;
    });
  });

  it('should calculate time after delete tracks', done => {
    Playlist.deleteTracks([2, 3])
      .then(() => {
        return Playlist.find({});
      })
      .then(tracks => {
        console.log('tracks', tracks);
        expect(tracks.length).to.be.equal(3);
        expect(tracks[2].index).to.be.equal(2);
        done();
      });
  });

  // it('should add listener to next track', done => {
  //   let spy = sinon.spy(Playlist, 'play');
  //   var now =  Date.now();

  //   let time;

  //   clock = sinon.useFakeTimers(Date.now());
  //   Player.currentTrackIndex = function(cb) {
  //     cb = cb || (() => Promise.resolve(1));
  //     return cb(null, 0);
  //   };
  //   Playlist.play(0).then(track => {
  //     Player.currentTrackIndex = function(cb) {
  //       cb = cb || (() => Promise.resolve(1));
  //       return cb(null, 1);
  //     };
  //     Player.getStatus = function(cb) {
  //       cb = cb || ((err, res) => Promise.resolve(res));

  //       return cb(null, { elapsed: 0, song: 1 });
  //     };
  //     time = playlist[0].endTime.getTime();
  //     console.log('time', time, moment.utc(time).format('HH:mm:ss'));
  //     clock.tick(time);
  //   });
  //   setTimeout(() => {
  //     process.nextTick(() => {
  //       expect(spy.calledOnce).to.be.true;
  //       done();
  //     });
  //   }, time);
  // });

  afterEach(done => {
    if (clock) clock.restore();
    Playlist.destroyAll({}).then((info) => {
      done();
    });
  });
});
