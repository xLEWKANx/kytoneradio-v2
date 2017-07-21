/* eslint-env jasmine, node */
const tk = require('timekeeper');
const chai = require('chai');
const expect = chai.expect;
chai.use(require('chai-datetime'));
const sinon = require('sinon');
const EventEmitter = require('events');

describe('Player test', () => {
  let app = require('../server/server');
  let Player = app.models.Player;

  app.io = new EventEmitter();

  it('it should parse mpd playlist ', () => {
    let parsed = Player.parsePlaylist({
      '0:file': 'eee.mp3',
      '100:file': 'rock.mp3'
    });

    expect(parsed).to.be.deep.equal({
      '0': 'eee.mp3',
      '100': 'rock.mp3'
    });
  });
});
