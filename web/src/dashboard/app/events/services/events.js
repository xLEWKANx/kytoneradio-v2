'use strict'
import angular from 'angular'

function EventsService ($state, CoreService, Event, gettextCatalog) {

  this.getEvents = () => Event.find().$promise

  this.getEvent = (id) => Event.findById({ id }).$promise

  this.upsertEvent = (event) => Event.upsert(event).$promise
    .then(() => {
      CoreService.toastSuccess(
        gettextCatalog.getString('Event saved'),
        gettextCatalog.getString('Your event is safe with us!')
      )
    })
    .catch((err) => {
      CoreService.toastError(
        gettextCatalog.getString('Error saving event '),
        gettextCatalog.getString('This event could no be saved: ') + err
      )
    })

  this.deleteEvent = (id, successCb, cancelCb) => {
    CoreService.confirm(
      gettextCatalog.getString('Are you sure?'),
      gettextCatalog.getString('Deleting this cannot be undone'),
      () => {
        Event.deleteById({ id: id }, () => {
          CoreService.toastSuccess(
            gettextCatalog.getString('Event deleted'),
            gettextCatalog.getString('Your event is deleted!'))
          successCb()
        }, (err) => {
          CoreService.toastError(
            gettextCatalog.getString('Error deleting event'),
            gettextCatalog.getString('Your event is not deleted! ') + err)
          cancelCb()
        })
      },
      () => cancelCb()
    )
  }

  this.getFormFields = () => ([
    {
      key: 'name',
      type: 'input',
      templateOptions: {
        label: gettextCatalog.getString('Name'),
        required: true,
      },
    }, {
      key: 'description',
      type: 'textarea',
      templateOptions: {
        label: gettextCatalog.getString('Description'),
        required: true,
      },
    }, {
      key: 'startDate',
      type: 'datepicker',
      templateOptions: {
        label: gettextCatalog.getString('Start Date'),
        required: true,
      },
    }, {
      key: 'startDate',
      type: 'timepicker',
      templateOptions: {
        label: gettextCatalog.getString('Start Time'),
      },
    }, {
      key: 'endDate',
      type: 'datepicker',
      templateOptions: {
        label: gettextCatalog.getString('End Date'),
        required: true,
      },
    }, {
      key: 'endDate',
      type: 'timepicker',
      templateOptions: {
        label: gettextCatalog.getString('End Time'),
      },
    },
  ])
}

angular
  .module('com.module.events.services.events', [])
  .service('EventsService', EventsService)
