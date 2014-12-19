// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var meetApp = angular.module('sm-meetApp',
  [
    'ionic'
  ])



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

.config(function($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise('/')
  $stateProvider
    .state('login', {
      url: '/login',
      templateUrl: 'templates/login.html',
      controller: ''
    })
    .state('createEvent', {
      url: '/createEvent',
      template: 'templates/createEvent.html',
      controller: ''
    })
    .state('joinEvent', {
      url: '/joinEvent',
      template: 'templates/joinEvent.html',
      controller:
    })
    .state('mapView', {
      url: '/mapView',
      template: 'templates/mapView.html',
      controller:
    })
    .state('profileView', {
      url: '/profileView',
      template: 'templates/profileView.html',
      controller:
    })
});
