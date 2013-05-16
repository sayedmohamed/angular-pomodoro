'use strict';


angularPomodoroApp.controller('MainCtrl', function MainCtrl($scope, $timeout) {

  $scope.logs = [];
  $scope.alerts = [];

  var mytimeout;
  var pomodorotime = 25 * 60 * 1000;
  var shortbreaktime = 5 * 60 * 1000;
  var longbreaktime = 15 * 60 * 1000;

  $scope.pomodorobtn = "btn-success";
  $scope.shortbreakbtn = "";
  $scope.longbreakbtn = "";

  $scope.counter = pomodorotime;
  $scope.sound; 

  $scope.onTimeout = function () {
    $scope.counter = $scope.counter - 1000;

    if ($scope.counter > 0) {
      mytimeout = $timeout($scope.onTimeout, 1000);
    } else {
      $timeout.cancel(mytimeout);

      if ($scope.logs[0].name == "Pomodoro") {
        $scope.pomodorobtn = "btn-warning";
        $scope.shortbreakbtn = "btn-success";
        $scope.longbreakbtn = "";
      }

      if ($scope.logs[0].name == "Short Break" || $scope.logs[0].name == "Long Break") {
        $scope.pomodorobtn = "btn-success";
        $scope.shortbreakbtn = "";
        $scope.longbreakbtn = "";
      }

      if ($scope.logs.length >= 6) {
        if ($scope.logs[0].name == "Pomodoro" && $scope.logs[1].name == "Short Break" && $scope.logs[2].name == "Pomodoro" && $scope.logs[3].name == "Short Break" && $scope.logs[4].name == "Pomodoro" && $scope.logs[5].name == "Short Break" && $scope.logs[6].name == "Pomodoro") {
          $scope.pomodorobtn = "btn-warning";
          $scope.shortbreakbtn = "";
          $scope.longbreakbtn = "btn-success";
        }
      }

      if (!window.webkitNotifications) {
        var aux = $scope.logs[0].name;
        $scope.alerts.unshift(aux);
      } else if (window.webkitNotifications.checkPermission() == 0) {
        var notification = window.webkitNotifications.createNotification('http://cdn2.iconfinder.com/data/icons/lullacons/large-alert.png', $scope.logs[0].name, $scope.logs[0].name + " has ended");

        notification.addEventListener('display', function() {
            window.setTimeout(function() {
                    notification.cancel();
                }, 5000);
        });
        notification.show();
      }
    }
  }

  $scope.pomodoro = function () {
    var log = {};
    log["name"] = "Pomodoro"
    log["time"] = moment();
    $scope.logs.unshift(log);

    $timeout.cancel(mytimeout);
    $scope.counter = pomodorotime;
    $scope.onTimeout();

    $scope.pomodorobtn = "btn-warning";
    $scope.shortbreakbtn = "";
    $scope.longbreakbtn = "";

    if (window.webkitNotifications) {
      if (window.webkitNotifications.checkPermission() != 0) {
        window.webkitNotifications.requestPermission();
      }
    }
  }

  $scope.shortbreak = function () {
    var log = {};
    log["name"] = "Short Break"
    log["time"] = moment();
    $scope.logs.unshift(log);

    $timeout.cancel(mytimeout);
    $scope.counter = shortbreaktime;
    $scope.onTimeout();

    $scope.pomodorobtn = "";
    $scope.shortbreakbtn = "btn-warning";
    $scope.longbreakbtn = "";
  }

  $scope.longbreak = function () {
    var log = {};
    log["name"] = "Long Break"
    log["time"] = moment();
    $scope.logs.unshift(log);

    $timeout.cancel(mytimeout);
    $scope.counter = longbreaktime;
    $scope.onTimeout();

    $scope.pomodorobtn = "";
    $scope.shortbreakbtn = "";
    $scope.longbreakbtn = "btn-warning";
  }

  $scope.stop = function () {
    $timeout.cancel(mytimeout);
    $scope.logs = []
    $scope.counter = 0;

    $scope.pomodorobtn = "btn-success";
    $scope.shortbreakbtn = "";
    $scope.longbreakbtn = "";

  }

  $scope.startmusic = function() {
    SC.stream('/tracks/293', function(sound){   
              $scope.sound = sound;
              $scope.sound.start();      
    });
  }

  $scope.closemusic = function() {
    $scope.sound.stop();
  }

});

angular.module('filters', []).filter('fromNow', function () {
  return function (date) {
    return moment(date).fromNow();
  };
});


