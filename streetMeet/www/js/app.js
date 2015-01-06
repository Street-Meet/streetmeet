// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var meetApp = angular.module('sm-meetApp',
  [
    // external modules
    'ionic',
    'firebase',
    'ngCookies',

    //sm-meetApp Modules
    'sm-meetApp.login',
    'sm-meetApp.createEvents',
    'sm-meetApp.joinEvent',
    'sm-meetApp.userInterfaceController',
    'sm-meetApp.map',
    'sm-meetApp.currentUser',
    'sm-meetApp.event'

  ])
// run in ionic
.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})
// set up routing
.config(function($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise('/login');
  $stateProvider
    .state('login', {
      url: '/login',
      templateUrl: 'views/login.html',
      controller: 'LoginCtrl'
    })
    .state('emailSignin', {
      url: '/emailSignin',
      templateUrl: 'views/login.emailSignin.html',
      controller: 'LoginCtrl',
    })
    .state('createAccount', {
      url: '/createAccount',
      templateUrl: 'views/login.createAccount.html',
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
    .state('mapCurrentEvents', {
      url: '/mapCurrentEvents',
      templateUrl: 'views/mapCurrentEvents.html',
      controller: 'MapCtrl'
    })
    .state('profileView', {
      url: '/profileView',
      templateUrl: 'templates/profileView.html',
      controller: ''
    })
    .state('eventView', {
      url: '/:id',
      templateUrl: 'templates/eventView.html',
      controller: 'EventCtrl'
    })
});
