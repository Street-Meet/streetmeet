angular.module('sm-meetApp.login',  ['firebase', 'ngCookies'])

.controller('LoginCtrl', ['$cookieStore', function($scope, $firebase, $cookieStore, Auth) {
  angular.extend($scope, Auth);
     
     $scope.currentUser;

    $scope.facebookConnect = function(){
        console.log('facebook!');
       Auth.facebookLogin()
       .then(function(data){
          $scope.currentUser = data;
        });
    }

    $scope.simpleLogin = function(email, password){
     console.log('simple login clicked');
     Auth.simpleLogin(email, password).
     then(function(data){
       $scope.currentUser = data.password;
     });
    }
}])
  .factory('Auth', function ($q) {
    var ref = new Firebase("https://boiling-torch-2747.firebaseio.com/");
    // var currentUser = { 
    //   data: null
    // };
    
    var simpleSignup = function(email, password){
       var deferred = $q.defer();
       ref.createUser({
         
         email    : email,
         password : password
       }, function(error) {
         if (error === null) {
           console.log("User created successfully");
          deferred.resolve();
         } else {
           console.log("Error creating user:", error);
           deferred.reject(error);
         }
       });
        return deferred.promise;
    };

    
    var simpleLogin = function(email, password){
      var deferred = $q.defer();
      ref.authWithPassword({
        email    : email,
        password : password
      }, function(error, authData) {
        if (error) {
          console.log("Login Failed!", error);
          deferred.reject(error);
        } else {
          console.log("Authenticated successfully with payload:", authData);
          
          deferred.resolve(authData);
          ref.child("users").child(authData.uid).set(authData);
        }
      },
      {
      remember: "sessionOnly"
      });
      return deferred.promise;
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
           deferred.resolve(authData.facebook.cachedUserProfile);
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

