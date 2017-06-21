const pug = require('pug');
const path = require('path');
const moment = require('moment');

const viewsDir = '../../src/client/views/';

module.exports = function(server) {
  // Install a `/` route that returns server status
  const router = server.loopback.Router();

  router.get('/', (req, res, next) => {
    let homePath = path.join(__dirname, viewsDir, 'index.pug');
    let rendererFn = pug.compileFile(homePath);

    let time = moment().format('HH:mm');
    let timezone = moment().format('Z').charAt(2);

    let html = rendererFn({
      title: 'kytoneradio',
      timenow: `${time} KYIV (+${timezone} GMT)`,
      brands: []
    });
    res.writeHeader(200, {
      'Content-Type': 'text/html'
    });
    res.write(html);
    res.end();

    next();
  });

  router.get('/views/:page', (req, res, next) => {
    let homePath = path.join(__dirname, viewsDir, `${req.params.page}.pug`);
    let rendererFn = pug.compileFile(homePath);

    res.write(rendererFn({}));
    res.end();
    next();
  });
  server.use(router);
};
