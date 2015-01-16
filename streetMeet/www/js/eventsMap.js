angular.module('sm-meetApp.eventsMap',  ['firebase', 'ngCordova', 'ngCookies'])

.controller('EventsMapCtrl', function($scope, $firebase, $q, EventsMap, $cookieStore, $state, $cordovaGeolocation, AllMap) {

  angular.extend($scope, EventsMap);
  angular.extend($scope, AllMap);


  AllMap.initialize();
  // AllMap.onKeyEnteredRegistration();
  // $scope.reverseAddress = $cookieStore.put("addressBox");
  // var geocode = function() {
  //   geocoder = new google.maps.Geocoder();
  //   // var map = $cookies.map;
  //   console.log(map);
  //   google.maps.event.addListener(map, 'dragend', function() {
  //     geocoder.geocode({'latLng': map.getCenter()}, function(results, status) {
  //       if (status == google.maps.GeocoderStatus.OK) {
  //         console.log('works?')
  //         reverseAddress = results[0].formatted_address;
  //         $cookieStore.put("addressBox", reverseAddress)
  //         $rootScope.$apply();
  //       } else {
  //         alert("Geocoder failed due to: " + status);
  //       }
  //     })
  //   })
  // };

  // $scope.createEventMarker = function() {
  //   angular.element('#pac-input').slideDown();
  //   console.log('throw a marker!')

  //   $('<div/>').addClass('centerMarker').appendTo($('#map-canvas'))
  //   .click(function(){
  //     $cookieStore.put('eventLoc', map.getCenter());
  //     $state.transitionTo('createEvent');
  //   });
  //   geocode();




})

.factory('EventsMap', function ($q, $location, $window, $rootScope, $cookieStore, $state, $firebase, $cordovaGeolocation, $cookies) {


  var markers =[];


  var clearMarkers = function(array) {
    for (var i = 0; i < markers.length; i++) {
      array[i].setMap(null);
    }
  }





  return {
    markers: markers,
    clearMarkers: clearMarkers,

  }

});
