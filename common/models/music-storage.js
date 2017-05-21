const Promise = require('bluebird');

module.exports = function(Model) {
  Promise.promisifyAll(Model, { suffix: 'Promised' });
};
