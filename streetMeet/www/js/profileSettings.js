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
    $scope.email = $scope.userData.email;
  });

  $scope.save = function(permanent, edit) {
    // if (permanent === 'name') {
    //   $scope.userData[permanent] = edit;
    // } else {

    // }
  }

});
