angular.module('sm-meetApp.allMap',  ['firebase', 'ngCordova', 'ngCookies'])

.controller('AllMapCtrl', function($scope, $firebase, AllMap, $cookieStore, $state, $cordovaGeolocation) {

  angular.extend($scope, AllMap);

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
  var reverseAddress;
  var map;
  var dragListener;

  var clearMarkers = function(array) {
    for (var i = 0; i < markers.length; i++) {
      array[i].setMap(null);
    }
  }

  var marker;
  var globalLatLng;

  var initialize = function() {
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
      getLocation();
    }
  }

  // var map = initialize();

  var geocode = function() {
    geocoder = new google.maps.Geocoder();
    console.log(map);
    dragListener = google.maps.event.addListener(map, 'dragend', function() {
      geocoder.geocode({'latLng': map.getCenter()}, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
          console.log('works?')
          reverseAddress = results[0].formatted_address;
          console.log(reverseAddress);
          $cookieStore.put("addressBox", reverseAddress)
          $rootScope.$apply();
        } else {
          alert("Geocoder failed due to: " + status);
        }
      })
    })
  };

  var createEventMarker = function() {
    angular.element('#pac-input').slideDown();
    console.log('throw a marker!')

    $('<div/>').addClass('centerMarker').appendTo($('#map-canvas'))
    .click(function(){
      $cookieStore.put('eventLoc', map.getCenter());
      $state.transitionTo('createEvent');
    });
    geocode();

    var input = /** @type {HTMLInputElement} */(
        document.getElementById('pac-input'));

    // google maps autocomplete
    var autocomplete = new google.maps.places.Autocomplete(input);
    // autocomplete.bindTo('bounds', map);
    var infowindow = new google.maps.InfoWindow();
    var locationBoxMarker = new google.maps.Marker({
      map: map,
      anchorPoint: new google.maps.Point(0, -29)
    });

    google.maps.event.addListener(autocomplete, 'place_changed', function() {
      infowindow.close();
      locationBoxMarker.setVisible(false);
      var place = autocomplete.getPlace();
      if (!place.geometry) {
        return;
      }

      // If the place has a geometry, then present it on a map.
      if (place.geometry.viewport) {
        map.fitBounds(place.geometry.viewport);
      } else {
        map.setCenter(place.geometry.location);
        map.setZoom(17);  // Why 17? Because it looks good.
      }
      locationBoxMarker.setIcon(/** @type {google.maps.Icon} */({
        url: place.icon,
        size: new google.maps.Size(71, 71),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(17, 34),
        scaledSize: new google.maps.Size(35, 35)
      }));
      locationBoxMarker.setPosition(place.geometry.location);
      locationBoxMarker.setVisible(true);

      var address = '';
      if (place.address_components) {
        address = [
          (place.address_components[0] && place.address_components[0].short_name || ''),
          (place.address_components[1] && place.address_components[1].short_name || ''),
          (place.address_components[2] && place.address_components[2].short_name || '')
        ].join(' ');
      }

      infowindow.setContent('<div><strong>' + place.name + '</strong><br>' + address);
      infowindow.open(map, locationBoxMarker);
      $cookieStore.put('addressBox', address);
    });
  };

  var cancelCreateEvent = function() {
    angular.element('.centerMarker').remove();
    angular.element('#pac-input').slideUp();
    google.maps.event.removeListener(dragListener);
  };

  var onKeyEnteredRegistration = function() {
    console.log('on key registration')
    var refLoc = new Firebase("https://boiling-torch-2747.firebaseio.com/curr/locations");
    var geoFire = new GeoFire(refLoc);
    var location = $cookieStore.get('userloc');
    var latitude = location.coords.latitude;
    var longitude = location.coords.longitude;
    var geoQuery = geoFire.query({
      center: [latitude, longitude],
      radius: 1.609344
    });
    geoQuery.on("key_entered", function(key, location, distance) {
      var refEvent = new Firebase("https://boiling-torch-2747.firebaseio.com/events/"+key);
      var eventSync = $firebase(refEvent);
      var eventObj = eventSync.$asObject();
      eventObj.$loaded().then(function() {
        // add marker for an event if it was created in the past 22 minutes
        // if (false) {
        if (eventObj.createdAt > Date.now() - 1320000) {
          var pos = new google.maps.LatLng(location[0], location[1]);
          var marker = new google.maps.Marker({
            position: pos,
            map: map,
            icon: '/img/icon_map_join_blue-16.png',
            title: key
          });
          markers.push(marker);
          google.maps.event.addListener(marker, 'click', function() {
            $state.transitionTo('attendEvent', {id: key}, {
              reload: true,
              inherit: false,
              notify: true
            });
          })
        } else {
          geoFire.remove(key);
        }
      });
      console.log(key + " entered the query. Hi " + key + " at " + location);
    });
    console.log("Retrieved user's location: [" + latitude + ", " + longitude + "]");
  };

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
    map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
    console.log(map);
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
    clearMarkers: clearMarkers,
    onKeyEnteredRegistration: onKeyEnteredRegistration,
    createEventMarker: createEventMarker,
    reverseAddress: reverseAddress,
    map: map,
    cancelCreateEvent: cancelCreateEvent
  }

});
