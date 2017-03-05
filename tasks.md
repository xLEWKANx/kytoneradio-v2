# Loopback migration
- [x] setup icecast and liquidsoap
- [x] setup angular-admin
- [x] posters api
- [ ] playlist api
- [ ] event api
- [ ] user api
- [ ] client migration

___

### setup icecast and liquidsoap
### setup angular-admin
  1. grunt file (autoreload, nodemon, lb-gen) ✓
  2. mongodb local
  3. loopback config (config, datasources, middleware,) ✓
  4. eshint ✓
  5. fork admin-ui ✓

___
### posters api
  1. model ✓
  2. test data ✓
  3. admin edit with formly (sort by outerIndex)

___  
### playlist api  (media player module?)
  1. track model
  2. playlist model (day, night, etc)
  3. schedule model
  3. meta services (time, daytime)
  4. m3u constructor (from playlist model)
  5. telnet client
  7. playlist api
  8. schedule api (socket.io)
  6. admin integration (scan, sort, save, reload)

___
### event api
### user api
  1. user model
  2. basic auth

### client migration
  1. loopback static middleware for kytone client
  2. change api for client
  3. add ng-cloack (loading screen)
  4. add seo info
