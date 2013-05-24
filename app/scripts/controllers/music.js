'use strict';

angular.module('app').controller('MusicCtrl', function MusicCtrl($scope, $http) {

	$scope.search_genre = "jazz fusion";

	$http.get('http://api.soundcloud.com/tracks?genres=reggae&license=cc-by-sa&client_id=0c106a401c601bdc1ab1c5248d0be160&format=json').success(function(logs){
		console.log(logs);
	});

	$scope.startmusic = function() {
		SC.get('/tracks',  { genres: $scope.search_genre, streamable: true, limit: "200", durationfrom: "120000" }, function(tracks){

			console.log(tracks.length);

			var track_id = tracks[Math.floor(Math.random()*200)].id;
			console.log(track_id);
			SC.stream('/tracks/' + track_id , function(sound){   
				$scope.sound = sound;
				$scope.sound.start();
			});
		});    
	}

	$scope.closemusic = function() {
		$scope.sound.stop();
	}
});