angular.module('sm-meetApp.meetup',  ["firebase"])

.controller('MeetupCtrl', ["$scope", "$firebase", 'Meetup', function($scope, $firebase, Meetup) {
  $scope.feed;

   $scope.token =  $cookieStore.get('token');

   $scope.getthefeed = function(){
       console.log('getting the feed');
       Feed.get($cookieStore.get('token'))
       .then(function(data){
        console.log('esto habia en el feed :', data);
        $scope.feed = data.data;
       });
   };
    






}])
.factory("Meetup", ["$FirebaseArray", "$firebase", function($FirebaseArray, $firebase) {
  
    // create a new factory based on $FirebaseArray
    return {
      get : function(theToken) {
          return $http.get('/auth/getthefeed/' + theToken)
          .success(function(data) {
              // $scope.formData = {}; // clear the form so our user is ready to enter another
              // $scope.posts = data;
              console.log(data);
          })
          .error(function(data) {
              console.log('Error: ' , data);
          });
      }
    }



}]);
