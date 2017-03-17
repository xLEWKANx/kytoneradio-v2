(function () {
  'use strict';

  angular.module('kytoneApp')
    .filter('reverse', reverse);

  function reverse() {
    return function (array) {
      if (array) {
        return array.slice().reverse();
      }
    }
  }
})();