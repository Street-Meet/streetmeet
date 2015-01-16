angular.module('sm-meetApp.attendeeMap',  ['firebase', 'ngCordova'])

.controller('AttendeeMapCtrl', function($scope, $firebase, AttendeeMap, $cookieStore, $state, $cordovaGeolocation, AllMap) {

  angular.extend($scope, AttendeeMap);
  angular.extend($scope, AllMap);

  AllMap.initialize();

  // setAllMap(null);
  AllMap.geolocationUpdate();
  $scope.$on( "$ionicView.enter", function( scopes, states ) {
    // google.maps.event.trigger( Map.map, 'resize' );

    if ($cookieStore.get('userloc')) {
      AllMap.geolocationCallbackQuery($cookieStore.get('userloc'));
    } else {
      AllMap.getLocation();
    }
  });


})

.factory('AttendeeMap', function ($q, $location, $window, $rootScope, $cookieStore, $state, $firebase, $cordovaGeolocation) {
  var markers =[];

  var vergingDisplay = function() {
    var currentUser = $cookieStore.get('currentUser');
    var currEventRef = new Firebase("https://boiling-torch-2747.firebaseio.com/users/"+currentUser+"/currentEvent");
    var eventSync = $firebase(currEventRef);
    var currEventObj = eventSync.$asObject();
    // user's current event
    currEventObj.$loaded().then(function() {
      var eventLocRef = new Firebase("https://boiling-torch-2747.firebaseio.com/archived/locations/"+currEventObj.$value+"/l")
      var eventLocSync = $firebase(eventLocRef);
      var eventLocObj = eventLocSync.$asObject();
      // user's current event location
      eventLocObj.$loaded().then(function() {
        var pos = new google.maps.LatLng(eventLocObj[0], eventLocObj[1]);
        var marker = new google.maps.Marker({
          position: pos,
          map: map,
          draggable: false,
          title: currEventObj.$value,
          icon: '/img/icon_map_event_blue.png',
        });
        markers.push(marker);
        google.maps.event.addListener(marker, 'click', function() {
          $state.transitionTo('attendEvent', {id: currEventObj.$value});
        });
        var attendeeRef = new Firebase("https://boiling-torch-2747.firebaseio.com/events/"+currEventObj.$value+"/attendees");
        var attendeeSync = $firebase(attendeeRef);
        var attendeeObj = attendeeSync.$asObject();
        // attendees of user's current event
        attendeeObj.$loaded().then(function() {
          angular.forEach(attendeeObj, function(value, key) {
            if (key !== currentUser) {
              var userLocRef = new Firebase("https://boiling-torch-2747.firebaseio.com/user_locations/"+key+"/l");
              var userLocSync = $firebase(userLocRef);
              var userLocObject = userLocSync.$asObject();
              // attendee's location
              userLocObject.$loaded().then(function() {
                var pos = new google.maps.LatLng(userLocObject[0], userLocObject[1]);
                var marker = new google.maps.Marker({
                  position: pos,
                  map: map,
                  icon: '/img/icon_user_pos_animated.gif',
                  draggable: false,
                  title: key,
                  optimized : false
                });
                markers.push(marker);
                google.maps.event.addListener(marker, 'click', function() {
                  $state.transitionTo('userProfile', {id: key});
                });
              });
            }
          });
        });
      });
    });
  };



  return {
    map: map,
    markers: markers,
    clearMarkers: clearMarkers,
    vergingDisplay: vergingDisplay
  }

});
