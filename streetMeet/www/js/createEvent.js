angular.module('sm-meetApp.createEvents',  ["firebase", 'ngCookies'])

.controller('CreateEventsCtrl', function($scope, $firebase, $cookieStore, EventCreator, $state) {
   angular.extend($scope, EventCreator);
   $scope.eventAddress = $cookieStore.get('addressBox');
   $scope.timerRunning = true;

   var ref = new Firebase("https://boiling-torch-2747.firebaseio.com");
   var locRef = new Firebase("https://boiling-torch-2747.firebaseio.com/curr/locations");
   var currGeoFire = new GeoFire(locRef);
   var archRef = new Firebase("https://boiling-torch-2747.firebaseio.com/archived/locations");
   var archGeoFire = new GeoFire(archRef);
   $scope.createEvent = function(eventTitle, eventDescription, eventCapacity, eventAddress) {
     owner = $cookieStore.get('currentUser');
     var eventTime = moment().add(22, 'minutes').calendar();
     var userRef = new Firebase("https://boiling-torch-2747.firebaseio.com/users/" + owner);
     var eventData = {
       title: eventTitle,
       description: eventDescription,
       capacity: eventCapacity,
       address: eventAddress,
       createdAt: Date.now(),
       timeLeft: eventTime
     };

     var id = ref.child("/events").push();

     id.set(eventData, function(error) {
       if (error) {
         alert("Data could not be saved." + error);
       } else {
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
         console.error(error);
       });
     archGeoFire.set(id.key(), [$cookieStore.get('eventLoc').k, $cookieStore.get('eventLoc').D]).then(function() {
       }, function(error) {
         console.error(error);
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
   removeCookie = function() {
     $cookieStore.remove("addressBox");
   }
})
.factory('EventCreator', function ($q, $cookieStore, $state) {

  return{
    // createEvent: createEvent,
    // removeCookie: removeCookie
  };
 });
