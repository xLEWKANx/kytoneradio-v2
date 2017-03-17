'use strict'
const mpd = require('mpd')
const repl = require('repl');

global.Promise = Promise

let client = {};
let status = {
  isPlaying: false
}
let Repl = repl.start('> ');

client = mpd.connect({
  port: 6600,
  host: 'localhost',
})
client.on('error', (err) => {
  console.log(err)

})

client.on('ready', () => {
  console.log('connected')

  Repl.context.client = client;
  Repl.context.mpd = mpd;
  Repl.context.cb = cb;
})

function cb(err, msg) {
  if (err) console.error(err)
  console.log('messsage', msg)
  msg = mpd.parseKeyValueMessage(msg)
  console.log('parsed', msg)
}





