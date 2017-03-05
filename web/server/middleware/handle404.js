module.exports = function () {
  return function notFoundHandler(err, req, res, next) {
    if (err.status === 404) {
      // console.error('404:', err.toString())
      next()
    } else {
      next(err)
    }
  }
}
