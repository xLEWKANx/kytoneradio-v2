'use strict'
import angular from 'angular'

function MetaService ($injector, CoreService, Meta, gettextCatalog) {

  this.find = () => Meta.getModels().$promise

  this.findById = (name) => Meta.getModelById({ name }).$promise

  this.getModelInstance = (name) => $injector.get(name)

  this.getModelItems = (name) => {
    const Model = this.getModelInstance(name)
    return (typeof Model.find !== 'function') ? false : Model.find().$promise
  }

  this.getModelItem = (modelName, modelId) => {
    const Model = this.getModelInstance(modelName)
    if (typeof Model.find !== 'function') {
      return false
    } else {
      return Model.findOne({
        filter: {
          where: {
            id: modelId,
          },
        },
      }).$promise
    }
  }

  this.getModelFields = (model) => {
    const result = []
    angular.forEach(model.properties, (property, propertyName) => {
      if (propertyName !== 'id') {
        result.push(getModelField(propertyName, property))
      }
    })
    return result
  }

  function getModelField (propertyName, property) {
    return {
      key: propertyName,
      type: getModelFieldType(property),
      templateOptions: {
        label: propertyName,
        required: property.required !== undefined ? property.required : false,
        description: property.description !== undefined ? property.description : false,
      },
    }
  }

  function getModelFieldType (property) {
    let result = 'input'
    if (property.meta !== undefined && property.meta.formType !== undefined) {
      result = property.meta.formType
    }
    return result
  }

  this.upsert = (modelName, item) => {
    const Model = this.getModelInstance(modelName)
    return Model.upsert(item).$promise
      .then(() => {
        CoreService.toastSuccess(
          gettextCatalog.getString('Item saved'),
          gettextCatalog.getString('Your item is safe with us!')
        )
      })
      .catch((err) => {
        CoreService.toastError(
          gettextCatalog.getString('Error saving item '),
          gettextCatalog.getString(`This item could no be saved: ${err}`)
        )
      }
    )
  }

  this.delete = (modelName, modelId, successCb, cancelCb) => {
    const Model = this.getModelInstance(modelName)

    CoreService.confirm(
      gettextCatalog.getString('Are you sure?'),
      gettextCatalog.getString('Deleting this cannot be undone'),
      () => {
        Model.deleteById({ id: modelId }).$promise.then(() => {
          CoreService.toastSuccess(
            gettextCatalog.getString('Item deleted'),
            gettextCatalog.getString('Your item is deleted!'))
          successCb()
        }).catch((err) => {
          CoreService.toastError(
            gettextCatalog.getString('Error deleting item'),
            gettextCatalog.getString(`Your item is not deleted! ${err}`))
          cancelCb()
        })
      },
      () => {
        cancelCb()
      }
    )
  }

}

angular
  .module('com.module.core.services.meta', [])
  .service('MetaService', MetaService)
