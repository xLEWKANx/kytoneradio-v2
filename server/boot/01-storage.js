'use strict'
const path = require('path')
const Promise = require('bluebird')
const debug = require('debug')

const log = debug('boot:player')


const STORAGE_PATH = process.env.STORAGE_PATH || path.resolve('../storage')

module.exports = function (app) {
  if (process.env.ENV === 'codegen') return

  app.set('STORAGE_PATH', STORAGE_PATH)

  Promise.promisifyAll(app.models.musicStorage, { suffix: 'Promised' });
  let dataSource = app.dataSources.db

  dataSource.isActual((err, actual) => {
    console.log(`check datasource: ${err}, \n is Actual: ${actual}`)

    dataSource.autoupdate((err, result) => {
      console.log(`autoupdate ${err}, ${result}`)
    });
  });

}
