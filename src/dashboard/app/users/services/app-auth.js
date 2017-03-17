'use strict'
import angular from 'angular'

function AppAuth ($cookies, User, LoopBackAuth, $http) {
  const self = {
    login: (data, cb) => {
      LoopBackAuth.currentUserId = LoopBackAuth.accessTokenId = null
      $http.post('/api/users/login?include=user',
        {
          email: data.email,
          password: data.password,
        })
        .then((response) => {
          if (response.data && response.data.id) {
            LoopBackAuth.currentUserId = response.data.userId
            LoopBackAuth.accessTokenId = response.data.id
          }
          if (LoopBackAuth.currentUserId === null) {
            delete $cookies[ 'accessToken' ]
            LoopBackAuth.accessTokenId = null
          }
          LoopBackAuth.save()
          if (LoopBackAuth.currentUserId && response.data && response.data
              .user) {
            self.currentUser = response.data.user
            cb(self.currentUser)

          } else {
            cb({})
          }
        }, () => {
          console.log('User.login() err', arguments)
          LoopBackAuth.currentUserId = LoopBackAuth.accessTokenId = null
          LoopBackAuth.save()
          cb({})
        })
    },

    logout: (cb) => {
      // Destroy the access token.
      User.logout({ 'access_token': LoopBackAuth.accessTokenId },
        () => {
          // Destory both cookies that get created.
          delete $cookies[ 'access_token' ]
          delete $cookies[ 'accessToken' ]
          // Perform the Passport Logout
          $http.post('/auth/logout')
        })
      self.currentUser = null
      cb()
    },

    ensureHasCurrentUser: (cb) => {
      if ((!this.currentUser || this.currentUser.id === 'social') && $cookies.accessToken) {
        LoopBackAuth.currentUserId = LoopBackAuth.accessTokenId = null
        $http.get('/auth/current')
          .then((response) => {
            if (response.data.id) {
              LoopBackAuth.currentUserId = response.data.id
              LoopBackAuth.accessTokenId = $cookies.accessToken.substring(2, 66)
            }
            if (LoopBackAuth.currentUserId === null) {
              delete $cookies[ 'accessToken' ]
              LoopBackAuth.accessTokenId = null
            }
            LoopBackAuth.save()
            self.currentUser = response.data
            const profile = self.currentUser && self.currentUser.profiles &&
              self.currentUser.profiles.length && self.currentUser.profiles[ 0 ]
            if (profile) {
              self.currentUser.name = profile.profile.name
            }
            cb(self.currentUser)
          }, () => {
            console.log('User.getCurrent() err', arguments)
            LoopBackAuth.currentUserId = LoopBackAuth.accessTokenId =
              null
            LoopBackAuth.save()
            cb({})
          })
      } else {
        if (self.currentUser) {
          console.log('Using cached current user.')
        }
        cb(self.currentUser)
      }
    },
  }
  return self
}

angular
  .module('com.module.users.services.app-auth', [])
  .factory('AppAuth', AppAuth)
