var meetApp = angular.module('sm-meetApp',
  [
      'ui.router','ionic', 'google-maps';
  ])
  .config(function($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('login', {
          url: 'login',
          template: 'views/login.html',
          controller: ''
      })
      .state('createEvent', {
          url: 'createEvent',
          template: 'views/createEvent.html',
          controller: ''
      })
      .state('joinEvent', {
          url: 'joinEvent',
          template: 'views/joinEvent.html',
          controller: ''
      })
  });
  .controller('MapController', function($scope, $ionicLoading) {

    google.maps.event.addDomListener(window, 'load', function() {
      var myLatlng = new google.maps.LatLng(37.3000, -120.4833);

      var mapOptions = {
          center: myLatlng,
          zoom: 16,
          mapTypeId: google.maps.MapTypeId.ROADMAP
      };

      var map = new google.maps.Map(document.getElementById("map"), mapOptions);

      navigator.geolocation.getCurrentPosition(function(pos) {
        map.setCenter(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
        var myLocation = new google.maps.Marker({
          position: new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude),
          map: map,
          title: "My Location"
        });
      });

      $scope.map = map;
    });
  });
