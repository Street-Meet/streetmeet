angular.module('sm-meetApp.login',  ['firebase', 'ngCookies'])

.controller('LoginCtrl', ["$scope",  "$firebaseAuth", "$cookieStore", 
  function($scope, $firebaseAuth, $cookieStore) {
    
    var ref = new Firebase("https://boiling-torch-2747.firebaseio.com/");
    var auth = $firebaseAuth(ref);

    $scope.simpleLogin = function(theEmail, thePass){
      console.log('clicked Simple login');
      auth.$authWithPassword({
        email: theEmail,
        password: thePass
      }).then(function(authData) {

        console.log("Logged in as:", authData.uid);
      }).catch(function(error) {
        console.error("Authentication failed:", error);
      });
    }

    $scope.loginWithFacebook = function(){
    console.log('clicked Facebook login');
    auth.$authWithOAuthPopup("facebook",
      {scope: "email, user_events" }) // scope has the permissions requested
    .then(function(authData) {
      console.log('this is the authData: ', authData);
      $cookieStore.put('currentUser', authData.uid );
      $cookieStore.put('currentToken', authData.token );
        console.log("Logged in as:", authData.uid);
      }).catch(function(error) {
        console.error("Authentication failed:", error);
      });
    };
  
  }
]);



