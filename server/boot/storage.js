'use strict'
import path from 'path'
import Promise from 'bluebird'
import { default as debug } from 'debug'

const log = debug('boot:player')


const STORAGE_PATH = process.env.STORAGE_PATH || path.resolve('../storage')

module.exports = function (app) {

  // const ds = app.loopback.createDataSource({
  //   connector: require('loopback-component-storage'),
  //   provider: 'filesystem',
  //   root: path.join(__dirname, '../', '../', 'storage'),
  // })
  // const container = ds.createModel('container')

  app.set('STORAGE_PATH', STORAGE_PATH)

  Promise.promisifyAll(app.models.musicStorage, { suffix: 'Promised' });
  let dataSource = app.dataSources.db

  dataSource.isActual((err, actual) => {
    console.log(`check datasource: ${err}, \n is Actual: ${actual}`)

    dataSource.autoupdate((err, result) => {
      console.log(`autoupdate ${err}, ${result}`)
    });
  });

  app.models.Track.scanDir((err, result) => {
    if (err) return console.log(err)
    log('scanned at boot ', result.length)
  })
  // app.model(container)

}
