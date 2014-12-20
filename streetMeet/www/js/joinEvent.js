angular.module('sm-meetApp.joinEvent',  ["firebase"])

.controller('JoinEventCtrl', function($scope, $firebase) {
    


    var ref = new Firebase("https://boiling-torch-2747.firebaseio.com/events");
   
    $scope.getEvents = function(){
        var sync = $firebase(ref);
             // download the data into a local object
        var syncObject = sync.$asObject();
             // synchronize the object with a three-way data binding
             // click on `index.html` above to see it used in the DOM!
        syncObject.$bindTo($scope, "events");


    };

    $scope.events = syncObject;

});
