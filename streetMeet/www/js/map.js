angular.module('sm-meetApp.map',  ['firebase', 'ngCordova'])

.controller('MapCtrl', function($scope, $firebase, Map, $cookieStore, $state, $cordovaGeolocation) {

  angular.extend($scope, Map);
  // setAllMap(null);
  Map.geolocationUpdate();
  var currEventRef = new Firebase("https://boiling-torch-2747.firebaseio.com/users/"+$cookieStore.get('currentUser')+"/currentEvent");
  var eventSync = $firebase(currEventRef);
  var currEventObj = eventSync.$asObject();

  // when entering this view
  $scope.$on( "$ionicView.enter", function( scopes, states ) {
    // google.maps.event.trigger( Map.map, 'resize' );
    //mark if user is in an event or not
    currEventObj.$loaded().then(function() {
      if (currEventObj.$value) {
        $scope.inEvent = true;
      } else {
        $scope.inEvent = false;
      }
    });
    if ($cookieStore.get('userloc')) {
      Map.geolocationCallbackQuery($cookieStore.get('userloc'));
    } else {
      Map.getLocation();
    }
  });



  // puts a marker on the center of the map to capture the location of a new event
  // $scope.createEvent = function() {

  //   angular.element('#pac-input').slideDown();

  //   $('<div/>').addClass('centerMarker').appendTo(Map.map.getDiv())
  //   .click(function(){
  //     $cookieStore.put('eventLoc', Map.map.getCenter());
  //     $state.transitionTo('createEvent');
  //   });
  //   geocode();
  // };

  $scope.cancelCreateEvent = function() {
    angular.element('.centerMarker').remove();
    angular.element('#pac-input').slideUp();
  };


})

.factory('Map', function ($q, $location, $window, $rootScope, $cookieStore, $state, $firebase, $cordovaGeolocation) {
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
  // clearMarkers();
  // var geocoder;
  // var address;

  var app = document.URL.indexOf( 'http://' ) === -1 && document.URL.indexOf( 'https://' ) === -1;
  if ( app ) {
      // PhoneGap application
      $cordovaGeolocation
      .getCurrentPosition(posOptions)
      .then(function (position) {
        var lat  = position.coords.latitude
        var long = position.coords.longitude

        var center = new google.maps.LatLng(lat, long);
      });

  } else {
      // Web page
  var center = new google.maps.LatLng(47.785326, -122.405696);
  }

  var globalLatLng;
  // var mapOptions = {
  //   zoom: 15,
  //   center: center,
  //   mapTypeId: google.maps.MapTypeId.ROADMAP
  // };
  // var globalAddress;

  /*Geocoding and address autofill*/
  var input = /** @type {HTMLInputElement} */(
      document.getElementById('pac-input'));
  // var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

  var initialize = function(map) {
    var center = new google.maps.LatLng(47.785326, -122.405696);
    var globalLatLng;

    var mapOptions = {
      zoom: 15,
      center: center,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
    geocoder = new google.maps.Geocoder();
    return map;
  }
  // initialize();
  var map = initialize();

  var geocode = function() {
    geocoder = new google.maps.Geocoder();
    google.maps.event.addListener(map, 'dragend', function() {
      geocoder.geocode({'latLng': map.getCenter()}, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
          $scope.reverseAddress = results[0].formatted_address;
          $cookieStore.put("addressBox", $scope.reverseAddress)
          $scope.$apply();
        } else {
          alert("Geocoder failed due to: " + status);
        }
      })
    })
  };
  var createEvent = function() {

    angular.element('#pac-input').slideDown();

    $('<div/>').addClass('centerMarker').appendTo(map.getDiv())
    .click(function(){
      $cookieStore.put('eventLoc', Map.map.getCenter());
      $state.transitionTo('createEvent');
    });
    geocode();
  };

  // var marker = null;

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

    if (place.geometry.viewport) {
      map.fitBounds(place.geometry.viewport);
    } else {
      map.setCenter(place.geometry.location);
      map.setZoom(17);
    }
    locationBoxMarker.setIcon(({
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

  var initialize = function() {
    var center = new google.maps.LatLng(47.785326, -122.405696);
    var globalLatLng;
  }
  var getLocation = function() {

    var app = document.URL.indexOf( 'http://' ) === -1 && document.URL.indexOf( 'https://' ) === -1;
    if ( app ) {
        $cordovaGeolocation
        .getCurrentPosition(posOptions)
        .then(function (position) {
         geolocationCallbackQuery(position);
        });
    } else {
      if (typeof navigator !== "undefined" && typeof navigator.geolocation !== "undefined") {
        navigator.geolocation.getCurrentPosition(geolocationCallbackQuery, errorHandler, {timeout:10000});
      } else {
        throw new Error("Your browser does not support geolocation.")
      }
    }
  };

  /* Callback method from the geolocation API which receives the current user's location */
  var geolocationCallbackQuery = function(location) {
    var latitude = location.coords.latitude;
    var longitude = location.coords.longitude;
    $cookieStore.put('userloc', location);
    var center = new google.maps.LatLng(latitude, longitude);
    var geoQuery = geoFire.query({
      center: [latitude, longitude],
      radius: 1.609344
    });
    map.setCenter(center);
    var currentUser = $cookieStore.get('currentUser');
    var currEventRef = new Firebase("https://boiling-torch-2747.firebaseio.com/users/"+currentUser+"/currentEvent");
    var eventSync = $firebase(currEventRef);
    var currEventObj = eventSync.$asObject();
    currEventObj.$loaded().then(function() {
      if (!currEventObj.$value) {
      // if (true) {
        var pos = new google.maps.LatLng(latitude, longitude);
        var marker = new google.maps.Marker({
          position: pos,
          map: map,
          icon: '/img/icon_user_pos_animated.gif',
          draggable: false,
          title: $cookieStore.get("currentUser"),
          optimized : false
        });
        markers.push(marker);
        var onKeyEnteredRegistration = function() {
          geoQuery.on("key_entered", function(key, location, distance) {
            var refEvent = new Firebase("https://boiling-torch-2747.firebaseio.com/events/"+key);
            var eventSync = $firebase(refEvent);
            var eventObj = eventSync.$asObject();
            eventObj.$loaded().then(function() {
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
                var ref = new Firebase("https://boiling-torch-2747.firebaseio.com/");
                var id = ref.child("/curr/locations");
                var geoFire = new GeoFire(id);
                geoFire.remove(key);
                  // get list of event's attendees
                  var sync = $firebase(id.child("/attendees"));
                  var attendeeObj = sync.$asObject();
                  attendeeObj.$loaded().then(function() {
                });
              }
            });
          });
        }();
      } else {
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
        }();
      }
    });
  }

  var errorHandler = function(error) {
    if (error.code == 1) {
      console.error("Error: PERMISSION_DENIED: User denied access to their location");
    } else if (error.code === 2) {
      console.error("Error: POSITION_UNAVAILABLE: Network is down or positioning satellites cannot be reached");
    } else if (error.code === 3) {
      console.error("Error: TIMEOUT: Calculating the user's location too took long");
    } else {
      console.error("Unexpected error code")
    }
  };

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
  }

  return {
    getLocation: getLocation,
    geolocationCallbackQuery : geolocationCallbackQuery,
    errorHandler: errorHandler,
    map: map,
    geolocationUpdate: geolocationUpdate,
    centerMapLocation: centerMapLocation,
    initialize: initialize,
    markers: markers,
    clearMarkers: clearMarkers,
    createEvent: createEvent
  }

});
