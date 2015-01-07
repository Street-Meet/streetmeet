angular.module('sm-meetApp.event',  ["firebase", 'ngCookies'])

.controller('EventCtrl', function($scope, $firebase, $cookieStore, $state, Event) {
  angular.extend($scope, Event);
  var refEvent = new Firebase("https://boiling-torch-2747.firebaseio.com/current/events/"+$state.params.id);
  refEvent.on('value', function(snap) {
    // check to see if is a valid key, otherwise reroute
    $scope.eventData = snap.val();
    console.log($scope.eventData);
  })
})

.factory('Event', function ($q, $cookieStore, $state) {
  var joinEvent = function() {
    var ref = new Firebase("https://boiling-torch-2747.firebaseio.com/current/events/"+$state.params.id+"/attendees/"+$cookieStore.get('currentUser'));
    var userRef = new Firebase("https://boiling-torch-2747.firebaseio.com/users/"+$cookieStore.get('currentUser'));
    ref.set(true, function(error) {
      if (error) {
        alert("Data could not be saved." + error);
      } else {
        console.log("Attendee data saved successfully.");
      }
    });
    userRef.child("/currentEvent/").set($state.params.id, function(error) {
      if (error) {
        alert("Data could not be saved." + error);
      } else {
        console.log("Current event added to user!");
      }
    });
    userRef.child("/pastEvents/" + $state.params.id).set(true, function(error) {
      if (error) {
        alert("Data could not be saved." + error);
      } else {
        console.log("Current event added to user!");
      }
    });
  }
  return{
    joinEvent : joinEvent
  };
 });
