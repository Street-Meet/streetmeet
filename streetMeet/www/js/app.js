// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var meetApp = angular.module('sm-meetApp',
  [
    // external modules
    'ionic',
    'ngCordova',
    'firebase',
    'ngCookies',
    'ngCordova',
    'sm-meetApp.login',
    'sm-meetApp.createEvents',
    'sm-meetApp.joinEvent',
    'sm-meetApp.userInterfaceController',
    'sm-meetApp.map',
    'sm-meetApp.currentUser',
    'sm-meetApp.event',
    'sm-meetApp.profile',
    'sm-meetApp.editEvent',
    'sm-meetApp.profileSettings',
    'sm-meetApp.allMap',
    'sm-meetApp.attendeeMap',
    'sm-meetApp.eventsMap'

  ])
// run in ionic
.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})
// set up routing
.config(function($stateProvider, $urlRouterProvider, $httpProvider, $locationProvider) {
  $urlRouterProvider.otherwise('/login');

  $stateProvider
    .state('login', {
      url: '/login',
      templateUrl : 'views/login.html',
      controller: 'LoginCtrl'
    })
    .state('createEvent', {
      url: '/createEvent',
      templateUrl: 'views/createEventForm.html',
      controller: 'CreateEventsCtrl'
    })
    .state('listCurrentEvents', {
      url: '/listEvents',
      templateUrl: 'views/listCurrentEvents.html',
      controller: 'JoinEventCtrl'
    })
    .state('viewSingleEvent', {
      url: '/viewEvent/:id',
      templateUrl: 'views/singleEvent.html',
      controller: 'EventCtrl'
    })
    .state('attendEvent', {
      url: '/event/:id',
      templateUrl: 'views/attendEvent.html',
      controller: 'EventCtrl'
    })
    .state('mapCurrentEvents', {
      url: '/mapCurrentEvents',
      templateUrl: 'views/mapCurrentEvents.html',
      controller: 'AllMapCtrl'
    })
    .state('mapAttendees', {
      url: '/mapAttendees',
      templateUrl: 'views/mapAttendees.html',
      controller: 'AllMapCtrl'
    })
    .state('settings', {
      url: '/settings',
      templateUrl: 'views/userSettings.html',
    })
    .state('userProfile', {
      url: '/userProfile/:id',
      templateUrl: 'views/userProfile.html',
      controller: 'SettingsCtrl'
    })
    .state('map', {
      url: '/map',
      templateUrl: 'views/map.html',
      controller: 'OneMapCtrl'
    })
    .state('userProfileSettings', {
      url: '/userProfileSettings/:id',
      templateUrl: 'views/userProfileSettings.html',
      controller: 'ProfileSettingsCtrl'
    })
    .state('editEventSettings', {
      url: '/editEvent/:id',
      templateUrl: 'views/editEvent.html',
      controller: 'EditEventCtrl'
    })
});

