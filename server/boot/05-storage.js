const Promise = require('bluebird');

module.exports = function(app) {
  if (process.env.ENV === 'codegen') return;

  Promise.promisifyAll(app.models.musicStorage, { suffix: 'Promised' });
  let dataSource = app.dataSources.db;

  dataSource.isActual((err, actual) => {
    console.log(`check datasource: ${err}, \n is Actual: ${actual}`);

    dataSource.autoupdate((err, result) => {
      console.log(`autoupdate ${err}, ${result}`);
    });
  });
};
