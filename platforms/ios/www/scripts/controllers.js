angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope) {})

.controller('ChatsCtrl', function($scope, Chats) {
  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  }
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('MapCtrl', function($scope, $stateParams,$ionicLoading, $compile) {
 $scope.messages = "hi";
$scope.map = { center: { latitude: 45, longitude: -73 }, zoom: 8 };      
})

.controller('AccountCtrl', function($scope) {
var onSuccess = function(position) {
        alert('Latitude: ' + position.coords.latitude + '\n' +
            'Longitude: ' + position.coords.longitude + '\n' +
            'Altitude: ' + position.coords.altitude + '\n' +
            'Accuracy: ' + position.coords.accuracy + '\n' +
            'Altitude Accuracy: ' + position.coords.altitudeAccuracy + '\n' +
            'Heading: ' + position.coords.heading + '\n' +
            'Speed: ' + position.coords.speed + '\n' +
            'Timestamp: ' + position.timestamp + '\n');
    };

    function onError(error) {
        alert('code: ' + error.code + '\n' +
            'message: ' + error.message + '\n');
    }

    $scope.getGPSPosition = function() {
    	console.log("getting position");
        navigator.geolocation.getCurrentPosition(onSuccess, onError);
    }
      $scope.settings = {
    enableFriends: true
  };
});
