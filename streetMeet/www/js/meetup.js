angular.module('sm-meetApp.meetup',  ["firebase"])

.controller('MeetupCtrl', ["$scope", "$firebase", 'Meetup', function($scope, $firebase, Meetup) {
  $scope.feed;

   $scope.token =  $cookieStore.get('token');

   $scope.getthefeed = function(){
       Feed.get($cookieStore.get('token'))
       .then(function(data){
        $scope.feed = data.data;
       });
   };

}])
.factory("Meetup", ["$FirebaseArray", "$firebase", function($FirebaseArray, $firebase) {

    return {
      get : function(theToken) {
          return $http.get('/auth/getthefeed/' + theToken)
          .success(function(data) {
          })
          .error(function(data) {
              console.error('Error: ' , data);
          });
      }
    }



}]);
