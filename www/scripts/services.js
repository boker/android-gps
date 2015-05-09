angular.module('starter.services', [])

.factory('Chats', function() {
    // Might use a resource here that returns a JSON array

    // Some fake testing data
    var chats = [{
        id: 0,
        name: 'Ben Sparrow',
        lastText: 'You on your way?',
        face: 'https://pbs.twimg.com/profile_images/514549811765211136/9SgAuHeY.png'
    }, {
        id: 1,
        name: 'Max Lynx',
        lastText: 'Hey, it\'s me',
        face: 'https://avatars3.githubusercontent.com/u/11214?v=3&s=460'
    }, {
        id: 2,
        name: 'Adam Bradleyson',
        lastText: 'I should buy a boat',
        face: 'https://pbs.twimg.com/profile_images/479090794058379264/84TKj_qa.jpeg'
    }, {
        id: 3,
        name: 'Perry Governor',
        lastText: 'Look at my mukluks!',
        face: 'https://pbs.twimg.com/profile_images/491995398135767040/ie2Z_V6e.jpeg'
    }, {
        id: 4,
        name: 'Mike Harrington',
        lastText: 'This is wicked good ice cream.',
        face: 'https://pbs.twimg.com/profile_images/578237281384841216/R3ae1n61.png'
    }];

    return {
        all: function() {
            return chats;
        },
        remove: function(chat) {
            chats.splice(chats.indexOf(chat), 1);
        },
        get: function(chatId) {
            for (var i = 0; i < chats.length; i++) {
                if (chats[i].id === parseInt(chatId)) {
                    return chats[i];
                }
            }
            return null;
        }
    };
})

.factory('LocationData', function() {
    var colleagueLoc = [];
    var MyLoc = null;

    return {
        getData: function() {

        },
        addData: function() {

        },
        getUserPosition: function() {
            return MyLoc;
        },
        addUserPosition: function(positionData) {
            MyLoc = positionData;
        }
    };

})
.service('gpsServer', function($q){
 var socket;
 function wireupCallBacks(socket, callbacks){
   // This happend when a user is successfully initialized on the server


   socket.on('coordinateChanged', function (message) {
     callbacks.someContactsCoordinateHasChanged(message);
   });

   socket.on('contactOnline', function (message) {
     callbacks.someContactHasComeOnline(message);
   });

   // handle a user going offline
   socket.on('userOffline', function (user) {
     console.log('user logged off - ' + user.name);
     console.log(user);
     callbacks.someContactHasGoneOffline(user);
   });
 }

 return {
   // coordinates should be x:, y:
   // callbacks-> someContactsCoordinateHasChanged:, someContactHasComeOnline:, someContactHasGoneOffline:
   connectToGpsServer: function(username, coordinates, callbacks){
     var deferred = $q.defer();
     gpsCallBacks = callbacks;
     console.log('going to connect to server');
     socket = io.connect('http://127.0.0.1:4000');
     //gpsChat = new Chat(socket);

     // Display the initial list of folks who are being tracked
     socket.on('folksOnline', function (message) {
       console.log('received folks online');
       console.log(message);
      var trackedpeople = {};
       var folksOnline = message.folksOnline;
       for(var propName in folksOnline){
         trackedpeople[folksOnline[propName].name] = {coordinates: folksOnline[propName].coordinates};
       }
       console.log(trackedpeople);
       wireupCallBacks(socket, callbacks);
       deferred.resolve(trackedpeople);
     });

     socket.on('nameResult', function(result) {

       socket.emit('enrollForTracking', {name: username, coordinates: coordinates});
     });

     return deferred.promise;
   },
   notifyCoordinateChange: function(coordinates){
     socket.emit('changeCoordinates', coordinates);
   },
   disconnectFromServer: function(){
     socket.disconnect();
     socket = null;
   }
 };
});
