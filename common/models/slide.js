const faker = require('faker');

module.exports = function(Slide) {
  Slide.createFakeData = function(count, slides = [], cb) {
    if (typeof slides === 'function') {
      cb = slides;
      slides = [];
    }
    console.log('slides', slides);
    return Slide.create({
      content: `* ${faker.lorem.paragraph()} *`,
      pictureUrl: `http://placehold.it/3${count}0x1${count}0`,
      outerIndex: Math.floor(count / 10),
      innerIndex: count % 10,
      local: Math.round(Math.random()),
    })
      .then(data => {
        slides = slides.concat(data);
        if (count === 0) return cb(null, slides);

        return Slide.createFakeTracks(count - 1, slides, cb);
      })
      .catch(cb);
  };
};
