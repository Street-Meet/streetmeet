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
  $scope.update = function() {
    var attendeeObj = $firebase(refAttendees).$asObject();
    attendeeObj.$loaded().then(function() {
      console.log("loaded record:", attendeeObj.$id);
      angular.forEach(attendeeObj, function(value, key) {
        if (value) {
          var userObj = $firebase(ref.child("/users/"+key+"/userInfo")).$asObject();
          // grab user info to later display for each attendee
          userObj.$loaded().then(function() {
            result[key] = userObj;
            $scope.attendees = result;
          });
        }
      });
    });
  }
  $scope.update();
  $scope.joinEvent =function() {
    var ref = new Firebase("https://boiling-torch-2747.firebaseio.com/current/events/"+$state.params.id+"/attendees/"+$cookieStore.get('currentUser'));
    var userRef = new Firebase("https://boiling-torch-2747.firebaseio.com/users/"+$cookieStore.get('currentUser'));
    ref.set(true, function(error) {
      if (error) {
        alert("Data could not be saved." + error);
      } else {
        console.log("Attendee data saved successfully.");
        $scope.update();
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
  $scope.leaveEvent =function() {
    var ref = new Firebase("https://boiling-torch-2747.firebaseio.com/current/events/"+$state.params.id+"/attendees/"+$cookieStore.get('currentUser'));
    var userRef = new Firebase("https://boiling-torch-2747.firebaseio.com/users/"+$cookieStore.get('currentUser'));
    ref.set(false, function(error) {
      if (error) {
        alert("Data could not be saved." + error);
      } else {
        console.log("Attendee data saved successfully.");
        $scope.update();
      }
    });
    userRef.child("/currentEvent/").remove();
  }

  var ownerRef = new Firebase("https://boiling-torch-2747.firebaseio.com/current/events/owner");
  var ownerSync = $firebase(ownerRef);

  $scope.initial = true;
  ownerObj = ownerSync.$asObject();
  ownerObj.$loaded().then(function() {
    $scope.owner = ownerObj.$value;
    console.log(ownerObj.$value);
    var userRef = new Firebase("https://boiling-torch-2747.firebaseio.com/users/"+$cookieStore.get('currentUser')+"/currentEvent");
    var userSync = $firebase(userRef);
    var userObj = userSync.$asObject();
    userObj.$loaded().then(function() {
      console.log(userObj.$value);
      $scope.leaver = userObj.$value && !$scope.owner;
      $scope.joiner = !$scope.owner && !$scope.leaver;
      $scope.initial = false;
    });
  });

})

.factory('Event', function ($q, $cookieStore, $state, $firebase) {





  return {
    // joiner: joiner,
    // owner: owner,
    // leaver: leaver
  };
 });
