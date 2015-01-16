angular.module('sm-meetApp.login',  ['firebase', 'ngCookies', 'ngCordova','ionic.utils'])



.controller('LoginCtrl', ["$scope",  "$firebaseAuth", "$cookieStore", "$state", "$q", "Login",
  function($scope, $firebaseAuth, $cookieStore, $state, $q, Login) {
    $scope.currentUser =  $cookieStore.get('currentData') || null;
    $scope.currentUserId =  $cookieStore.get('currentUser') || null;
    $scope.theEvents;

    Login.getLocation();


    var ref = new Firebase("https://boiling-torch-2747.firebaseio.com/");
    var auth = $firebaseAuth(ref);
    $scope.simpleLogin = function(theEmail, thePass){
      auth.$authWithPassword({
        email: theEmail,
        password: thePass
      }).then(function(authData) {
        $cookieStore.put('currentUser', authData.uid );
        $state.transitionTo('mapCurrentEvents');
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
          } else {
            console.error("Error!", error);
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
          ref.child("display_name").set(authData.facebook.cachedUserProfile.first_name, function(error) {
            if (error) {
              console.log('error setting display name!');
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
          $state.transitionTo('map');
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
      var userRef =   new Firebase("https://boiling-torch-2747.firebaseio.com/users");
      var userEventsRef = userRef.child(user_id).child("events");
      var result = [];
      userEventsRef.on("child_added", function(snap) {
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

.factory('Login', function ($q, $location, $window, $rootScope, $cookieStore, $state, $firebase, $cordovaGeolocation) {
  var getLocation = function() {
    var app = document.URL.indexOf( 'http://' ) === -1 && document.URL.indexOf( 'https://' ) === -1;
    if ( app ) {
        // PhoneGap application
        return $cordovaGeolocation
        .getCurrentPosition(posOptions)
        .then(function (position) {
         geolocationCallbackQuery(position);
        });
    } else {
      // Web page
      if (typeof navigator !== "undefined" && typeof navigator.geolocation !== "undefined") {
        console.log("Asking user to get their location");
        navigator.geolocation.getCurrentPosition(geolocationCallbackQuery, errorHandler, {timeout:10000});
      } else {
        console.log("Your browser does not support the HTML5 Geolocation API");
      }
    }
  };

  var geolocationCallbackQuery = function(location) {
    var latitude = location.coords.latitude;
    var longitude = location.coords.longitude;
    $cookieStore.put('userloc', location);
  }

  var errorHandler = function(error) {
    if (error.code == 1) {
      console.log("Error: PERMISSION_DENIED: User denied access to their location");
    } else if (error.code === 2) {
      console.log("Error: POSITION_UNAVAILABLE: Network is down or positioning satellites cannot be reached");
    } else if (error.code === 3) {
      console.log("Error: TIMEOUT: Calculating the user's location too took long");
      geolocationCallbackQuery($cookieStore.get('userloc'));
    } else {
      console.log("Unexpected error code")
    }
  };
  return {
    getLocation: getLocation
  }
});
