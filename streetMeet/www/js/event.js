angular.module('sm-meetApp.event',  ["firebase", 'ngCookies'])

.controller('EventCtrl', function($scope, $firebase, $cookieStore, $state, Event) {
  angular.extend($scope, Event);
  var refEvent = new Firebase("https://boiling-torch-2747.firebaseio.com/current/events/"+$state.params.id);
  var eventSync = $firebase(refEvent);
  var eventObj = eventSync.$asObject();
  eventObj.$loaded().then(function() {
    console.log(eventObj);
    eventObj.$bindTo($scope, "eventData").then(function() {
      console.log($scope.eventData);
    })
  });
  // refEvent.on('value', function(snap) {
  //   // check to see if is a valid key, otherwise reroute
  //   $scope.eventData = snap.val();
  //   console.log($scope.eventData);
  // })

  var result = {};

  var refAttendees = new Firebase("https://boiling-torch-2747.firebaseio.com/current/events/"+$state.params.id+"/attendees");
  var ref = new Firebase("https://boiling-torch-2747.firebaseio.com/");
  var id = ref.child("/users/");

  // list of attendees
  var attendeeObj = $firebase(refAttendees).$asObject();
  attendeeObj.$loaded().then(function() {
    console.log("loaded record:", attendeeObj.$id);
    angular.forEach(attendeeObj, function(value, key) {
      var userObj = $firebase(ref.child("/users/"+key+"/userInfo")).$asObject();
      // grab user info to later display for each attendee
      userObj.$loaded().then(function() {
        result[key] = userObj;
        $scope.attendees = result;
      })
    });
  });

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
