'use strict'

module.exports = function (Slide) {

  Slide.createFakeData = function (faker, count) {
    return Slide.create({
      content: `* ${faker.lorem.paragraph()} *`,
      pictureUrl: `http://placehold.it/3${count}0x1${count}0`,
      outerIndex: Math.floor(count / 10),
      innerIndex: count % 10,
      local: Math.round(Math.random())
    })
  }

}
