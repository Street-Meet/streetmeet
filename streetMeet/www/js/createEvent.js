angular.module('sm-meetApp.createEvents',  ["firebase", 'ngCookies'])

.controller('CreateEventsCtrl', function($scope, $firebase, $cookieStore, Events) {
    angular.extend($scope, Events);

   $scope.createEvent = function(eventTitle, eventDescription, eventCapacity, eventCategory, eventMinCapacity){
    Events.createEvent($cookieStore.get('currentUser'), eventTitle, eventDescription, eventCapacity, eventCategory, eventMinCapacity);
  }


})
.factory('Events', function ($q) {
  var ref = new Firebase("https://boiling-torch-2747.firebaseio.com/");
  var createEvent = function(owner ,eventTitle, eventDescription, eventCapacity, eventCategory, eventMinCapacity){
    var eventData ={
      user_id: owner,
      title: eventTitle,
      description: eventDescription,
      capacity: eventCapacity,
      category: eventCategory,
      min_capacity: eventMinCapacity
    };
    var eventsRef = ref.child("events");
    eventsRef.push(eventData, function(error) {
      if (error) {
        alert("Data could not be saved." + error);
      } else {
        alert("Data saved successfully.");
      }
    });
  };
  return{
     createEvent: createEvent
  };
 });
