angular.module('sm-meetApp.joinEvent',  ["firebase"])

.controller('JoinEventCtrl', ["$scope", "$firebase", 'Events', function($scope, $firebase, Events) {
    // angular.extend($scope, Events);
    var ref = new Firebase("https://boiling-torch-2747.firebaseio.com/events");
   $scope.list =  Events.throwTheEvents(ref);

}])
.factory("Events", ["$FirebaseArray", "$firebase", function($FirebaseArray, $firebase) {
  
    // create a new factory based on $FirebaseArray
  var TotalEvents = $FirebaseArray.$extendFactory({
    getEvents: function() {
      return this.$list;
    }
  });

  var throwTheEvents = function(myRef){
    // override the factory used by $firebase
    var sync = $firebase(myRef, {arrayFactory: TotalEvents});
    return sync.$asArray(); // this will be an instance of TotalEvents
  };

  return {
    throwTheEvents : throwTheEvents
  };
}]);
