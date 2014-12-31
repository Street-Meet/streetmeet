angular.module('sm-meetApp.createEvents',  ["firebase", 'ngCookies'])

.controller('CreateEventsCtrl', function($scope, $firebase, $cookieStore, EventCreator) {
   angular.extend($scope, EventCreator);
   $scope.createEvent = function(eventTitle, eventDescription, eventCapacity, eventCategory, eventMinCapacity){

     EventCreator.createEvent($cookieStore.get('currentUser'), eventTitle, eventDescription, eventCapacity, eventCategory, eventMinCapacity);
   }; 


})
.factory('EventCreator', function ($q) {
    var ref = new Firebase("https://boiling-torch-2747.firebaseio.com/");
    var createEvent = function(owner ,eventTitle, eventDescription, eventCapacity, eventCategory, eventMinCapacity){
        var eventData ={
            user: owner,
            title: eventTitle,
            description: eventDescription,
            capacity: eventCapacity,
            category: eventCategory,
            min_capacity: eventMinCapacity
        };
       var id = ref.child("/events").push();
        id.set(eventData, function(error) {
          if (error) {
            alert("Data could not be saved." + error);
          } else {
            var name = id.key();
            ref.child("/users/" + eventData.user + "/events/" + name).set(true);
            alert("Data saved successfully.");
          }
        });
    };
    return{
       createEvent: createEvent
  };
 });
