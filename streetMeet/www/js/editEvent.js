angular.module('sm-meetApp.editEvent',  ["firebase"])

.controller('EditEventCtrl', function($scope, $firebase, $cookieStore, $state, $q) {
  var refEvent = new Firebase("https://boiling-torch-2747.firebaseio.com/events/"+$state.params.id);
  var eventSync = $firebase(refEvent);
  var eventObj = eventSync.$asObject();
  eventObj.$loaded().then(function() {
    console.log(eventObj);
    eventObj.$bindTo($scope, "eventData").then(function() {
      console.log($scope.eventData);
    })
  });
});
