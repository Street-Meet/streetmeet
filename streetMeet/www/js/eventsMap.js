angular.module('sm-meetApp.eventsMap',  ['firebase', 'ngCordova'])

.controller('EventsMapCtrl', function($scope, $firebase, EventsMap, $cookieStore, $state, $cordovaGeolocation, AllMap) {

  angular.extend($scope, EventsMap);
  angular.extend($scope, AllMap);


  var map = AllMap.initialize();

  var input = /** @type {HTMLInputElement} */(
      document.getElementById('pac-input'));

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

  // setAllMap(null);
  // AllMap.geolocationUpdate();
  EventsMap.onKeyEnteredRegistration();

  // $scope.$on( "$ionicView.enter", function( scopes, states ) {
  //   // google.maps.event.trigger( Map.map, 'resize' );
  //   if ($cookieStore.get('userloc')) {
  //     AllMap.geolocationCallbackQuery($cookieStore.get('userloc'));
  //   } else {
  //     AllMap.getLocation();
  //   }
  // });

  // var geocode = function() {
  //   geocoder = new google.maps.Geocoder();
  //   google.maps.event.addListener(AllMap.map, 'dragend', function() {
  //     geocoder.geocode({'latLng': AllMap.map.getCenter()}, function(results, status) {
  //       if (status == google.maps.GeocoderStatus.OK) {
  //         $scope.reverseAddress = results[0].formatted_address;
  //         $cookieStore.put("addressBox", $scope.reverseAddress)
  //         $scope.$apply();
  //       } else {
  //         alert("Geocoder failed due to: " + status);
  //       }
  //     })
  //   })
  // };

  // puts a marker on the center of the map to capture the location of a new event
  // $scope.createEvent = function() {

  //   angular.element('#pac-input').slideDown();

  //   $('<div/>').addClass('centerMarker').appendTo(map.getDiv())
  //   .click(function(){
  //     $cookieStore.put('eventLoc', map.getCenter());
  //     $state.transitionTo('createEvent');
  //   });
  //   geocode();
  // };

  $scope.cancelCreateEvent = function() {
    angular.element('.centerMarker').remove();
    angular.element('#pac-input').slideUp();
  };


})

.factory('EventsMap', function ($q, $location, $window, $rootScope, $cookieStore, $state, $firebase, $cordovaGeolocation) {


  var markers =[];

  var clearMarkers = function(array) {
    for (var i = 0; i < markers.length; i++) {
      array[i].setMap(null);
    }
  }




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
    console.log('throw a marker!')

    $('<div/>').addClass('centerMarker').appendTo(map.getDiv())
    .click(function(){
      $cookieStore.put('eventLoc', Map.map.getCenter());
      $state.transitionTo('createEvent');
    });
    geocode();
  };

  // var autocomplete = new google.maps.places.Autocomplete(input);
  // autocomplete.bindTo('bounds', map);
  // var infowindow = new google.maps.InfoWindow();
  // var locationBoxMarker = new google.maps.Marker({
  //   map: map,
  //   anchorPoint: new google.maps.Point(0, -29)
  // });

  // google.maps.event.addListener(autocomplete, 'place_changed', function() {
  //   infowindow.close();
  //   locationBoxMarker.setVisible(false);
  //   var place = autocomplete.getPlace();
  //   if (!place.geometry) {
  //     return;
  //   }

  //   // If the place has a geometry, then present it on a map.
  //   if (place.geometry.viewport) {
  //     map.fitBounds(place.geometry.viewport);
  //   } else {
  //     map.setCenter(place.geometry.location);
  //     map.setZoom(17);  // Why 17? Because it looks good.
  //   }
  //   locationBoxMarker.setIcon(/** @type {google.maps.Icon} */({
  //     url: place.icon,
  //     size: new google.maps.Size(71, 71),
  //     origin: new google.maps.Point(0, 0),
  //     anchor: new google.maps.Point(17, 34),
  //     scaledSize: new google.maps.Size(35, 35)
  //   }));
  //   locationBoxMarker.setPosition(place.geometry.location);
  //   locationBoxMarker.setVisible(true);

  //   var address = '';
  //   if (place.address_components) {
  //     address = [
  //       (place.address_components[0] && place.address_components[0].short_name || ''),
  //       (place.address_components[1] && place.address_components[1].short_name || ''),
  //       (place.address_components[2] && place.address_components[2].short_name || '')
  //     ].join(' ');
  //   }

  //   infowindow.setContent('<div><strong>' + place.name + '</strong><br>' + address);
  //   infowindow.open(map, locationBoxMarker);
  //   $cookieStore.put('addressBox', address);
  // });

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
          // var ref = new Firebase("https://boiling-torch-2747.firebaseio.com/");
          // var id = ref.child("/curr/locations");
          // var geoFire = new GeoFire(id);
          geoFire.remove(key);
            // get list of event's attendees
            var sync = $firebase(id.child("/attendees"));
            var attendeeObj = sync.$asObject();
            attendeeObj.$loaded().then(function() {
          });
        }
      });
      console.log(key + " entered the query. Hi " + key + " at " + location);
    });
    console.log("Retrieved user's location: [" + latitude + ", " + longitude + "]");
  };

  return {
    markers: markers,
    clearMarkers: clearMarkers,
    onKeyEnteredRegistration: onKeyEnteredRegistration
  }

});
