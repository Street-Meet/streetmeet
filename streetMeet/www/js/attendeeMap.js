angular.module('sm-meetApp.attendeeMap',  ['firebase', 'ngCordova'])

.controller('AttendeeMapCtrl', function($scope, $firebase, AttendeeMap, $cookieStore, $state, $cordovaGeolocation, AllMap) {

  angular.extend($scope, AttendeeMap);
  angular.extend($scope, AllMap);

  AllMap.initialize();

  // setAllMap(null);
  // AllMap.geolocationUpdate();
  AllMap.vergingDisplay();


})

.factory('AttendeeMap', function ($q, $location, $window, $rootScope, $cookieStore, $state, $firebase, $cordovaGeolocation) {
  var markers =[];



  return {
    // map: map,
    // markers: markers,
    // clearMarkers: clearMarkers,
    // vergingDisplay: vergingDisplay
  }

});
