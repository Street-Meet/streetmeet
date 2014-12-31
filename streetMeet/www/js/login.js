angular.module('sm-meetApp.login',  ['firebase', 'ngCookies'])

.controller('LoginCtrl', ["$scope",  "$firebaseAuth", "$cookieStore",
  function($scope, $firebaseAuth, $cookieStore) {
    $scope.currentUser;
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
        console.log("Logged in as:", authData.uid);
        $scope.currentUser = authData.facebook.cachedUserProfile;
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
      var eventsRef = new Firebase("https://boiling-torch-2747.firebaseio.com/events");
      var userRef =  new Firebase("https://boiling-torch-2747.firebaseio.com/users");
      var userEventsRef = userRef.child(user_id).child("events");
      userEventsRef.on("child_added", function(snap) {
        eventsRef.child(snap.key()).once("value", function() {
          // Render the event on the user page.
        })
      });
     
  };
}

]);



