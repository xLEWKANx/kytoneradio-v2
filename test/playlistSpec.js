/* eslint-env jasmine, node */
const tk = require('timekeeper')
const expect = require('chai').expect;
const sinon = require('sinon');

describe("Playlist test", () => {
  let Promise = require("bluebird");
  let moment = require("moment");
  let app = require("../server/server");
  let Playlist = app.models.Playlist;
  let Player = app.models.Player;

  global.Promise = Promise;

  let db = app.loopback.createDataSource("db", { connector: "memory" });

  Playlist.attachTo(db);

  let playlist;

  let simplifyTime = function(date) {
    return moment(Date.parse(date)).format("YYYY-MM-DD HH-mm");
  };

  before(done => {
    Playlist.destroyAll({}, done);
  });

  it("it should calculate playlist time from prev", done => {
    Playlist.createFakeTracks(5, undefined, (err, tracks) => {
      expect(err).to.be.equal(null);
      playlist = tracks;
      console.log("created tracks", tracks);

      tracks.reduce((prev, current) => {
        expect(simplifyTime(prev.endTime)).to.be.equal(
          simplifyTime(current.startTime)
        );
        return current;
      });
      done();
    });
  });

  it("should properly add seconds to Date", () => {
    let startTime = moment("12-00", "HH-mm").toDate();
    let endTime = Playlist.addSecond(startTime, 30 * 60);
    expect(moment(endTime).format("HH-mm")).to.be.equal("12-30");
  });

  it("should add listener to next track", function(done){
    let spy = sinon.spy();
    Playlist.on("playing", spy);
    tk.travel(playlist[0].endTime)
    
    this.timeout(Date.now - playlist[0].endTime.getTime());
    playlist[0].playPromised().then(track => {
      expect(Playlist.info.current).to.be.equal(playlist[0]);

      spy.calledWith(playlist[0]);
      spy.calledWith(playlist[1]);
      // done();
    });
 
  });

});
