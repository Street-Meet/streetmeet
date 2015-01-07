angular.module('sm-meetApp.createEvents',  ["firebase", 'ngCookies'])

.controller('CreateEventsCtrl', function($scope, $firebase, $cookieStore, EventCreator) {
   angular.extend($scope, EventCreator);
   $scope.createEvent = function(eventTitle, eventDescription, eventCapacity){

     EventCreator.createEvent($cookieStore.get('currentUser'), eventTitle, eventDescription, eventCapacity);
   };


})
.factory('EventCreator', function ($q, $cookieStore) {
  var ref = new Firebase("https://boiling-torch-2747.firebaseio.com/current");
  var locRef = ref.child("/locations");
  var geoFire = new GeoFire(locRef);
  var createEvent = function(owner, eventTitle, eventDescription, eventCapacity) {
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
        id.child("owner/"+owner).set(true);
        alert("Data saved successfully.");
      }
    });
    geoFire.set(id.key(), [$cookieStore.get('eventLoc').k, $cookieStore.get('eventLoc').D]).then(function() {
        console.log("Provided key has been added to GeoFire");
      }, function(error) {
        console.log("Error: " + error);
      });
  }
  return{
    createEvent: createEvent
  };
 });
