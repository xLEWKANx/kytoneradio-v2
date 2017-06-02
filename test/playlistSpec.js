/* eslint-env jasmine, node */
const tk = require('timekeeper');
const chai = require('chai');
const expect = chai.expect;
chai.use(require('chai-datetime'));
const sinon = require('sinon');

describe('Playlist test', () => {
  let Promise = require('bluebird');
  let moment = require('moment');
  let app = require('../server/server');
  let Playlist = app.models.Playlist;
  let Player = app.models.Player;

  let clock;

  global.Promise = Promise;

  let db = app.loopback.createDataSource('db', { connector: 'memory' });

  Playlist.attachTo(db);

  let playlist;

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
  });

  it('should properly add seconds to Date', () => {
    let startTime = moment('12-00', 'HH-mm').toDate();
    let endTime = Playlist.addSecond(startTime, 30 * 60);
    expect(moment(endTime).format('HH-mm')).to.be.equal('12-30');
  });

  it('should add listener to next track', done => {
    let spy = sinon.spy();

    let time;
    Playlist.on('playing', spy);
    clock = sinon.useFakeTimers();

    playlist[0].playPromised().then(track => {
      expect(Playlist.info.current).to.be.equal(playlist[0]);
      time = playlist[0].endTime.getTime() - Date.now();
      clock.tick(time);
    });

    setTimeout(() => {
      expect(spy.calledWith(playlist[0])).to.be.true;
      done();
    }, time);
  });

  it('track after play must go to end of queue', done => {
    playlist[0].moveToEnd((err, track) => {
      expect(track.index).to.be.equal(5);
      expect(track.startTime).to.be.equalDate(playlist[4].endTime);
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
        console.log('after delete', tracks);
        return Playlist.updateTimePromised();
      })
      .then(tracks => {
        console.log('after update', tracks);
        done();
      });
  });

  afterEach(done => {
    if (clock) clock.restore();
    Playlist.destroyAll(done);
  });
});
