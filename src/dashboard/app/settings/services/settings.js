'use strict'
import angular from 'angular'

function SettingService ($state, CoreService, Setting, gettextCatalog) {

  this.find = () => Setting.find().$promise

  this.findById = (id) => Setting.findById({ id }).$promise

  this.upsert = (setting) => Setting.upsert(setting).$promise
    .then(() => CoreService.toastSuccess(
      gettextCatalog.getString('Setting saved'),
      gettextCatalog.getString('Your setting is safe with us!')
    ))
    .catch((err) => CoreService.toastError(
      gettextCatalog.getString('Error saving setting '),
      gettextCatalog.getString(`This setting could no be saved: ${err}`)
      )
    )

  this.delete = (id, successCb, cancelCb) => {
    CoreService.confirm(
      gettextCatalog.getString('Are you sure?'),
      gettextCatalog.getString('Deleting this cannot be undone'),
      () => {
        Setting.deleteById({ id: id },
          () => {
            CoreService.toastSuccess(
              gettextCatalog.getString('Setting deleted'),
              gettextCatalog.getString('Your setting is deleted!'))
            successCb()
          },
          (err) => {
            CoreService.toastError(
              gettextCatalog.getString('Error deleting setting'),
              gettextCatalog.getString(`Your setting is not deleted! ${err}`))
            cancelCb()
          })
      },
      () => cancelCb()
    )
  }

  this.getFormFields = () => [ {
    key: 'key',
    type: 'input',
    templateOptions: {
      label: gettextCatalog.getString('Value'),
      required: true,
    },
  }, {
    key: 'value',
    type: 'input',
    templateOptions: {
      label: gettextCatalog.getString('Key'),
      required: true,
    },
  } ]

}

angular
  .module('com.module.settings.services.settings', [])
  .service('SettingService', SettingService)
