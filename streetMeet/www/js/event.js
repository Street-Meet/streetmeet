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
  $scope.update();

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
  }

  // user leaves an event
  $scope.leaveEvent =function() {
    var ownerRef = new Firebase("https://boiling-torch-2747.firebaseio.com/events/"+$state.params.id +"/owner");
    var ownerSync = $firebase(ownerRef);
    ownerObj = ownerSync.$asObject();
    ownerObj.$loaded().then(function() {
      $q(function(resolve, reject) {
        var ref = new Firebase("https://boiling-torch-2747.firebaseio.com/events/"+$state.params.id+"/attendees/"+$cookieStore.get('currentUser'));
        var userRef = new Firebase("https://boiling-torch-2747.firebaseio.com/users/"+$cookieStore.get('currentUser'));
        ref.set(false, function(error) {
          if (error) {
            alert("Data could not be saved." + error);
            reject('rejected');
          } else {
            userRef.child("/currentEvent/").remove();
            // $scope.update();
            resolve('resolved');
          }
        });
      })
      .then(function() {
        angular.forEach(ownerObj, function (value, key) {
          if (key === $cookieStore.get('currentUser') && value === true) {
            ownerRef.child(key).set(false, function(error) {
              if (error) {
                alert("Data could not be saved." + error);
              } else {
                $q(function(resolve, reject) {
                  $scope.update();
                  resolve();
                }).then(function() {
                  $state.transitionTo('mapCurrentEvents', {
                    reload: true,
                    inherit: false,
                    notify: false
                  });
                })
              }
            });
          } else {
            $q(function(resolve, reject) {
              $scope.update();
              resolve();
            }).then(function() {
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
      });
    });
  }
})

.factory('Event', function ($q, $cookieStore, $state, $firebase) {
  return {
  };
 });
