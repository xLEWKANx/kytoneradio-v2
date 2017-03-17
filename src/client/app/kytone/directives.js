(function () {
  'use strict';

  angular.module('kytoneApp')
    .directive('myPosterPlace', myPosterPlace)
    .directive('imgReady', imgReady)
    .directive('scroll', scroll)
    .directive('titleUpdate', titleUpdate)
    .directive('volumeRegulator', volumeRegulator)
    .directive('playerStatus', playerStatus)
    .directive('socIcon', socIcon)
    .directive('timeUpdate', timeUpdate)
    .directive('crutch', crutch);

  function myPosterPlace() {
    return function (scope, element, attrs) {
      scope.$parent.elemReady = null;
      if (scope.$last) {
        scope.$parent.elemReady = true;
      }
    };
  }

  function imgReady() {
    return {
      restrict: 'A',
      scope: {
        poster: '='
      },
      link: function (scope, element, attr) {
        angular.element(element).on('load', function () {
          scope.poster.count -= 1;
          if (scope.poster.count === -6) {
            $(element).closest('slick').slick('slickNext').removeClass('hidden');
          }
        });
      }
    }
  }

  function scroll($timeout) {

    return {
      restrict: 'A',
      link: function (scope, element, attr) {
        $timeout(function () {
          var elemWidth = angular.element(element)[0].clientWidth;
          var maxWitdh = $('#plPlace')[0].clientWidth - $('.track-time')[0].clientWidth;
          angular.element(element).addClass('scroll');
          angular.element(element).addClass('stop');
          if (elemWidth > maxWitdh) {
            $(element).hover(
              function (el) {
                angular.element(element).removeClass('stop');
              },
              function (el) {
                angular.element(element).addClass('stop');
              })
          }
        });
      }
    };
  }

  function titleUpdate(socket) {
    return {
      restrict: 'A',
      link: function (scope, element, attr) {
        socket.on('track', function (data) {
          if (!data.title) {
            angular.element(element).find('p').text('Kytone Radio (c)');
          } else
            angular.element(element).find('p').text(data.title);
        })
        $(element).liMarquee();
      }
    }
  }

  function volumeRegulator(localStorageService) {
    return {
      restrict: 'A',
      link: function (scope, element, attr) {
        var volume = 50;
        if (localStorageService.isSupported && localStorageService.get('volume') !== null) {
          volume = localStorageService.get('volume');
        };
        $("#slider").slider({
          value: volume,
          step: 5,
          range: 'min',
          animate: true,
          min: 0,
          max: 100,
          create: function () {
            $("#player")[0].volume = $("#slider").slider("value") / 100;
          },
          change: function () {
            var value = $("#slider").slider("value");
            localStorageService.set('volume', value);
            $("#player")[0].volume = (value / 100);
          }
        });

        //player volume slider [mouse wheel]
        $(".volume").on('mousewheel DOMMouseScroll', function (e) {
          var o = e.originalEvent;
          var delta = o && (o.wheelDelta || (o.detail && -o.detail));

          if (delta) {
            e.preventDefault();

            var step = $("#slider").slider("option", "step");
            step *= delta < 0 ? 1 : -1;
            $("#slider").slider("value", $("#slider").slider("value") + step);
          }
        });
      }
    }
  }

  function playerStatus($interval, localStorageService) {
    return {
      restrict: 'A',
      link: function (scope, element, attr) {

        function activeButton(target) {
          var opposite;
          target === '#play' ? opposite = '#pause' : opposite = '#play';
          // Activate
          $(target).addClass('animated flipInX');
          $(target).find('.animate-zone').each(function (index, el) {
            $(el).attr('class', 'animate-zone player-btn-active');
          });
          // Deactivate
          $(opposite).removeClass('animated flipInX');
          $(opposite).find('.animate-zone').each(function (index, el) {
            $(el).attr('class', 'animate-zone player-btn');
          });
        }
        var reconnect, isPlaying = false;

        if (localStorageService.isSupported && localStorageService.get('isPlaying') !== null) {
          isPlaying = localStorageService.get('isPlaying');
        };

        scope.stop = function () {
          $interval.cancel(reconnect);
        };

        scope.start = function () {
          reconnect = $interval(function () {
            element.load();
            if (isPlaying) {
              document.getElementById('player').play();
            };
          },
            3000,
            10);
        }
        element.on('loadstart', function () {

          scope.stop();
        })
        element.on('canplay', function () {
          scope.main.playerStatus = 'Ready';
          scope.stop();
          scope.$apply();
        });
        element.on('pause', function () {
          activeButton('#pause');
          scope.main.playerStatus = 'Pause';
          scope.$apply();
        });
        element.on('playing', function () {
          activeButton('#play');
          scope.main.playerStatus = 'Play';
          scope.$apply();
        });
        angular.element(element).children().on('error', function (error) {

        })
        element.on('error', function (error) {

          scope.main.playerStatus = 'Reconnecting...'
          scope.start();
          scope.$apply();
        });
        // element.on('suspend', function() {
        //   console.log('suspened');
        //   scope.main.playerStatus = 'Reconnecting...'
        //   scope.start();
        //   scope.$apply();
        // });
        element.on('ended', function () {

          scope.main.playerStatus = 'Reconnecting...'
          scope.start();
          scope.$apply();
        });
      }
    }
  }

  function socIcon() {
    return {
      restrict: 'A',
      link: function (scope, element, attr) {
        $(element).hover(function (event) {
          $(this).addClass('animated flipInX');
          $(this).one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function () {
            $(this).removeClass('animated flipInX');
          });
        });
      }
    }
  }

  function timeUpdate($interval) {
    return {
      restrict: 'A',
      link: function (scope, element, attr) {
        $interval(function () {
          var date = new Date();
          var timezone = date.getTimezoneOffset() / 60
          angular.element(element).text(
            date.toTimeString().slice(0, 5) +
            ' KYIV (' + '+' + -timezone + ' GMT)');
        }, 1000 * 60)
      }
    }
  }


  function crutch() {
    return {
      restrict: 'A',
      link: function (scope, element, attr) {
        attr.$set('src', attr.src + '?nocache=' + Math.floor(Math.random() * 1000000).toString());
      }
    }
  }
})();
