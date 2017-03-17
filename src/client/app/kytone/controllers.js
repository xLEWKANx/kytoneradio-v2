(function() {
  "use strict";
  angular
    .module("kytoneApp")
    .controller("mainCtrl", mainCtrl)
    .controller("postersCtrl", postersCtrl)
    .controller("postCtrl", postCtrl)
    .controller("scheduleCtrl", scheduleCtrl);

  function mainCtrl($scope, localStorageService, Setting) {
    var vm = this;

    Setting.findById({ id: 1 }, function(result) {
      vm.slidersArr = result.options;
      for (var key in result.options) {
        if (result.options[key].isBig) {
          result.options[key].wrapperClass = "cover-wrapper-big";
        }
      }
    });

    vm.playerStatus = "Loading";
    vm.control = function(target) {
      function playStatus(val) {
        return localStorageService.set("isPlaying", val);
      }
      console.log("angular.element", target);

      if (target === "play") {
        playStatus(true);
        angular.element("#player")[0].play();
      } else {
        playStatus(false);
        angular.element("#player")[0].pause();
      }
    };
  }

  function postersCtrl($scope, Slide, postFunc) {
    var vm = this;
    vm.postersArr = Slide.find(
      {
        filter: {
          where: {
            outerIndex: $scope.$parent.$index
          }
        }
      },
      function() {
        vm.count = vm.postersArr.length;
      }
    );
    vm.count = [];
    vm.elemReady = false;
    vm.startCoords = {};
    vm.writeCoords = function(x) {
      vm.startCoords.x = x.clientX;
      vm.startCoords.y = x.clientY;
    };
    vm.openPost = postFunc.openPost;
  }

  function postCtrl($scope, postData, postFunc) {
    var vm = this;
    vm.postData = postData;
    vm.getContent = postFunc.getHtmlContent;
    vm.isOpened = postFunc.isOpened;
    vm.closePost = postFunc.closePost;
    vm.openPost = postFunc.openPost;
    vm.startCoords = {};
    vm.writeCoords = function(x) {
      vm.startCoords.x = x.clientX;
      vm.startCoords.y = x.clientY;
    };
  }

  function scheduleCtrl($scope, socket, Schedule) {
    var vm = this;
    socket.on("playlist", function(data) {
      data.forEach(function(track) {
        track.startTime = moment(track.startTime).format("HH:mm");
        track.endTime = moment(track.endTime).format("HH:mm");
      });
      vm.next = data;
    });
  }
})();
