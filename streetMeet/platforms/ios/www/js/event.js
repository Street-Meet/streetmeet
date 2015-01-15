angular.module('sm-meetApp.event',  ["firebase", 'ngCookies'])

.controller('EventCtrl', function($scope, $firebase, $cookieStore, $state, Event, $q) {
  angular.extend($scope, Event);
  var refEvent = new Firebase("https://boiling-torch-2747.firebaseio.com/events/"+$state.params.id);
  var eventSync = $firebase(refEvent);
  var eventObj = eventSync.$asObject();
  eventObj.$loaded().then(function() {
    console.log(eventObj);
    eventObj.$bindTo($scope, "eventData").then(function() {
      console.log($scope.eventData);
    })
  });

  var result = {};

  var refAttendees = new Firebase("https://boiling-torch-2747.firebaseio.com/events/"+$state.params.id+"/attendees");
  var ref = new Firebase("https://boiling-torch-2747.firebaseio.com/");
  var id = ref.child("/users/");

  $scope.refreshData = function() {
    $q(function(resolve, reject) {
      $state.transitionTo('mapCurrentEvents', {
        reload: true,
        inherit: false,
        notify: true
      });
      resolve();
    }).then(function() {
      window.location.reload(true);
    })
  }

  // list of attendees
  $scope.update = function() {
    console.log('UPDATING')
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
            console.log(userObj);
          });
        }
      });
    });
    console.log('UPDATING2')
    // logic for determining if the user is an owner, not attending or attending an event
    var ownerRef = new Firebase("https://boiling-torch-2747.firebaseio.com/events/"+$state.params.id +"/owner");
    console.log($state.params.id);
    $scope.initial = true;
    $scope.owner = false;
    $scope.leaver = false;
    $scope.joiner = false;
    var ownerSync = $firebase(ownerRef);
    ownerObj = ownerSync.$asObject();
    ownerObj.$loaded().then(function() {
      console.log('UPDATING3')
      angular.forEach(ownerObj, function (value, key) {
        if (key === $cookieStore.get('currentUser') && value === true) {
          console.log(value);
          $scope.owner = value;
          $scope.initial = false;
        } else {
          var userRef = new Firebase("https://boiling-torch-2747.firebaseio.com/users/"+$cookieStore.get('currentUser')+"/currentEvent");
          var userSync = $firebase(userRef);
          var userObj = userSync.$asObject();
          userObj.$loaded().then(function() {
            console.log(userObj.$value);
            $scope.leaver = userObj.$value;
            $scope.joiner = !$scope.leaver;
            $scope.initial = false;
            console.log($scope.owner);
            console.log($scope.leaver);
            console.log($scope.joiner);
          });
        }
      });
    });
  }
  $scope.update();

  // user joins an event
  $scope.joinEvent =function() {
    var ref = new Firebase("https://boiling-torch-2747.firebaseio.com/events/"+$state.params.id+"/attendees/"+$cookieStore.get('currentUser'));
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

  // user leaves an event
  $scope.leaveEvent =function() {
    console.log('leaving event')
    var ownerRef = new Firebase("https://boiling-torch-2747.firebaseio.com/events/"+$state.params.id +"/owner");
    var ownerSync = $firebase(ownerRef);
    ownerObj = ownerSync.$asObject();
    ownerObj.$loaded().then(function() {
      console.log('pre-promise');
      $q(function(resolve, reject) {
        console.log('in promise');
        var ref = new Firebase("https://boiling-torch-2747.firebaseio.com/events/"+$state.params.id+"/attendees/"+$cookieStore.get('currentUser'));
        var userRef = new Firebase("https://boiling-torch-2747.firebaseio.com/users/"+$cookieStore.get('currentUser'));
        ref.set(false, function(error) {
          if (error) {
            alert("Data could not be saved." + error);
            reject('rejected');
          } else {
            console.log("Attendee data saved successfully.");
            userRef.child("/currentEvent/").remove();
            // $scope.update();
            resolve('resolved');
          }
        });
      })
      .then(function() {
        angular.forEach(ownerObj, function (value, key) {
          console.log('in forEach')
          if (key === $cookieStore.get('currentUser') && value === true) {
            console.log('in if')
            ownerRef.child(key).set(false, function(error) {
              if (error) {
                console.log('rejection')
                alert("Data could not be saved." + error);
              } else {
                console.log(id.key());
                $q(function(resolve, reject) {
                  $scope.update();
                  resolve();
                }).then(function() {
                  console.log('transitioning');
                  $state.transitionTo('mapCurrentEvents', {
                    reload: true,
                    inherit: false,
                    notify: false
                  });
                }).then(function() {
                  window.location.reload(true);
                });
                console.log("Owner data saved successfully.");
                console.log('in promise');
              }
            });
          } else {
            $q(function(resolve, reject) {
              $scope.update();
              console.log('updating');
              resolve();
            }).then(function() {
              console.log('transitioning');
              $state.transitionTo('mapCurrentEvents', {
                reload: true,
                inherit: false,
                notify: false
              });
            }).then(function() {
              window.location.reload(true);
            });
          }
        });

        console.log('after promise');



      });
    });
  }
})

.factory('Event', function ($q, $cookieStore, $state, $firebase) {
  return {
  };
 });
