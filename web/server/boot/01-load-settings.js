'use strict'
import { default as debug } from 'debug'

// to enable these logs set `DEBUG=boot:01-load-settings` or `DEBUG=boot:*`
const log = debug('boot:01-load-settings')

module.exports = function (app) {
  // Do not run if we are in codegen mode.
  if (process.env.ENV === 'codegen') return

  const Setting = app.models.Setting

  function loadDefaultSettings() {
    console.error('Creating default settings')

    const settings = [{
      type: 'string',
      key: 'appName',
      value: 'LoopBack Admin',
    }, {
      type: 'select',
      key: 'appTheme',
      value: 'skin-blue',
      options: [
        'skin-blue',
        'skin-black',
      ],
    }, {
      type: 'select',
      key: 'appLayout',
      value: 'fixed',
      options: [
        'skin-blue',
        'not-fixed',
      ],
    }, {
      id: 1,
      key: 'sliders',
      value: 'fixed',
      options: [{
        outerIndex: 0,
        autoplay: true,
        speed: 800,
        isBig: false,
        pauseOnHove: true,
        rtl: false,
        playerPlaceShow: true
      }, {
        outerIndex: 1,
        autoplay: true,
        speed: 800,
        isBig: true,
        pauseOnHove: true,
        rtl: false,
        playerPlaceShow: false
      }, {
        outerIndex: 2,
        autoplay: true,
        speed: 800,
        isBig: false,
        pauseOnHove: true,
        rtl: false,
        playerPlaceShow: true
      }]
    }]

    settings.forEach((setting) => {
      Setting.create(setting, (err) => {
        if (err) {
          console.error(err)
        }
      })
    })
  }

  function loadExistingSettings() {
    console.error('Loading existing settings')
    Setting.find((data) => log(data))
  }

  Setting.count((err, result) => {
    if (err) {
      console.error(err)
    }
    if (result < 1) {
      loadDefaultSettings()
    } else {
      loadExistingSettings()
    }
  })

}
