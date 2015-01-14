angular.module('sm-meetApp.currentUser',  ["firebase", 'ngCookies'])

.controller('currentUser', function($scope, $firebase, $cookieStore) {
  
  $scope.currentUser = {
    name : 'Rick Takes',
    profilePic: 'https://fbcdn-profile-a.akamaihd.net/hprofile-ak-xap1/v/t1.0-1/p100x100/972233_10200304680672854_124393775_n.jpg?oh=3eabc63b721b0b5ba810f6ee3736ccae&oe=54FAF8F7&__gda__=1430255957_c44d20d0502dd3228f9751cadb16b562',
    description: 'Some text goes here'
  }

  $scope.list = [
    {
      description : 'description',
      title: 'title'
    },

    {
      description : 'description',
      title: 'title'
    }



  ]


});
