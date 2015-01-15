angular.module('sm-meetApp.allMap',  ['firebase', 'ngCordova'])

.controller('AllMapCtrl', function($scope, $firebase, AllMap, $cookieStore, $state, $cordovaGeolocation) {

  angular.extend($scope, AllMap);
  var map = AllMap.initialize();
//   // setAllMap(null);
//   Map.geolocationUpdate();
//   var currEventRef = new Firebase("https://boiling-torch-2747.firebaseio.com/users/"+$cookieStore.get('currentUser')+"/currentEvent");
//   var eventSync = $firebase(currEventRef);
//   var currEventObj = eventSync.$asObject();

//   // when entering this view
//   $scope.$on( "$ionicView.enter", function( scopes, states ) {
//     // google.maps.event.trigger( Map.map, 'resize' );
//     //mark if user is in an event or not
//     currEventObj.$loaded().then(function() {
//       if (currEventObj.$value) {
//         $scope.inEvent = true;
//       } else {
//         $scope.inEvent = false;
//       }
//     });
//     if ($cookieStore.get('userloc')) {
//       Map.geolocationCallbackQuery($cookieStore.get('userloc'));
//     } else {
//       Map.getLocation();
//     }
//   });

})

.factory('AllMap', function ($q, $location, $window, $rootScope, $cookieStore, $state, $firebase, $cordovaGeolocation) {
  // user location geofire
  var userRef = new Firebase("https://boiling-torch-2747.firebaseio.com/user_locations");
  var userGeoFire = new GeoFire(userRef);
  // event location geofire
  var refLoc = new Firebase("https://boiling-torch-2747.firebaseio.com/curr/locations");
  var geoFire = new GeoFire(refLoc);
  //archived location geofire
  var refArchivedLoc = new Firebase("https://boiling-torch-2747.firebaseio.com/archived/locations");
  var geoFireArchived = new GeoFire(refArchivedLoc);




  var markers =[];

  var clearMarkers = function(array) {
    for (var i = 0; i < markers.length; i++) {
      array[i].setMap(null);
    }
  }

  var marker;

  var initialize = function(map) {
    var app = document.URL.indexOf( 'http://' ) === -1 && document.URL.indexOf( 'https://' ) === -1;
    if ( app ) {
        // PhoneGap application
        $cordovaGeolocation
        .getCurrentPosition(posOptions)
        .then(function (position) {
          var lat  = position.coords.latitude
          var lng = position.coords.longitude
          var center = new google.maps.LatLng(lat, lng);
        });

    } else {
      // Web page
      // var center = new google.maps.LatLng(47.785326, -122.405696);
      var center = getLocation();
    }
    var globalLatLng;
  }

  // var map = initialize();



  // retrieves the user's current location
  var getLocation = function() {
    var app = document.URL.indexOf( 'http://' ) === -1 && document.URL.indexOf( 'https://' ) === -1;
    if ( app ) {
        // PhoneGap application
        return $cordovaGeolocation
        .getCurrentPosition(posOptions)
        .then(function (position) {
         geolocationCallbackQuery(position);
        });
    } else {
      // Web page
      if (typeof navigator !== "undefined" && typeof navigator.geolocation !== "undefined") {
        console.log("Asking user to get their location");
        navigator.geolocation.getCurrentPosition(geolocationCallbackQuery, errorHandler, {timeout:10000});
      } else {
        console.log("Your browser does not support the HTML5 Geolocation API");
      }
    }
  };

  /* Callback method from the geolocation API which receives the current user's location */
  var geolocationCallbackQuery = function(location) {
    var latitude = location.coords.latitude;
    var longitude = location.coords.longitude;
    $cookieStore.put('userloc', location);
    var center = new google.maps.LatLng(latitude, longitude)
    var mapOptions = {
      zoom: 15,
      center: center,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
    geocoder = new google.maps.Geocoder();
    var center = new google.maps.LatLng(latitude, longitude);
    var geoQuery = geoFire.query({
      center: [latitude, longitude],
      radius: 1.609344
    });
    map.setCenter(center);
    console.log('creating marker')
    marker = new google.maps.Marker({
      position: center,
      map: map,
      icon: '/img/icon_user_pos_animated.gif',
      draggable: false,
      optimized : false,
      title: $cookieStore.get('currentUser')
    });
    google.maps.event.addListener(marker, 'click', function() {
      $state.transitionTo('userProfile', {id: marker.title});
    });
    console.log('updating user location')
    geolocationUpdate();
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

  //Updates user location on movement
  var geolocationUpdate = function() {
    console.log('geolocationUpdate', !!navigator.geolocation)
    if(navigator.geolocation) {
      //var updateTimeout = {timeout: 1000};
      console.log('setting up updates on user movement');
      var geoLoc = navigator.geolocation;
      var watchID = geoLoc.watchPosition(showLocation, errorHandler)
    } else {
      throw new Error("geolocation not supported!");
    }
  }

  var showLocation = function(position) {
    console.log('showLocation');
    var latitude = position.coords.latitude;
    var longitude = position.coords.longitude;
    var myLatlng = new google.maps.LatLng(latitude, longitude);
    globalLatLng = myLatlng;
    var userData = $cookieStore.get('currentUser');
    //adds user location data to firebase
    userGeoFire.set(userData, [latitude, longitude]).then(function() {
      console.log("Provided keys have been added to GeoFire");
    }, function(error) {
      console.log("Error: " + error);
    });

    //updates marker position by removing the old one and adding the new one
    if (marker == null) {
      console.log(marker);
      marker = new google.maps.Marker({
        position: myLatlng,
        icon: '/img/icon_user_pos_animated.png',
        draggable: false
      });
      // markers.push(marker);
    } else {
      marker.setPosition(myLatlng);
    }

    if (marker && marker.setMap) {
      marker.setMap(null);
    }
    marker.setMap(map);
    console.log("Latitude : " + latitude + " Longitude: " + longitude);
  }

  var centerMapLocation = function() {
    map.setCenter(globalLatLng);
  }


  return {
    centerMapLocation: centerMapLocation,
    initialize: initialize,
    markers: markers,
    clearMarkers: clearMarkers
  }

});
