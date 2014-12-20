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
    'sm-meetApp.joinEvent'

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
      templateUrl: 'templates/login.html',
      controller: 'LoginCtrl'
    })
    .state('createEvent', {
      url: '/createEvent',
      templateUrl: 'templates/createEvent.html',
      controller: 'CreateEventsCtrl'
    })
    .state('joinEvent', {
      url: '/joinEvent',
      templateUrl: 'templates/joinEvent.html',
      controller: 'JoinEventCtrl'
    })
    .state('mapView', {
      url: '/mapView',
      templateUrl: 'templates/mapView.html',
      controller: ''
    })
    .state('profileView', {
      url: '/profileView',
      templateUrl: 'templates/profileView.html',
      controller: ''
    })
});
