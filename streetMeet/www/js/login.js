angular.module('sm-meetApp.login',  ['firebase', 'ngCookies'])

.controller('LoginCtrl', ["$scope",  "$firebaseAuth", "$cookieStore", 'Auth', 
  function($scope, $firebaseAuth, $cookieStore, Auth) {
    $scope.currentUser =  $cookieStore.get('currentData') || null;
    $scope.currentUserId =  $cookieStore.get('currentUser') || null; 
    $scope.theEvents;
    var ref = new Firebase("https://boiling-torch-2747.firebaseio.com/");
    var auth = $firebaseAuth(ref);

    $scope.simpleLogin = function(theEmail, thePass){
      auth.$authWithPassword({
        email: theEmail,
        password: thePass
      }).then(function(authData) {

        console.log("Logged in as:", authData.uid);
      }).catch(function(error) {
        console.error("Authentication failed:", error);
      });
    };

    $scope.loginWithFacebook = function(){
    auth.$authWithOAuthPopup("facebook",
      {scope: "email, user_events" }) // scope has the permissions requested
    .then(function(authData) {
      console.log('this is the authData: ', authData);
        $cookieStore.put('currentUser', authData.uid );
        $cookieStore.put('currentToken', authData.token );
        $cookieStore.put('currentData', authData.facebook.cachedUserProfile );
        
        console.log("Logged in as:", authData.uid);
        $scope.currentUser = authData.facebook.cachedUserProfile;
        $scope.currentUserId = authData;
      }).catch(function(error) {
        console.error("Authentication failed:", error);
      });
    };

    $scope.loginWithMeetup = function(){
       Auth.connectMeetup()
       .then(function(data){
        console.log('MeetupData:', data);
        $cookieStore.put('meetupCode', data)
       }).catch(function(error) {
        console.error("Authentication failed:", error);
      });
    };


    $scope.getSpecificEvent = function(event_id){
     //location for any given event
      
      var locationRef = new Firebase("https://boiling-torch-2747.firebaseio.com/locations");
      var eventRef =  new Firebase("https://boiling-torch-2747.firebaseio.com/events");
      var eventLocationRef = eventRef.child(event_id).child("locations")  ;
     

      eventLocationRef.on("child_added", function(snap) {
        locationRef.child(snap.key()).once("value", function(){
          // Render the location on the events page.
        }) 
      });
      };

    $scope.getMyEvents = function(user_id){
        //events for any given user
        console.log('the user id passed is :'+ user_id);
      var eventsRef = new Firebase("https://boiling-torch-2747.firebaseio.com/events");
      var userRef =   new Firebase("https://boiling-torch-2747.firebaseio.com/users");
      var userEventsRef = userRef.child(user_id).child("events");
      var result = [];
      userEventsRef.on("child_added", function(snap) {
        console.log('this is the snap:', snap.val());
      eventsRef.child(snap.key()).on("value", function(data) {
          result.push(data.val());
          
          
        })
      $scope.theEvents = result;
      });
     
  };
  $scope.logout = function(){
      auth.$unauth();
      $cookieStore.remove('currentData')
      $cookieStore.remove('currentUser')
      $cookieStore.remove('currentToken');
  }
}])
.factory('Auth', ['$http', '$q', function($http, $q) {
     // call to get all nerds
  return {
    connectMeetup : function() {
        return $http.get('/api/meetup/')
        .success(function(data) {
            console.log(data);
        })
        .error(function(data) {
            console.log('Error: ' , data);
        });
    }
  }

  }]);
  //TODO: CurrentUser as a service for every other view who wants to use it.




