angular.module('sm-meetApp.map',  ['firebase'])

.controller('MapCtrl', function($scope, $firebase, Map) {
  angular.extend($scope, Map);

  var ref = new Firebase("https://boiling-torch-2747.firebaseio.com/");
  var geoFire = new GeoFire(ref);



  // Get the current user's location
  Map.getLocation();


  var center = new google.maps.LatLng(37.785326, -122.405696);
  var mapOptions = {
    zoom: 15,
    center: center,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };
  $scope.map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
  // $scope.map = new google.maps.Map(document.getElementById('map_canvas'),
              // mapOptions);


  // Create a draggable circle centered on the map
  // var circle = new google.maps.Circle({
  //   strokeColor: "#6D3099",
  //   strokeOpacity: 0.7,
  //   strokeWeight: 1,
  //   fillColor: "#B650FF",
  //   fillOpacity: 0.35,
  //   map: $scope.map,
  //   center: center,
  //   radius: 1000,
  //   draggable: true
  // });

  google.maps.event.addListener($scope.map, 'drag', function() {
      // console.log($scope.map.center);
    });

  $scope.createEvent = function() {

    $('<div/>').addClass('centerMarker').appendTo($scope.map.getDiv())
    //do something onclick
    .click(function(){
      console.log($scope.map.center)
      // var that=$(this);
      // if(!that.data('win')){
      //   that.data('win',new google.maps.InfoWindow({content:'this is the center'}));
      //   that.data('win').bindTo('position',$scope.map,'center');
      // }
      // that.data('win').open($scope.map);
    });
    // $scope.marker = new google.maps.Marker({
    //   position: center,
    //   draggable: true,
    //   map: $scope.map,
    //   title: 'Hello World!'
    // });

    // $scope.markLoc = function() {
    //   console.log($scope.marker.getPosition());
    // }

    // var infowindow = new google.maps.InfoWindow({
    //   // content: '<div style="min-width:80px">set location</div>',
    //   content: "<button onclick='console.log(this)'>set location</button>"
    // });

    // infowindow.open($scope.map,$scope.marker);

    // google.maps.event.addListener($scope.marker, 'drag', function() {
    //   // $scope.map.setZoom(15);
    //   $scope.map.setCenter($scope.marker.getPosition());
    //   console.log($scope.marker.getPosition());
    // });

    // google.maps.event.addListener($scope.map, 'drag', function() {
    //   $scope.marker.center = $scope.map.getPosition());
    //   console.log(marker.getPosition());
    // });
  };

})

.factory('Map', function ($q) {
  var ref = new Firebase("https://boiling-torch-2747.firebaseio.com/");
  var geoFire = new GeoFire(ref);

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

  var initializeMap = function() {
    // Get the location as a Google Maps latitude-longitude object
    var center = [37.785326, -122.405696];
    var loc = new google.maps.LatLng(center[0], center[1]);

    // Create the Google Map
    map = new google.maps.Map(document.getElementById("map-canvas"), {
      center: loc,
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    });

    // Create a draggable circle centered on the map
    var circle = new google.maps.Circle({
      strokeColor: "#6D3099",
      strokeOpacity: 0.7,
      strokeWeight: 1,
      fillColor: "#B650FF",
      fillOpacity: 0.35,
      map: map,
      center: loc,
      radius: ((radiusInKm) * 1000),
      draggable: true
    });

    //Update the query's criteria every time the circle is dragged
    // var updateCriteria = _.debounce(function() {
    //   var latLng = circle.getCenter();
    //   geoQuery.updateCriteria({
    //     center: [latLng.lat(), latLng.lng()],
    //     radius: radiusInKm
    //   });
    // }, 10);
    // google.maps.event.addListener(circle, "drag", updateCriteria);
  }

  return {
    getLocation: getLocation,
    geolocationCallback : geolocationCallback,
    errorHandler: errorHandler
  }

});
