'use strict'
import angular from 'angular'

function PlayerService (CoreService, Player, gettextCatalog) {

  this.getPlayer = () => Player

  this.play = (Player) => Player.play().$promise
    .then(() => CoreService.toastInfo(
      gettextCatalog.getString('Broadcast started')
      )
    )
    .catch((err) => CoreService.toastSuccess(
      gettextCatalog.getString('Error playing broadcast'),
      gettextCatalog.getString(err)
      )
    )

  this.stop = (Player) => Player.stop().$promise
    .then(() => CoreService.toastWarning(
      gettextCatalog.getString('Broadcast stoped')
      )
    )
    .catch((err) => CoreService.toastError(
      gettextCatalog.getString('Error playing broadcast'),
      gettextCatalog.getString(err)
      )
    )

  this.deletePlayer = (id, successCb, cancelCb) => {
    CoreService.confirm(
      gettextCatalog.getString('Are you sure?'),
      gettextCatalog.getString('Deleting this cannot be undone'),
      () => {
        Player.deleteById({ id: id },
          () => {
            CoreService.toastSuccess(
              gettextCatalog.getString('Player deleted'),
              gettextCatalog.getString('Your Player is deleted!'))
            successCb()
          }, (err) => {
            CoreService.toastError(
              gettextCatalog.getString('Error deleting Player'),
              gettextCatalog.getString(`Your Player is not deleted! ${err}`))
            cancelCb()
          })
      },
      () => cancelCb()
    )
  }

  this.getFormFields = () => [ {
    key: 'content',
    type: 'textarea',
    templateOptions: {
      label: gettextCatalog.getString('Content'),
      required: true,
    },
    ngModelElAttrs: {
      rows: '10'
    }
  }, {
    key: 'pictureUrl',
    type: 'input',
    templateOptions: {
      label: gettextCatalog.getString('Image'),
    },
  }, {
    key: 'outerUrl',
    type: 'input',
    templateOptions: {
      label: gettextCatalog.getString('Link'),
    },
  }, {
    key: 'innerIndex',
    type: 'input',
    templateOptions: {
      label: gettextCatalog.getString('Number'),
    },
  }, {
    key: 'outerIndex',
    type: 'input',
    templateOptions: {
      label: gettextCatalog.getString('Row'),
    },
  }, {
    key: 'local',
    type: 'checkbox',
    templateOptions: {
      label: gettextCatalog.getString('Local'),
    },
  } ]

}

angular
  .module('com.module.files.services.player', [])
  .service('PlayerService', PlayerService)
