angular.module('sm-meetApp.map',  ['firebase'])

.controller('MapCtrl', function($scope, $firebase, Map) {
  angular.extend($scope, Map);

  var ref = new Firebase("https://boiling-torch-2747.firebaseio.com/");
  var geoFire = new GeoFire(ref);

  // Get the current user's location
  Map.getLocation();


})

.factory('Map', function ($q) {
  var ref = new Firebase("https://boiling-torch-2747.firebaseio.com/");
  var geoFire = new GeoFire(ref);

  var center = new google.maps.LatLng(47.785326, -122.405696);
  var mapOptions = {
    zoom: 15,
    center: center,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };
  var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

  var createEvent = function() {
    $('<div/>').addClass('centerMarker').appendTo(map.getDiv())
    .click(function(){
      console.log(map.getCenter())
    });
  };


  var getLocation = function() {
    if (typeof navigator !== "undefined" && typeof navigator.geolocation !== "undefined") {
      console.log("Asking user to get their location");
      navigator.geolocation.getCurrentPosition(geolocationCallback, errorHandler);
    } else {
      console.log("Your browser does not support the HTML5 Geolocation API")
    }
  };

  /* Callback method from the geolocation API which receives the current user's location */
  var geolocationCallback = function(location) {
    var latitude = location.coords.latitude;
    var longitude = location.coords.longitude;
    var center = new google.maps.LatLng(latitude, longitude);
    map.setCenter(center);
    console.log("Retrieved user's location: [" + latitude + ", " + longitude + "]");

    var username = "wesley";
    geoFire.set(username, [latitude, longitude]).then(function() {
      console.log("Current user " + username + "'s location has been added to GeoFire");

      // When the user disconnects from Firebase (e.g. closes the app, exits the browser),
      // remove their GeoFire entry
      firebaseRef.child(username).onDisconnect().remove();

      console.log("Added handler to remove user " + username + " from GeoFire when you leave this page.");
      console.log("You can use the link above to verify that " + username + " was removed from GeoFire after you close this page.");
    }).catch(function(error) {
      console.log("Error adding user " + username + "'s location to GeoFire");
    });
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
    geolocationCallback : geolocationCallback,
    errorHandler: errorHandler,
    createEvent: createEvent
  }

});
