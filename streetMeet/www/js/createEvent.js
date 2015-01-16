angular.module('sm-meetApp.createEvents',  ["firebase", 'ngCookies'])

.controller('CreateEventsCtrl', function($scope, $firebase, $cookieStore, EventCreator, $state) {
   angular.extend($scope, EventCreator);
   $scope.eventAddress = $cookieStore.get('addressBox');
   $scope.timerRunning = true;

   // console.log($scope.eventDescription)
   // console.log($scope.eventTitle)
   // console.log($scope.eventCapacity)

   var ref = new Firebase("https://boiling-torch-2747.firebaseio.com");
   var locRef = new Firebase("https://boiling-torch-2747.firebaseio.com/curr/locations");
   var currGeoFire = new GeoFire(locRef);

   var archRef = new Firebase("https://boiling-torch-2747.firebaseio.com/archived/locations");
   var archGeoFire = new GeoFire(archRef);
   $scope.createEvent = function(eventTitle, eventDescription, eventCapacity, eventAddress) {
     // console.log($state.current.name);
     owner = $cookieStore.get('currentUser');
     var userRef = new Firebase("https://boiling-torch-2747.firebaseio.com/users/" + owner);
     var eventData = {
       title: eventTitle,
       description: eventDescription,
       capacity: eventCapacity,
       address: eventAddress,
       createdAt: Date.now(),
       timeLeft: 2000
     };

     //grab Date.now()
     //minutes remaining is the difference between 22 minutes from createdAt and Date.now();

     var timeRemaining = 2000;
     //((eventData.createdAt + 1320000) - Date.now()).toString();
     console.log("event", eventData)
     var id = ref.child("/events").push();

     id.set(eventData, function(error) {
       if (error) {
         alert("Data could not be saved." + error);
       } else {
         // add creator as attendee
         id.child("attendees/"+owner).set(true, function(error) {
           if (error) {
             alert("Data could not be saved." + error);
           } else {
             console.log("Attendee data saved successfully.");
           }
         });
         // add creator as owner
         id.child("owner/"+owner).set(true, function(error) {
           if (error) {
             alert("Data could not be saved." + error);
           } else {
             console.log(id.key());
             $state.go('attendEvent', {id: id.key()});
             console.log("Owner data saved successfully.");
           }
         });
       }
     });
     currGeoFire.set(id.key(), [$cookieStore.get('eventLoc').k, $cookieStore.get('eventLoc').D]).then(function() {
         console.log(id.key());
         console.log(currGeoFire);
         console.log("Provided key has been added to Current GeoFire");
       }, function(error) {
         console.log("Error: " + error);
       });
     archGeoFire.set(id.key(), [$cookieStore.get('eventLoc').k, $cookieStore.get('eventLoc').D]).then(function() {
         console.log("Provided key has been added to GeoFire");
       }, function(error) {
         console.log("Error: " + error);
       });
     userRef.child("/currentEvent/").set(id.key(), function(error) {
       if (error) {
         alert("Data could not be saved." + error);
       } else {
         console.log("Current event added to user!");
       }
     });
     userRef.child("/pastEvents/" + id.key()).set(true, function(error) {
       if (error) {
         alert("Data could not be saved." + error);
       } else {
         console.log("Current event added to user!");
       }
     });
     // $scope.eventTitle ='';
     // console.log($scope.eventDescription)
     // console.log($scope.eventTitle)
     // console.log($scope.eventCapacity)


     // $scope.eventDescription = '';
     // $scope.eventCapacity = '';
      // $scope.eventForm.$setPristine();
     removeCookie();
   }
   removeCookie = function() {
     $cookieStore.remove("addressBox");
   }
})
.factory('EventCreator', function ($q, $cookieStore, $state) {

<<<<<<< HEAD
  var archRef = new Firebase("https://boiling-torch-2747.firebaseio.com/archived/locations");
  var archGeoFire = new GeoFire(archRef);
  var createEvent = function(eventTitle, eventDescription, eventCapacity, eventAddress) {
    owner = $cookieStore.get('currentUser');
    var eventTime = moment().add(22, 'minutes').calendar(); 
    var userRef = new Firebase("https://boiling-torch-2747.firebaseio.com/users/" + owner);
    var eventData = {
      title: eventTitle,
      description: eventDescription,
      capacity: eventCapacity,
      address: eventAddress,
      createdAt: Date.now(),
      updatingTime: eventTime

    };
  
    var id = ref.child("/events").push();

    id.set(eventData, function(error) {
      if (error) {
        alert("Data could not be saved." + error);
      } else {
        // add creator as attendee
        id.child("attendees/"+owner).set(true, function(error) {
          if (error) {
            alert("Data could not be saved." + error);
          }
        });
        // add creator as owner
        id.child("owner/"+owner).set(true, function(error) {
          if (error) {
            alert("Data could not be saved." + error);
          } else {
            $state.go('attendEvent', {id: id.key()});
          }
        });
      }
    });
    currGeoFire.set(id.key(), [$cookieStore.get('eventLoc').k, $cookieStore.get('eventLoc').D]).then(function() {
      }, function(error) {
        console.error("Error: " + error);
      });
    archGeoFire.set(id.key(), [$cookieStore.get('eventLoc').k, $cookieStore.get('eventLoc').D]).then(function() {
      }, function(error) {
        console.error("Error: " + error);
      });
    userRef.child("/currentEvent/").set(id.key(), function(error) {
      if (error) {
        alert("Data could not be saved." + error);
      }
    });
    userRef.child("/pastEvents/" + id.key()).set(true, function(error) {
      if (error) {
        alert("Data could not be saved." + error);
      }
    });
    removeCookie();
  }
=======


>>>>>>> attempted form to reeset, didnt work, rest of app looks great

  return{
    // createEvent: createEvent,
    // removeCookie: removeCookie
  };
 });
