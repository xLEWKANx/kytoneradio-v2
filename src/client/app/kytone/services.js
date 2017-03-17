(function () {
  'use strict';

  angular.module('kytoneApp')
    .factory('Posters', Posters)
    .factory('Schedule', Schedule)
    .factory('postData', postData)
    .factory('postFunc', postFunc)
    .factory('socket', socket);

  function Posters($resource) {
    return $resource('/api/posters/:outerIndex/:innerIndex', {}, {
      'get': { method: 'GET', isArray: true }
    });
  }

  function postData() {
    var postData = {
      postOpened: false,
      currentPost: {}
    };

    return postData;
  }

  function postFunc(Slide, postData, $window, $timeout) {
    var service = {
      openPost: openPost,
      closePost: closePost,
      isOpened: isOpened,
      getHtmlContent: getHtmlContent
    };
    var lastScrollTop = 0;
    return service;

    function openPost($event, outerIndex, innerIndex, startCoords) {
      if ($event.clientX == startCoords.x || outerIndex === 0 || $event.type === 'touchend') {
        var post = Slide.find({
          filter: {
            where: {
              outerIndex: outerIndex,
              innerIndex: innerIndex
            }
          }
        },
          function () {
            postData.currentPost = post[0];
            if (post[0].local) {
              postData.postOpened = true;
              $event.preventDefault();
              $event.stopPropagation();
              $event.cancelBubble = true;
              $event.returnValue = false;

              lastScrollTop = $(window).scrollTop();
              $timeout(function () {
                window.scrollTo(0, 0);
              }, 10)
            } else if ($event.type === 'touchend' && !post[0].local) {


            }
          }
        );
      };
    }

    function getHtmlContent() {
      return postData.currentPost.content
    }

    function closePost() {
      postData.currentPost = {};
      postData.postOpened = false;
      // reset locking
      $(window).scrollTop(lastScrollTop);
      lastScrollTop = 0;
    }

    function isOpened() {
      return postData.postOpened;
    }
  }

  function Schedule($resource) {
    return $resource('/api/playlist/next', {}, {
      'get': { method: 'GET', isArray: true }
    });
  }

  function socket(socketFactory) {
    return socketFactory({
    });
  };

})();
