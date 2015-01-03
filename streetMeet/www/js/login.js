angular.module('sm-meetApp.login',  ['firebase', 'ngCookies', 'ngCordova','ionic.utils'])

.controller('LoginCtrl', ["$scope",  "$stateParams", "$firebaseAuth", "$cookieStore", 'Auth', '$cordovaOauth', '$localstorage', 
  function($scope, $stateParams, $firebaseAuth, $cookieStore, Auth , $cordovaOauth, $localstorage) {
    if ($stateParams.code) {
      debugger;
    }
    // $scope.currentUser =  $cookieStore.get('currentData') || null;
    // $scope.currentUserId =  $cookieStore.get('currentUser') || null; 
    // $scope.theEvents;
    

    //Mobile
    
    $scope.currentUser =  $localstorage.get('currentData') || null;
    $scope.currentUserId =  $localstorage.get('currentUser') || null; 
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
    // auth.$authWithOAuthPopup("facebook",
    //   {scope: "email, user_events" }) // scope has the permissions requested
    // .then(function(authData) {
    //   console.log('this is the authData: ', authData);
    //     $cookieStore.put('currentUser', authData.uid );
    //     $cookieStore.put('currentToken', authData.token );
    //     $cookieStore.put('currentData', authData.facebook.cachedUserProfile );
        
    //     console.log("Logged in as:", authData.uid);
    //     $scope.currentUser = authData.facebook.cachedUserProfile;
    //     $scope.currentUserId = authData;
    //   }).catch(function(error) {
    //     console.error("Authentication failed:", error);
    //   });
console.log('click en FAcebook login');
    
     $cordovaOauth.facebook("737407316337748", ["email", "read_stream", "user_website", "user_location", "user_relationships"])
     .then(function(result) {
                console.log('result: ', result.data);
                $localstorage.accessToken = result.access_token;
                $localstorage.set('currentUser', result.uid );
                $localstorage.set('currentToken', result.token );
                $localstorage.set('currentData', result.facebook.cachedUserProfile );

                $scope.currentUser = result.facebook.cachedUserProfile;
                $scope.currentUserId = result;


                // $location.path("/profile");
            }, function(error) {
                alert("There was a problem signing in!  See the console for logs");
                console.log(error);
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
  };

  // $scope.loginWithMeetup = function(){
  //      Auth.connectMeetup()
  //      .then(function(data){
  //       console.log('MeetupData:', data);
  //       $cookieStore.put('meetupCode', data)
  //      }).catch(function(error) {
  //       console.error("Authentication failed:", error);
  //     });
  //   };

    $scope.facebookLogin = function() {
      console.log('click en facebooklogin');
      if(!$localstorage.accessToken){
        $cordovaOauth.facebook("737407316337748", ["email"])
        .then(function(result) {
            console.log( JSON.stringify(result))  ;
            $localstorage.accessToken = result.access_token;
            Auth.getFacebookMe(result.accessToken);
        }, function(error) {
            alert("There was a problem signing in!  See the console for logs");
            console.log(error); 
        });

      }else{
        console.log('accessToken exists!');
      }
    };



}])
.factory('Auth', ['$http', '$q', function($http, $q) {
     // call to get all nerds
  return {
    getFacebookMe: function(token){
      $http.get('/api/facebook/token').then(function(results){
        console.log(results);
      })
      .catch(function(error){
          console.log(error);
      }
    };
    connectMeetup : function() {

      // var mup = {
      //   clientId: "3fss73ueag5e744sp45cmopag2",
      //   clientSecret:"g31i2o39pbf2qgscie95pkcdod",
      //   redirectUri:"http://127.0.0.1:3000/api/meetupReturn/"
      // };
      // var url = 'https://secure.meetup.com/oauth2/authorize?' + mup.clientId + '&response_type=token&redirect_uri='+ mup.redirectUri;


      // this needs to open an in-app browser. example are in $cordovaOauth
      // window.location = '/login/meetup';

        // // return $http.get(url).success(function(data) {
        // //   console.warn('connectMeetup', data);
        // //   return data;
        // // })

        // return $http.get('/api/meetup')
        // .success(function(data) {
        //     console.warn('connectMeetup', data);
        //     return data;
        //     // $http.get(data.location).then(function(res) {
        //     //   console.log('RES connectMeetup', res);

        //     // })


        //  })
        // .error(function(data) {
        //     console.log('Error: ' , data);
        // });
    }
  }

  }]);
  //TODO: CurrentUser as a service for every other view who wants to use it.




