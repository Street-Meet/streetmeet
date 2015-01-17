angular.module('sm-meetApp.profile',  ["firebase", 'ngCookies'])

.controller('SettingsCtrl', function($scope, $firebase, $cookieStore, $state) {

  var ref = new Firebase("https://boiling-torch-2747.firebaseio.com/");
  var userObj = $firebase(ref.child("/users/"+$state.params.id+"/userInfo")).$asObject();
  // grab user info to later display for each attendee
  userObj.$loaded().then(function() {
    $scope.profile = userObj;
  });
  $scope.isUser = ($state.params.id === $cookieStore.get('currentUser'));
});
