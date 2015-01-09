angular.module('sm-meetApp.login',  ['firebase', 'ngCookies'])

.controller('LoginCtrl', ["$scope",  "$firebaseAuth", "$cookieStore", "$state", "$q",
  function($scope, $firebaseAuth, $cookieStore, $state, $q) {
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
        $cookieStore.put('currentUser', authData.uid );
        console.log("Logged in as:", authData.uid);
        $state.go('mapCurrentEvents');
      }).catch(function(error) {
        console.error("Authentication failed:", error);
      });
    };

    //AngularFire OAuth
    $scope.registerAccount = function(theEmail, thePass) {
      ref.createUser({
          email: theEmail,
          password: thePass
        }, function(error) {
          if(error === null) {
            $scope.simpleLogin(theEmail, thePass);
            console.log("Stored user!");
          } else {
            console.log("Error!", error);
          }
        });
    }

    $scope.loginWithFacebook = function(){
    auth.$authWithOAuthPopup("facebook",
      {scope: "email, user_events" }) // scope has the permissions requested
      .then(function(authData) {
        var ref = new Firebase("https://boiling-torch-2747.firebaseio.com/users/"+authData.uid+"/userInfo");
        ref.set(authData.facebook.cachedUserProfile, function(error) {
          if (error) {
            console.log('error setting data!');
          }
        })
        console.log('this is the authData: ', authData);

        $cookieStore.put('currentUser', authData.uid );
        $cookieStore.put('currentToken', authData.token );
        $cookieStore.put('currentData', authData.facebook.cachedUserProfile );

        console.log("Logged in as:", authData.uid);
        console.log('all of it', authData);
        $scope.currentUser = authData.facebook.cachedUserProfile;
        $scope.currentUserId = authData;
        $state.go('mapCurrentEvents');
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
}]);
  //TODO: CurrentUser as a service for every other view who wants to use it.




