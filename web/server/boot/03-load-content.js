'use strict'
import { default as debug } from 'debug'

// to enable these logs set `DEBUG=boot:03-load-content` or `DEBUG=boot:*`
const log = debug('boot:03-load-content')

module.exports = function (app) {
  // Do not run if we are in codegen mode.
  if (process.env.ENV === 'codegen') return

  if (app.dataSources.db.name !== 'Memory' && !process.env.INITDB) {
    return
  }

  log('Creating categories and products')

  const Category = app.models.Category
  const Product = app.models.Product

  Category.findOrCreate(
    {where: {name: 'Beer'}}, // find
    {name: 'Beer'}, // create
    (err, category, created) => {
      if (err) {
        console.error('err', err)
      }
      (created) ? log('created Category', category.name)
        : log('found Category', category.name)
      Product.findOrCreate(
        {where: {name: 'Draft beer'}}, // find
        {
          name: 'Draft beer',
          price: '250',
          categoryId: category.id,
        }, // create
        (err, data, created) => {
          if (err) {
            console.error('err', err)
          }
          (created) ? log('created Product', data.name)
            : log('found Product', data.name)
        })
      Product.findOrCreate(
        {where: {name: 'Bottled beer'}}, // find
        {
          name: 'Bottled beer',
          price: '350',
          categoryId: category.id,
        }, // create
        (err, data, created) => {
          if (err) {
            console.error('err', err)
          }
          (created) ? log('created Product', data.name)
            : log('found Product', data.name)
        })
    })

  Category.findOrCreate({where: {name: 'Wine'}}, {
    name: 'Wine',
  }, (err, category, created) => {
    if (err) {
      console.error('err', err)
    }
    (created) ? log('created Category', category.name)
      : log('found Category', category.name)
    Product.findOrCreate({where: {name: 'Red wine'}}, {
      name: 'Red wine',
      price: '350',
      categoryId: category.id,
    }, (err, data, created) => {
      if (err) {
        console.error('err', err)
      }
      (created) ? log('created Product', data.name)
        : log('found Product', data.name)
    })
    Product.findOrCreate({where: {name: 'White wine'}}, {
      name: 'White wine',
      price: '350',
      categoryId: category.id,
    }, (err, data, created) => {
      if (err) {
        console.error('err', err)
      }
      (created) ? log('created Product', data.name)
        : log('found Product', data.name)
    })
  })

}
