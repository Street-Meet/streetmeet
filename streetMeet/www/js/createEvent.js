angular.module('sm-meetApp.createEvents',  ["firebase"])

.controller('CreateEventsCtrl', function($scope, $firebase, Events) {
    angular.extend($scope, Events);
})
.factory('Events', function ($q) {
    var ref = new Firebase("https://boiling-torch-2747.firebaseio.com/");
    var createEvent = function(eventTitle, eventDescription, eventCapacity, eventCategory, eventMinCapacity){
        //Creating the event bucket
        var eventData ={
            title: eventTitle,
            description: eventDescription,
            capacity: eventCapacity,
            category: eventCategory,
            min_capacity: eventMinCapacity
        };
        //use the events collection
        var eventsRef = ref.child("events");
        // push the bucket into the events collection
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
