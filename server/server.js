require('dotenv').config()

const loopback = require("loopback");
const boot = require("loopback-boot");
const bootstrap = require("./player/10-bootstrap-player");
const Promise = require('bluebird');

global.Promise = Promise;

// import socket from 'socket.io'
const app = (module.exports = loopback());

// start the web server
app.start = () =>
  app.listen(() => {
    app.emit("started");
    const baseUrl = app.get("url").replace(/\/$/, "");
    console.log("Web server listening at: %s", baseUrl);
    if (app.get("loopback-component-explorer")) {
      const explorerPath = app.get("loopback-component-explorer").mountPath;
      console.log("Browse your REST API at %s%s", baseUrl, explorerPath);
    }
  });

// Bootstrap the application, configure models, datasources and middleware.
// Sub-apps like REST API are mounted via boot scripts.
boot(app, {
  appRootDir: __dirname
}, err => {
  if (err) {
    throw err;
  }
  // start the server if `$ node server.js`
  if (require.main === module) {
    app.io = require("socket.io")(app.start());

    bootstrap(app, (err) => {

      if (err) throw err;
    })
    
    app.io.on("error", err => {
      console.error("SOCKET IO", err);
    });
  }
});
