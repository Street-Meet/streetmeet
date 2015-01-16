angular.module('sm-meetApp.profileSettings',  ["firebase"])

.controller('ProfileSettingsCtrl', function($scope, $firebase, $cookieStore, $state, $q) {
  var refUser = new Firebase("https://boiling-torch-2747.firebaseio.com/users/"+$state.params.id+"/userInfo");
  var userSync = $firebase(refUser);
  var userObj = userSync.$asObject();
  userObj.$loaded().then(function() {
    userObj.$bindTo($scope, "userData").then(function() {
    });
  }).then(function() {
    $scope.name = $scope.userData.display_name;
    $scope.userEmail = $scope.userData.email;
    console.log($scope.userEmail);
  });

  $scope.save = function(permanent, edit) {
    $scope.userData[permanent] = edit;
  }

});
