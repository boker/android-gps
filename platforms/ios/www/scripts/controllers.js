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

.controller('MapCtrl', function($scope, $stateParams, $ionicLoading, $compile, LocationData) {
  $scope.messages = "hi";
  var lat1;
  var long1;
  if (LocationData.getUserPosition() != null) {
    var userPosition = LocationData.getUserPosition().split(',');
    lat1 = userPosition[0];
    long1 = userPosition[1];
    console.log(lat1);

  } else {
    lat1 = 12;
    long1 = 77;
  }
  $scope.map = {
    center: {
      latitude: lat1,
      longitude: long1
    },
    zoom: 8
  };
})

.controller('AccountCtrl', function($scope, LocationData, gpsServer) {
  $scope.model = {
    x: null,
    y: null
  };
  var users = {};
  $scope.model = {userList : []};

  function handleCoordinateChangedEvent(message) {
    console.log('location changed!');
    console.log(message);
    users[message.name] = {coordinates : message.coordinates};
    notifyUserListChange();
  }

  function handleOnlineEvent(message) {
    console.log('online');
    console.log(message);
    users[message.name] = {coordinates : message.coordinates};
    notifyUserListChange();
  }

  function handleOfflineEvent(message) {
    console.log('offline');
    console.log(message);
    if($scope.users[message.name]){
      delete users[message.name];
    }
    notifyUserListChange();
  }

  function notifyUserListChange(){
    console.log('users list changed');
    console.log($scope.users);
    var userlist = [];
    for(prop in users){
      userlist.push({name: prop, coordinates: users[prop].coordinates});
    }
    $scope.model.userList = userlist;
  }

  $scope.$watch('model.userList', function(){
    console.log('scope has changed');
    console.log($scope.model.userList);
  }, true);

  var onSuccess = function(position) {
    // alert('Latitude: ' + position.coords.latitude + '\n' +
    //     'Longitude: ' + position.coords.longitude + '\n' +
    //     'Altitude: ' + position.coords.altitude + '\n' +
    //     'Accuracy: ' + position.coords.accuracy + '\n' +
    //     'Altitude Accuracy: ' + position.coords.altitudeAccuracy + '\n' +
    //     'Heading: ' + position.coords.heading + '\n' +
    //     'Speed: ' + position.coords.speed + '\n' +
    //     'Timestamp: ' + position.timestamp + '\n');

    var addressData = getCityCountry(position.coords.latitude, position.coords.longitude);
    var city = addressData[0];
    console.log(addressData[0]);
    alert('Latitude: ' + position.coords.latitude + 'Longitude: ' + position.coords.longitude + 'City: ' + city);
  };

  function onError(error) {
    alert('code: ' + error.code + '\n' +
      'message: ' + error.message + '\n');
  }

  $scope.getGPSPosition = function() {
    console.log("getting position");
    navigator.geolocation.getCurrentPosition(onSuccess, onError);
  }

  $scope.startTracking = function() {
    console.log('controller tracking!');
    gpsServer.connectToGpsServer('user1', {
        x: 10,
        y: 20
      }, {
        someContactsCoordinateHasChanged: handleCoordinateChangedEvent,
        someContactHasComeOnline: handleOnlineEvent,
        someContactHasGoneOffline: handleOfflineEvent
      })
      .then(function(response) {
        console.log('connection successful');
        console.log(response);
        users = response;
        notifyUserListChange();
      });
  }
  $scope.stopTracking = function(){
    gpsServer.disconnectFromServer();
  }

  $scope.changeCoordinates = function(){
    gpsServer.notifyCoordinateChange({
      x: $scope.model.x,
      y: $scope.model.y
    });
  }

  var getCityCountry = function(latitude, longitude) {
    var geocoder;
    geocoder = new google.maps.Geocoder();
    var latlng = new google.maps.LatLng(latitude, longitude);
    geocoder.geocode({
      'latLng': latlng
    }, function(results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
        if (results[0]) {
          var add = results[0].formatted_address;
          var value = add.split(",");
          count = value.length;
          country = value[count - 1];
          state = value[count - 2];
          city = value[count - 3];
          addressData = latitude + ',' + longitude + ',' + city + ',' + country;
          console.log(addressData);
          //refactor
          $scope.model.x = latitude;
          $scope.model.y = longitude;
          $scope.startTracking();
          LocationData.addUserPosition(addressData);
          var fetchedData = LocationData.getUserPosition();
          console.log(fetchedData);
          return addressData;
        } else {
          return "Address not found";
        }
      } else {
        return "error";
      }

    });
  }

  $scope.settings = {
    enableFriends: true
  };
});
