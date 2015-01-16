angular.module('sm-meetApp.event',  ["firebase", 'ngCookies'])

.controller('EventCtrl', function($scope, $firebase, $cookieStore, $state, Event, $q) {
  angular.extend($scope, Event);
  var refEvent = new Firebase("https://boiling-torch-2747.firebaseio.com/events/"+$state.params.id);
  var eventSync = $firebase(refEvent);
  var eventObj = eventSync.$asObject();
  eventObj.$loaded().then(function() {
    eventObj.$bindTo($scope, "eventData").then(function() {
    })
  });

  var result = {};
  var refAttendees = new Firebase("https://boiling-torch-2747.firebaseio.com/events/"+$state.params.id+"/attendees");
  var ref = new Firebase("https://boiling-torch-2747.firebaseio.com/");
  var id = ref.child("/users/");

  $scope.update = function() {
    var attendeeObj = $firebase(refAttendees).$asObject();
    attendeeObj.$loaded().then(function() {
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
    // logic for determining if the user is an owner, not attending or attending an event
    var ownerRef = new Firebase("https://boiling-torch-2747.firebaseio.com/events/"+$state.params.id +"/owner");
    $scope.initial = true;
    $scope.owner = false;
    $scope.leaver = false;
    $scope.joiner = false;
    var ownerSync = $firebase(ownerRef);
    ownerObj = ownerSync.$asObject();
    ownerObj.$loaded().then(function() {
      angular.forEach(ownerObj, function (value, key) {
        if (key === $cookieStore.get('currentUser') && value === true) {
          $scope.owner = value;
          $scope.initial = false;
        } else {
          var userRef = new Firebase("https://boiling-torch-2747.firebaseio.com/users/"+$cookieStore.get('currentUser')+"/currentEvent");
          var userSync = $firebase(userRef);
          var userObj = userSync.$asObject();
          userObj.$loaded().then(function() {
            $scope.leaver = userObj.$value;
            $scope.joiner = !$scope.leaver;
            $scope.initial = false;
          });
        }
      });
    });
  }
  $scope.$on('$ionicView.enter', function() {
    $scope.update();
  });

  // user joins an event
  $scope.joinEvent =function() {
    var ref = new Firebase("https://boiling-torch-2747.firebaseio.com/events/"+$state.params.id+"/attendees/"+$cookieStore.get('currentUser'));
    var userRef = new Firebase("https://boiling-torch-2747.firebaseio.com/users/"+$cookieStore.get('currentUser'));
    ref.set(true, function(error) {
      if (error) {
        alert("Data could not be saved." + error);
      } else {
        $scope.update();
      }
    });
    userRef.child("/currentEvent/").set($state.params.id, function(error) {
      if (error) {
        alert("Data could not be saved." + error);
      }
    });
    userRef.child("/pastEvents/" + $state.params.id).set(true, function(error) {
      if (error) {
        alert("Data could not be saved." + error);
      }
    });
    $cookieStore.put('eventStatus', $state.params.id);
  }

  var transitionToMap = function() {
    $scope.owner = false;
    $scope.leaver = false;
    $scope.joiner = true;
    $state.transitionTo('map', {
      reload: true,
      inherit: false,
      notify: true
    });
  }

  $scope.leaveEvent =function() {
      // console.log('leaving event')
      // event owner
      var ownerRef = new Firebase("https://boiling-torch-2747.firebaseio.com/events/"+$state.params.id +"/owner");
      var ownerSync = $firebase(ownerRef);
      ownerObj = ownerSync.$asObject();
      ownerObj.$loaded().then(function() {
        // console.log('pre-promise');
        $q(function(resolve, reject) {
          // console.log('in promise');
          var ref = new Firebase("https://boiling-torch-2747.firebaseio.com/events/"+$state.params.id+"/attendees/"+$cookieStore.get('currentUser'));
          var userRef = new Firebase("https://boiling-torch-2747.firebaseio.com/users/"+$cookieStore.get('currentUser'));
          // marks user as left in attendee list
          ref.set(false, function(error) {
            if (error) {
              alert("Data could not be saved." + error);
              reject('rejected');
            } else {
              console.log("Attendee data saved successfully.");
              // removes user's current event
              userRef.child("/currentEvent/").remove();
              // $scope.update();
              resolve('resolved');
            }
          });
        })
        .then(function() {
          angular.forEach(ownerObj, function (value, key) {
            // console.log('in forEach');
            // console.log(key, value);
            // console.log($cookieStore.get('currentUser'));
            // if user is event owner
            if (key === $cookieStore.get('currentUser') && value === true) {
              // console.log('in if')
              // removes current ownership from user
              console.log(key);
              ownerRef.child(key).set(false, function(error) {
                if (error) {
                  console.log('rejection')
                  alert("Data could not be saved." + error);
                } else {
                  // console.log('transitioning');
                  console.log("Owner data saved successfully.");

                  transitionToMap();
                  // console.log('in promise');
                }
              });
            } else {
              // console.log('transitioning');
              transitionToMap();
            }
          });
          // console.log('after promise');
        });
      });
    }
  })


.factory('Event', function ($q, $cookieStore, $state, $firebase) {
  return {
  };
 });
//
