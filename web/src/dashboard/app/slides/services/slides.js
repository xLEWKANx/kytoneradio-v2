'use strict'
import angular from 'angular'

function SlidesService (CoreService, Slide, gettextCatalog) {

  this.getSlides = () => Slide.find({
    filter: {
      order: 'created DESC',
    },
  }).$promise

  this.getSlide = (id) => Slide.findById({ id }).$promise

  this.upsertSlide = (slide) => Slide.upsert(slide).$promise
    .then(() => CoreService.toastSuccess(
      gettextCatalog.getString('Slide saved'),
      gettextCatalog.getString('Your slide is safe with us!')
      )
    )
    .catch((err) => CoreService.toastSuccess(
      gettextCatalog.getString('Error saving slide '),
      gettextCatalog.getString(`This slide could no be saved: ${err}`)
      )
    )

  this.deleteSlide = (id, successCb, cancelCb) => {
    CoreService.confirm(
      gettextCatalog.getString('Are you sure?'),
      gettextCatalog.getString('Deleting this cannot be undone'),
      () => {
        Slide.deleteById({ id: id },
          () => {
            CoreService.toastSuccess(
              gettextCatalog.getString('Slide deleted'),
              gettextCatalog.getString('Your slide is deleted!'))
            successCb()
          }, (err) => {
            CoreService.toastError(
              gettextCatalog.getString('Error deleting slide'),
              gettextCatalog.getString(`Your slide is not deleted! ${err}`))
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
  .module('com.module.slides.services.slides', [])
  .service('SlidesService', SlidesService)
