angular.module('sm-meetApp.createEvents',  ["firebase", 'ngCookies'])

.controller('CreateEventsCtrl', function($scope, $firebase, $cookieStore, EventCreator) {
   angular.extend($scope, EventCreator);

})
.factory('EventCreator', function ($q, $cookieStore, $state) {
  var ref = new Firebase("https://boiling-torch-2747.firebaseio.com/current");
  var locRef = ref.child("/locations");
  var geoFire = new GeoFire(locRef);
  var createEvent = function(eventTitle, eventDescription, eventCapacity) {
    owner = $cookieStore.get('currentUser');
    var userRef = new Firebase("https://boiling-torch-2747.firebaseio.com/users/"+owner);
    var eventData ={
      title: eventTitle,
      description: eventDescription,
      capacity: eventCapacity,
      createdAt: Date.now()
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
            $state.go('viewSingleEvent', {id: id.key()})
            console.log("Owner data saved successfully.");
          }
        });
      }
    });
    geoFire.set(id.key(), [$cookieStore.get('eventLoc').k, $cookieStore.get('eventLoc').D]).then(function() {
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


  }
  return{
    createEvent: createEvent
  };
 });
