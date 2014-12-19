angular.module('sm-meetApp.login',  ["firebase"])

.controller('LoginCtrl', function($scope, $firebase, Auth) {
  angular.extend($scope, Auth);
     
     $scope.currentUser;


     $scope.facebookLogin()
     .then(function(data){
        $scope.currentUser = data;
      });
})
  .factory('Auth', function ($q) {
      var ref = new Firebase("https://boiling-torch-2747.firebaseio.com/");
    var currentUser = { 
      data: null
    };
    var updateUserData = function(data){
      currentUser = data;
    };
    var simpleSignup = function(email, password){
       ref.createUser({
         email    : email,
         password : password
       }, function(error) {
         if (error === null) {
           console.log("User created successfully");
         } else {
           console.log("Error creating user:", error);
         }
       });
    };

    
    var simpleLogin = function(email, password){
      ref.authWithPassword({
        email    : email,
        password : password
      }, function(error, authData) {
        if (error) {
          console.log("Login Failed!", error);
        } else {
          console.log("Authenticated successfully with payload:", authData);
          ref.child("users").child(authData.uid).set(authData);
          
        }
      },
      {
      remember: "sessionOnly"
      });
    }



  
    var facebookLogin = function(){
      var deferred = $q.defer();
      ref.authWithOAuthPopup("facebook", function(error, authData) {
        if (error) {
           console.log("Login Failed!", error);
           deferred.reject(error);
        } else {
          

          ref.child("users").child(authData.uid).set(authData);
          

          console.log("Authenticated successfully with payload:", authData.facebook.cachedUserProfile);
          // updateUserData(authData.facebook.cachedUserProfile);
          
           deferred.resolve(authData.facebook.cachedUserProfile);
          // return authData.facebook.cachedUserProfile;
        }
      },{
        scope: "email, user_likes, user_events, user_groups" // the permissions requested
      });
      return deferred.promise;
    };

   
    

   
    return {
      currentUser: currentUser,
      simpleLogin : simpleLogin,
      simpleSignup: simpleSignup,
      facebookLogin: facebookLogin
    }



  });

