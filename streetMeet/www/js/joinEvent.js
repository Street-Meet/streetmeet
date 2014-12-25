angular.module('sm-meetApp.joinEvent',  ["firebase"])

.controller('JoinEventCtrl', ["$scope", "$firebase", function($scope, $firebase) {

  var ref = new Firebase("https://boiling-torch-2747.firebaseio.com/events");

  var ref = new Firebase("https://boiling-torch-2747.firebaseio.com/events");
  var sync = $firebase(ref);

  // if ref points to a data collection
  $scope.list = sync.$asArray();
  // $scope.events = syncObject;

}]);
