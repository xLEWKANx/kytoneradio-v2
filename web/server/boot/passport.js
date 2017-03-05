'use strict'

module.exports = function (app) {
  // Do not run if we are in codegen mode.
  if (process.env.ENV === 'codegen') return

  const bodyParser = require('body-parser')
  const loopback = require('loopback')

  // to support JSON-encoded bodies
  app.use(bodyParser.json())
  // to support URL-encoded bodies
  app.use(bodyParser.urlencoded({
    extended: true,
  }))

  // The access token is only available after boot
  app.use(app.loopback.token({
    model: app.models.accessToken,
  }))

  app.use(loopback.cookieParser(app.get('cookieSecret')))
  app.middleware('session', loopback.session({
    secret: app.get('cookieSecret'),
    saveUninitialized: true,
    resave: true,
  }))

  let config = false
  try {
    config = require('../../providers.json')
  } catch (err) {
    console.error(
      'Please configure your passport strategy in `providers.json`.')
    console.error(
      'Copy `providers.json.template` to `providers.json` and replace the clientID/clientSecret values with your own.'
    )
  }

  if (config) {
    console.log('Configuring passport')

    const AuthProvider = app.models.AuthProvider
    const loopbackPassport = require('loopback-component-passport')
    const PassportConfigurator = loopbackPassport.PassportConfigurator
    const passportConfigurator = new PassportConfigurator(app)

    // Initialize passport
    passportConfigurator.init()

    // Set up related models
    passportConfigurator.setupModels({
      userModel: app.models.user,
      userIdentityModel: app.models.userIdentity,
      userCredentialModel: app.models.userCredential,
    })

    // Configure passport strategies for third party auth providers and add them to the API
    AuthProvider.destroyAll()
    for (let s in config) {
      const c = config[s]

      if (c.provider !== 'local') {

        let providerClass = c.provider
        if (c.provider === 'google') {
          providerClass = 'google-plus'
        }

        const entry = {
          name: s,
          link: c.link,
          authPath: c.authPath,
          provider: c.provider,
          class: providerClass,
        }

        AuthProvider.create(entry, (err, data) => {
          if (err) {
            console.log(err)
          }
        })

        c.session = c.session !== false
        passportConfigurator.configureProvider(s, c)
      }
    }
  }

  const ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn

  app.get('/auth/account', ensureLoggedIn('/'), (req, res, next) => {
    console.log('Logged in', req.user)
    // Copy the cookie over for our AppAuth service that looks for accessToken cookie
    res.cookie('accessToken', req.signedCookies['access_token'], {signed: true})
    res.redirect('/#/app')
  })

  app.get('/auth/current', (req, res, next) => {
    if (!req.isAuthenticated || !req.isAuthenticated()) {
      return res.status(200).json({})
    }
    // poor man's copy
    const ret = JSON.parse(JSON.stringify(req.user))
    delete ret.password
    res.status(200).json(ret)
  })

  app.post('/auth/logout', (req, res, next) => {
    req.session.destroy(() => res.redirect('/'))
  })
}
