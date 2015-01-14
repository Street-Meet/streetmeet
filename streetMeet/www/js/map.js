angular.module('sm-meetApp.map',  ['firebase'])

.controller('MapCtrl', function($scope, $firebase, Map, $cookieStore, $state) {
  angular.extend($scope, Map);
  Map.geolocationUpdate();
  var currEventRef = new Firebase("https://boiling-torch-2747.firebaseio.com/users/"+$cookieStore.get('currentUser')+"/currentEvent");
  var eventSync = $firebase(currEventRef);
  var currEventObj = eventSync.$asObject();

  $scope.$on( "$ionicView.enter", function( scopes, states ) {
    // google.maps.event.trigger( Map.map, 'resize' );
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
    console.log('Did it work?')
  });
})

.factory('Map', function ($q, $location, $window, $rootScope, $cookieStore, $state, $firebase) {
  // user location geofire
  var userRef = new Firebase("https://boiling-torch-2747.firebaseio.com/user_locations");
  var userGeoFire = new GeoFire(userRef);
  // event location geofire
  var refLoc = new Firebase("https://boiling-torch-2747.firebaseio.com/curr/locations");
  var geoFire = new GeoFire(refLoc);
  //archived location geofire
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
  var globalAddress;

  /*Geocoding and address autofill*/
  var input = /** @type {HTMLInputElement} */(
      document.getElementById('pac-input'));
  var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

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
    console.log("address box", $cookieStore.get('addressBox', address));
  });



  // var initialize = function() {
    // var center = new google.maps.LatLng(47.785326, -122.405696);
    // var globalLatLng;

    // var mapOptions = {
    //   zoom: 15,
    //   center: center,
    //   mapTypeId: google.maps.MapTypeId.ROADMAP
    // };
    // var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
    // return map;
  // }

  var initialize = function() {
    var center = new google.maps.LatLng(47.785326, -122.405696);
    var globalLatLng;

    var mapOptions = {
      zoom: 15,
      center: center,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
    return map;
  }

  // google.maps.event.addDomListener(window, 'load', initialize);


  var map = initialize();
  var marker = null;
  // puts a marker on the center of the map to capture the location of a new event
  var createEvent = function() {
    $('<div/>').addClass('centerMarker').appendTo(map.getDiv())
    .click(function(){
      $cookieStore.put('eventLoc', map.getCenter());
      $state.transitionTo('createEvent');
        // .then(function() {
        //   if($cookieStore.get('addressBox')) {
        //     var eventAddress = $cookieStore.get('addressBox');
        //     document.getElementById('location').value = $cookieStore.get('address');
        //     console.log("Event address: ", eventAddress);
        //   }
        // });
    });
  };

  // retrieves the user's current location
  var getLocation = function() {
    if (typeof navigator !== "undefined" && typeof navigator.geolocation !== "undefined") {
      console.log("Asking user to get their location");

      navigator.geolocation.getCurrentPosition(geolocationCallbackQuery, errorHandler, {timeout:10000});
    } else {
      console.log("Your browser does not support the HTML5 Geolocation API");
    }
  };

  /* Callback method from the geolocation API which receives the current user's location */
  var geolocationCallbackQuery = function(location) {
    console.log(location);
    console.log('you think?')
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
      console.log('current event', currEventObj.$value)
      if (!currEventObj.$value) {
      // if (true) {
        var onKeyEnteredRegistration = function() {
          console.log('register key')
          geoQuery.on("key_entered", function(key, location, distance) {
            console.log(key);
            var refEvent = new Firebase("https://boiling-torch-2747.firebaseio.com/events/"+key);
            var eventSync = $firebase(refEvent);
            var eventObj = eventSync.$asObject();
            eventObj.$loaded().then(function() {
              console.log('eventObj yo');
              // add marker for an event if it was created in the past 22 minutes
              // if (false) {
              if (eventObj.createdAt > Date.now() - 1320000) {
                var pos = new google.maps.LatLng(location[0], location[1]);
                var marker = new google.maps.Marker({
                  position: pos,
                  map: map,
                  title: key
                });
                google.maps.event.addListener(marker, 'click', function() {
                  $state.transitionTo('attendEvent', {id: key}, {
                    reload: true,
                    inherit: false,
                    notify: true
                  });
                })
              } else {
                console.log('reaching else');
                var ref = new Firebase("https://boiling-torch-2747.firebaseio.com/");
                var id = ref.child("/curr/locations");
                var geoFire = new GeoFire(id);
                geoFire.remove(key);
                  // get list of event's attendees
                  var sync = $firebase(id.child("/attendees"));
                  var attendeeObj = sync.$asObject();
                  attendeeObj.$loaded().then(function() {
                  console.log(attendeeObj);
                });
              }
            });
            console.log(key + " entered the query. Hi " + key + " at " + location);
          });

          console.log("Retrieved user's location: [" + latitude + ", " + longitude + "]");
        }();
      } else {
        console.log('else');
        var vergingDisplay = function() {
          var currentUser = $cookieStore.get('currentUser');
          var currEventRef = new Firebase("https://boiling-torch-2747.firebaseio.com/users/"+currentUser+"/currentEvent");
          var eventSync = $firebase(currEventRef);
          var currEventObj = eventSync.$asObject();
          currEventObj.$loaded().then(function() {
            console.log(currEventObj.$value);

            var attendeeRef = new Firebase("https://boiling-torch-2747.firebaseio.com/events/"+currEventObj.$value+"/attendees");
            var attendeeSync = $firebase(attendeeRef);
            var attendeeObj = attendeeSync.$asObject();
            attendeeObj.$loaded().then(function() {
              console.log(attendeeObj);
              angular.forEach(attendeeObj, function(value, key) {
                console.log(key);
                var userLocRef = new Firebase("https://boiling-torch-2747.firebaseio.com/user_locations/"+key+"/l");
                var userLocSync = $firebase(userLocRef);
                var userLocObject = userLocSync.$asObject();
                userLocObject.$loaded().then(function() {
                  var pos = new google.maps.LatLng(userLocObject[0], userLocObject[1]);
                  var marker = new google.maps.Marker({
                    position: pos,
                    map: map,
                    icon: '/img/piedPiper.gif',
                    draggable: false,
                    title: key
                  });
                  google.maps.event.addListener(marker, 'click', function() {
                    $state.transitionTo('userProfile', {id: key});
                  });
                  console.log('current event', currEventObj.$value);
                  var eventLocRef = new Firebase("https://boiling-torch-2747.firebaseio.com/archived/locations/"+currEventObj.$value+"/l")
                  var eventLocSync = $firebase(eventLocRef);
                  var eventLocObj = eventLocSync.$asObject();
                  eventLocObj.$loaded().then(function() {
                    console.log(currEventObj.$value);
                    var pos = new google.maps.LatLng(eventLocObj[0], eventLocObj[1]);
                    var marker = new google.maps.Marker({
                      position: pos,
                      map: map,
                      draggable: false,
                      title: key
                    });
                    google.maps.event.addListener(marker, 'click', function() {
                      $state.transitionTo('attendEvent', {id: currEventObj.$value});
                    });
                  });
                });

              });
            })
          });
        }();
      }
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

  var showLocation = function(position) {
    var latitude = position.coords.latitude;
    var longitude = position.coords.longitude;
    var myLatlng = new google.maps.LatLng(latitude, longitude);
    globalLatLng = myLatlng;
    var userData = $cookieStore.get('currentUser');
    console.log("User Data", userData);
    //adds user location data to firebase
    userGeoFire.set(userData, [latitude, longitude]).then(function() {
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
    centerMapLocation: centerMapLocation,
    initialize: initialize
  }

});
