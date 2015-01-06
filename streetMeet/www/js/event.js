angular.module('sm-meetApp.event',  ["firebase", 'ngCookies'])

.controller('EventCtrl', function($scope, $firebase, $cookieStore, $state) {
  // angular.extend($scope, Event);
  var refEvent = new Firebase("https://boiling-torch-2747.firebaseio.com/events/"+$state.params.id);
  refEvent.on('value', function(snap) {
    // check to see if is a valid key, otherwise reroute
    $scope.eventData = snap.val();
    console.log($scope.eventData);
  })
});

// .factory('Event', function ($q, $cookieStore, $state) {
//   return{
//   };
//  });
