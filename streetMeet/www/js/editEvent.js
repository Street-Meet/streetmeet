angular.module('sm-meetApp.editEvent',  ["firebase"])

.controller('EditEventCtrl', function($scope, $firebase, $cookieStore, $state, $q) {
  var refEvent = new Firebase("https://boiling-torch-2747.firebaseio.com/events/"+$state.params.id);
  var eventSync = $firebase(refEvent);
  var eventObj = eventSync.$asObject();
  eventObj.$loaded().then(function() {
    eventObj.$bindTo($scope, "eventData").then(function() {
    });
  }).then(function() {
    $scope.eventTitle = $scope.eventData.title;
    $scope.eventDescription = $scope.eventData.description;
    $scope.eventCapacity = $scope.eventData.capacity;
    $scope.eventAddress = $scope.eventData.address;
  });

  $scope.save = function(permanent, edit) {
    $scope.eventData[permanent] = edit;
  }

});
