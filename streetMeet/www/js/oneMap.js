angular.module('sm-meetApp.oneMap',  ['firebase', 'ngCordova', 'ngCookies'])

.controller('OneMapCtrl', function($scope, $firebase, OneMap, $cookieStore, $state, $cordovaGeolocation, $q) {

  angular.extend($scope, OneMap);
  OneMap.initialize();

  var map;

  var populateAddress = function() {
    var geocoder = new google.maps.Geocoder();
      geocoder.geocode({'latLng': map.getCenter()}, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
          $scope.reverseAddress = results[0].formatted_address;
          $cookieStore.put("addressBox", $scope.reverseAddress)
          $scope.$apply();
        } else {
          alert("Geocoder failed due to: " + status);
        }
      });
  }

  var geocode = function() {
    dragListener = google.maps.event.addListener(map, 'dragend', function() {
      populateAddress();
    })
  };

  // puts a marker on the center of the map to capture the location of a new event
  $scope.createEventMarker = function() {
    OneMap.clearMarkers();
    angular.element('#pac-input').slideDown();
    map = OneMap.getMap();
    $('<div/>').addClass('centerMarker').appendTo(map.getDiv())
    .click(function(){
      $q(function(resolve, reject) {
        angular.element('.centerMarker').remove();
        angular.element('#pac-input').slideUp();
        $('.btn-red').toggle().siblings('.create-toggle').toggle();

        resolve();
      }).then(function() {
        // $scope.cancelCreateEvent();
        $cookieStore.put('eventLoc', map.getCenter());
        $state.transitionTo('createEvent');
      })
    });
    // location input bar with autocomplete
    var input = /** @type {HTMLInputElement} */(
        document.getElementById('pac-input'));

    // google maps autocomplete
    var autocomplete = new google.maps.places.Autocomplete(input);
    autocomplete.bindTo('bounds', map);
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
    populateAddress();
    geocode();
  };

  $scope.cancelCreateEvent = function() {
    // OneMap.onKeyEnteredRegistration();
    OneMap.showMarkers();
    angular.element('.centerMarker').remove();
    angular.element('#pac-input').slideUp();
  };

  $scope.$on('$ionicView.enter', function() {
    OneMap.deleteMarkers();
    var currentUser = $cookieStore.get('currentUser');
    var currEventRef = new Firebase("https://boiling-torch-2747.firebaseio.com/users/"+currentUser+"/currentEvent");
    var eventSync = $firebase(currEventRef);
    var currEventObj = eventSync.$asObject();
    // user's current event
    currEventObj.$loaded().then(function() {
      if (currEventObj.$value) {
        $scope.isEvent =true;
        $scope.event = currEventObj.$value;
        OneMap.vergingDisplay();
      } else {
        $scope.isEvent = false;
        OneMap.onKeyEnteredRegistration();
      }
    });
  });

})

.factory('OneMap', function ($q, $location, $window, $rootScope, $cookieStore, $state, $firebase, $cordovaGeolocation) {
  // user location geofire
  var userRef = new Firebase("https://boiling-torch-2747.firebaseio.com/user_locations");
  var userGeoFire = new GeoFire(userRef);
  // event location geofire
  var refLoc = new Firebase("https://boiling-torch-2747.firebaseio.com/curr/locations");
  var geoFire = new GeoFire(refLoc);
  //archived location geofire
  var refArchivedLoc = new Firebase("https://boiling-torch-2747.firebaseio.com/archived/locations");
  var geoFireArchived = new GeoFire(refArchivedLoc);

  var markers = [];
  var reverseAddress;
  var map;
  var dragListener;
  var bounds = new google.maps.LatLngBounds();

  // Sets the map on all markers in the array.
  var setAllMap = function(map) {
    for (var i = 0; i < markers.length; i++) {
      markers[i].setMap(map);
    }
  }

  // Removes the markers from the map, but keeps them in the array.
  var clearMarkers = function() {
    setAllMap(null);
  }

  // Shows any markers currently in the array.
  function showMarkers() {
    setAllMap(map);
  }

  // Deletes all markers in the array by removing references to them.
  function deleteMarkers() {
    clearMarkers();
    markers = [];
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
      drawMap();

    }
  }

  // cancels the create event marker
  var cancelCreateEvent = function() {
    angular.element('.centerMarker').remove();
    angular.element('#pac-input').slideUp();
    google.maps.event.removeListener(dragListener);
  };

  // print events out on the map queried from GeoFire
  var onKeyEnteredRegistration = function() {
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
      // event data
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
          // bounds.extend(pos);

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
    });

    google.maps.event.addListener(map, 'dragend', function() {
      if (bounds.contains(map.getCenter())) return;
      // We're out of bounds - Move the map back within the bounds
      map.panToBounds(bounds)
     });
    google.maps.event.addListener(map, 'zoom_changed', function() {
       if (map.getZoom() < 14) map.setZoom(14);
     });
  };

  // show attendees converging to an event on the screen
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

  /* Callback method from the geolocation API which receives the current user's location */
  // draws the map on the canvas centered at the user's location
  var drawMap = function(location) {
    var userloc = $cookieStore.get('userloc');
    var latitude = userloc.coords.latitude;
    var longitude = userloc.coords.longitude;
    var center = new google.maps.LatLng(latitude, longitude)
    var mapOptions = {
      zoom: 14,
      center: center,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
    geocoder = new google.maps.Geocoder();
    var center = new google.maps.LatLng(latitude, longitude);
    var geoQuery = geoFire.query({
      center: [latitude, longitude],
      radius: 1.609344
    });
    map.setCenter(center);
    marker = new google.maps.Marker({
      position: center,
      map: map,
      icon: '/img/icon_user_pos_animated.gif',
      draggable: false,
      optimized : false,
      title: $cookieStore.get('currentUser')
    });
    bounds.extend(center);
    google.maps.event.addListener(marker, 'click', function() {
      $state.transitionTo('userProfile', {id: marker.title});
    });
    geolocationUpdate();
    // LOGIC HERE DETERMINING IF IN EVENT OR NOT
    var currEventRef = new Firebase("https://boiling-torch-2747.firebaseio.com/users/"+$cookieStore.get('currentUser')+"/currentEvent");
    var eventSync = $firebase(currEventRef);
    var currEventObj = eventSync.$asObject();
    currEventObj.$loaded().then(function() {
      if (currEventObj.$value) {
        vergingDisplay();
      } else {
        onKeyEnteredRegistration();
      }
    });

  }

  /* Handles any errors from trying to get the user's current location */
  var errorHandler = function(error) {
    if (error.code == 1) {
      console.error("Error: PERMISSION_DENIED: User denied access to their location");
    } else if (error.code === 2) {
      console.error("Error: POSITION_UNAVAILABLE: Network is down or positioning satellites cannot be reached");
    } else if (error.code === 3) {
      console.error("Error: TIMEOUT: Calculating the user's location too took long");
      geolocationCallbackQuery($cookieStore.get('userloc'));
    } else {
      console.error("Unexpected error code")
    }
  };

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

  // updates user's location on the map when user moves
  var showLocation = function(position) {
    var latitude = position.coords.latitude;
    var longitude = position.coords.longitude;
    var myLatlng = new google.maps.LatLng(latitude, longitude);
    globalLatLng = myLatlng;
    var userData = $cookieStore.get('currentUser');
    //adds user location data to firebase
    userGeoFire.set(userData, [latitude, longitude]).then(function() {
    }, function(error) {
      console.error("Error: " + error);
    });

    //updates marker position by removing the old one and adding the new one
    if (marker == null) {
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
  }

  var centerMapLocation = function() {
    map.setCenter(globalLatLng);
  }

  // returns the map for use in controllers
  var getMap = function() {
    return map;
  }

  var getMarkers = function() {
    return markers;
  }

  var eventStatus = function() {
    var currentUser = $cookieStore.get('currentUser');
    var currEventRef = new Firebase("https://boiling-torch-2747.firebaseio.com/users/"+currentUser+"/currentEvent");
    var eventSync = $firebase(currEventRef);
    var currEventObj = eventSync.$asObject();
    // user's current event
    return currEventObj.$loaded().then(function() {
      return currEventObj.$value;
    });
  }


  return {
    centerMapLocation: centerMapLocation,
    initialize: initialize,
    getMap: getMap,
    getMarkers: getMarkers,
    clearMarkers: clearMarkers,
    onKeyEnteredRegistration: onKeyEnteredRegistration,
    reverseAddress: reverseAddress,
    map: map,
    drawMap: drawMap,
    cancelCreateEvent: cancelCreateEvent,
    vergingDisplay: vergingDisplay,
    eventStatus: eventStatus,
    showMarkers: showMarkers,
    deleteMarkers: deleteMarkers
  }

});
