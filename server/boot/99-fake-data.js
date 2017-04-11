"use strict";
const debug = require("debug");
const Promise = require("bluebird");
const faker = require("faker");

const log = debug("boot:99-fake.data");

module.exports = function(app) {
  // Do not run if we are in codegen mode.
  if (process.env.ENV === "codegen") return;

  if (app.dataSources.db.name !== "Memory" && !process.env.INITDB) {
    return;
  }

  const promises = [];

  const structure = {
    Slide: {
      count: 30
    }
  };

  if (app.dataSources.db.connected) {
    createFakeData();
  } else {
    app.dataSources.db.once("connected", createFakeData);
  }

  function createFakeData() {
    for (let model in structure) {
      app.models[model].count((err, count) => {
        console.log(model, count);
        if (count || err) return;
        const options = structure[model];
        log("Creating %s items for model %s", options.count, model);
        for (let i = 0; i < options.count; i++) {
          promises.push(app.models[model].createFakeData(faker, i));
        }
      });
    }
  }

  Promise.all(promises)
    .then(() => {
      log("Creating fake data done!");
    })
    .catch();
};
