angular.module('sm-meetApp.map',  ['firebase'])

.controller('MapCtrl', function($scope, $firebase, Map) {
  angular.extend($scope, Map);

  // Get the current user's location
  Map.getLocation();
  Map.geolocationUpdate();
})

.factory('Map', function ($q, $location, $window, $rootScope, $cookieStore, $state) {
  var userRef = new Firebase("https://boiling-torch-2747.firebaseio.com/user_locations");
  var userGeoFire = new GeoFire(userRef);
  var refLoc = new Firebase("https://boiling-torch-2747.firebaseio.com/current/locations");
  var geoFire = new GeoFire(refLoc);
  var refArchivedLoc = new Firebase("https://boiling-torch-2747.firebaseio.com/archived/locations");
  var geoFireArchived = new GeoFire(refArchivedLoc);
  var center = new google.maps.LatLng(47.785326, -122.405696);
  var globalLatLng;
  var marker = null;
  var mapOptions = {
    zoom: 15,
    center: center,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };
  var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
  // var initialize = function() {
  //   map = map;
  // }

  // google.maps.event.addDomListener(window, 'load', initialize);

  // puts a marker on the center of the map to capture the location of a new event
  var createEvent = function() {
    $('<div/>').addClass('centerMarker').appendTo(map.getDiv())
    .click(function(){
      $cookieStore.put('eventLoc', map.getCenter());
      console.log($cookieStore.get('eventLoc'), 'stored!')
      $state.go('createEvent');
    });
  };

  // retrieves the user's current location
  var getLocation = function() {
    if (typeof navigator !== "undefined" && typeof navigator.geolocation !== "undefined") {
      console.log("Asking user to get their location");
      navigator.geolocation.getCurrentPosition(geolocationCallbackQuery, errorHandler);
    } else {
      console.log("Your browser does not support the HTML5 Geolocation API")
    }
  };

  /* Callback method from the geolocation API which receives the current user's location */
  var geolocationCallbackQuery = function(location) {
    var latitude = location.coords.latitude;
    var longitude = location.coords.longitude;
    var center = new google.maps.LatLng(latitude, longitude);
    var geoQuery = geoFire.query({
      center: [latitude, longitude],
      radius: 10
    });
    map.setCenter(center);
    var onKeyEnteredRegistration = geoQuery.on("key_entered", function(key, location) {
      console.log(key);
      var refEvent = new Firebase("https://boiling-torch-2747.firebaseio.com/current/events/"+key);
      refEvent.on('value', function(snap) {
        // if (false) {
        if (snap.val() && snap.val().createdAt > Date.now() - 1320000) {
          console.log(snap.val());
          var pos = new google.maps.LatLng(location[0], location[1]);
          var marker = new google.maps.Marker({
            position: pos,
            map: map,
            title: key
          });
          google.maps.event.addListener(marker, 'click', function() {
            $state.go('viewSingleEvent', {id: key});
          })
        } else {
          if(snap.val()) {
            var ref = new Firebase("https://boiling-torch-2747.firebaseio.com/");
            var id = ref.child("/archived/events/"+key);
            console.log(key, snap.val(), 'key, snapval');
            var locId = refLoc.child(key);
            id.set(snap.val(), function(error) {
              if (error) {
                alert("Data could not be saved." + error);
              } else {
                console.log(snap.val(), 'create archived event');
                ref.child("/current/events/" + key).remove();
                geoFireArchived.set(key, geoFire.get(key)._result)
                  .then(geoFire.remove(key));
              }
            });
          }
        }
      });
      console.log(key + " entered the query. Hi " + key + " at " + location);
    });

    console.log("Retrieved user's location: [" + latitude + ", " + longitude + "]");

  }

  /* Handles any errors from trying to get the user's current location */
  var errorHandler = function(error) {
    if (error.code == 1) {
      console.log("Error: PERMISSION_DENIED: User denied access to their location");
    } else if (error.code === 2) {
      console.log("Error: POSITION_UNAVAILABLE: Network is down or positioning satellites cannot be reached");
    } else if (error.code === 3) {
      console.log("Error: TIMEOUT: Calculating the user's location too took long");
    } else {
      console.log("Unexpected error code")
    }
  };

  var showLocation = function(position) {
    var latitude = position.coords.latitude;
    var longitude = position.coords.longitude;
    var myLatlng = new google.maps.LatLng(latitude, longitude);
    globalLatLng = myLatlng;

    //adds user location data to firebase
    userGeoFire.set({
      "user_name": [latitude, longitude] }).then(function() {
      console.log("Provided keys have been added to GeoFire");
    }, function(error) {
      console.log("Error: " + error);
    });

    //updates marker position by removing the old one and adding the new one
    if (marker == null) {
        marker = new google.maps.Marker({
        position: myLatlng,
        icon: '/img/blue_beer.png',
        draggable: false
      });
    } else {
      marker.setPosition(myLatlng);
    }

    if (marker && marker.setMap) {
      marker.setMap(null);
    }
    marker.setMap(map);
    console.log("Latitude : " + latitude + " Longitude: " + longitude);
  }

  //Updates user location on movement
  var geolocationUpdate = function() {
    if(navigator.geolocation) {
      //var updateTimeout = {timeout: 1000};
      var geoLoc = navigator.geolocation;
      var watchID = geoLoc.watchPosition(showLocation, errorHandler)
    } else {
      throw new Error("geolocation not supported!");
    }
  }

  var centerMapLocation = function() {
    map.setCenter(globalLatLng);
    console.log("centering map: ", mapOptions.center);
  }

    //Update the query's criteria every time the circle is dragged
    // var updateCriteria = _.debounce(function() {
    //   var latLng = circle.getCenter();
    //   geoQuery.updateCriteria({
    //     center: [latLng.lat(), latLng.lng()],
    //     radius: radiusInKm
    //   });
    // }, 10);
    // google.maps.event.addListener(circle, "drag", updateCriteria);


  return {
    getLocation: getLocation,
    geolocationCallbackQuery : geolocationCallbackQuery,
    errorHandler: errorHandler,
    createEvent: createEvent,
    map: map,
    geolocationUpdate: geolocationUpdate,
    centerMapLocation: centerMapLocation
  }

});
