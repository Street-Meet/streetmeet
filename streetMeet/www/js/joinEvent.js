angular.module('sm-meetApp.joinEvent',  ["firebase"])

.controller('JoinEventCtrl', ["$scope", "$firebase", '$cookieStore', 'Events', function($scope, $firebase, $cookieStore, Events) {
  var ref = new Firebase("https://boiling-torch-2747.firebaseio.com/events");

  $scope.list =  Events.throwTheEvents(ref);

  var refLoc = new Firebase("https://boiling-torch-2747.firebaseio.com/curr/locations");
  var geoFire = new GeoFire(refLoc);
  var location = $cookieStore.get('userloc');
  var latitude = location.coords.latitude;
  var longitude = location.coords.longitude;
  var center = new google.maps.LatLng(latitude, longitude);
  var geoQuery = geoFire.query({
    center: [latitude, longitude],
    radius: 1.5
  });
  $scope.distance = {};
  var onKeyEnteredRegistration = geoQuery.on("key_entered", function(key, location, distance) {
    $scope.distance[key] = Math.floor(distance*100*0.621371)/100;
  });
}])
.factory("Events", ["$FirebaseArray", "$firebase", function($FirebaseArray, $firebase) {

  var throwTheEvents = function(myRef){
    var sync = $firebase(myRef);
    return sync.$asArray(); // this will be an instance of TotalEvents
  };

  return {
    throwTheEvents : throwTheEvents,
  };
}])
.filter('reverse', function() {
  return function(items) {
    return items.slice().reverse();
  };
})
.filter('timer', function() {
  return function(items) {
    var result = [];
    for (var i = 0; i < items.length; i++) {
      if (items[i].createdAt && items[i].createdAt > Date.now() - 1320000) {
        result.push(items[i]);
      }
    }
    return result;
  }
});
