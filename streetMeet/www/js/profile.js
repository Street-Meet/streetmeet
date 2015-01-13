angular.module('sm-meetApp.profile',  ["firebase", 'ngCookies'])

.controller('SettingsCtrl', function($scope, $firebase, $cookieStore, $state) {

  // $scope.currentUser = {
  //   name : 'Rick Takes',
  //   profilePic: 'https://fbcdn-profile-a.akamaihd.net/hprofile-ak-xap1/v/t1.0-1/p100x100/972233_10200304680672854_124393775_n.jpg?oh=3eabc63b721b0b5ba810f6ee3736ccae&oe=54FAF8F7&__gda__=1430255957_c44d20d0502dd3228f9751cadb16b562',
  //   description: 'Some text goes here'
  // }



  var ref = new Firebase("https://boiling-torch-2747.firebaseio.com/");

  var userObj = $firebase(ref.child("/users/"+$state.params.id+"/userInfo")).$asObject();
  // grab user info to later display for each attendee
  userObj.$loaded().then(function() {
    console.log(userObj);
    $scope.profile = userObj;
  });


});
