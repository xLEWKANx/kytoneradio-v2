'use strict'
import angular from 'angular'

function UserService ($state, CoreService, User, gettextCatalog) {

  this.find = () => User.find().$promise

  this.findById = (id) => User.findById({ id }).$promise

  this.upsert = (user) => User.upsert(user).$promise
    .then(() => CoreService.toastSuccess(
      gettextCatalog.getString('User saved'),
      gettextCatalog.getString('Your user is safe with us!')
      )
    )
    .catch((err) => CoreService.toastError(
      gettextCatalog.getString('Error saving user '),
      gettextCatalog.getString(`This user could no be saved: ${err}`)
      )
    )

  this.delete = (id, successCb, cancelCb) => CoreService.confirm(
    gettextCatalog.getString('Are you sure?'),
    gettextCatalog.getString('Deleting this cannot be undone'),
    () => User.deleteById({ id: id },
      () => {
        CoreService.toastSuccess(
          gettextCatalog.getString('User deleted'),
          gettextCatalog.getString('Your user is deleted!'))
        successCb()
      },
      (err) => {
        CoreService.toastError(
          gettextCatalog.getString('Error deleting user'),
          gettextCatalog.getString(`Your user is not deleted! ${err}`))
        cancelCb()
      }),
    () => cancelCb()
  )

  this.getFormFields = (formType) => {
    const form = [ {
      key: 'username',
      type: 'input',
      templateOptions: {
        label: gettextCatalog.getString('Username'),
        required: true,
      },
    }, {
      key: 'email',
      type: 'input',
      templateOptions: {
        label: gettextCatalog.getString('Email'),
        required: true,
      },
    }, {
      key: 'firstName',
      type: 'input',
      templateOptions: {
        label: gettextCatalog.getString('First name'),
        required: true,
      },
    }, {
      key: 'lastName',
      type: 'input',
      templateOptions: {
        label: gettextCatalog.getString('Last name'),
        required: true,
      },
    } ]
    if (formType === 'add') {
      form.push({
        key: 'password',
        type: 'input',
        templateOptions: {
          label: gettextCatalog.getString('Password'),
          required: true,
        },
      })
    }
    return form
  }

}

angular
  .module('com.module.users.services.user', [])
  .service('UserService', UserService)
