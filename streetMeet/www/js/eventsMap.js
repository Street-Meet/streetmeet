angular.module('sm-meetApp.eventsMap',  ['firebase', 'ngCordova', 'ngCookies'])

.controller('EventsMapCtrl', function($scope, $firebase, $q, EventsMap, $cookieStore, $state, $cordovaGeolocation, AllMap) {

  angular.extend($scope, EventsMap);
  angular.extend($scope, AllMap);
  AllMap.initialize();
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
