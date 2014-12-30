angular.module('sm-meetApp.map',  ['firebase'])

.controller('MapCtrl', function($scope, $firebase, Map) {
  angular.extend($scope, Map);

  var center = new google.maps.LatLng(37.785326, -122.405696)
  var mapOptions = {
    zoom: 15,
    center: center,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  }
  $scope.map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
  // Create a draggable circle centered on the map
  var circle = new google.maps.Circle({
    strokeColor: "#6D3099",
    strokeOpacity: 0.7,
    strokeWeight: 1,
    fillColor: "#B650FF",
    fillOpacity: 0.35,
    map: $scope.map,
    center: center,
    radius: 1000,
    draggable: true
  });

})

.factory('Map', function ($q) {
  var ref = new Firebase("https://boiling-torch-2747.firebaseio.com/");
  var currentUser = {
    data: null
  };

  var initializeMap = function() {
    // Get the location as a Google Maps latitude-longitude object
    var center = [37.785326, -122.405696];
    var loc = new google.maps.LatLng(center[0], center[1]);

    // Create the Google Map
    map = new google.maps.Map(document.getElementById("map-canvas"), {
      center: loc,
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    });

    // Create a draggable circle centered on the map
    var circle = new google.maps.Circle({
      strokeColor: "#6D3099",
      strokeOpacity: 0.7,
      strokeWeight: 1,
      fillColor: "#B650FF",
      fillOpacity: 0.35,
      map: map,
      center: loc,
      radius: ((radiusInKm) * 1000),
      draggable: true
    });

    //Update the query's criteria every time the circle is dragged
    // var updateCriteria = _.debounce(function() {
    //   var latLng = circle.getCenter();
    //   geoQuery.updateCriteria({
    //     center: [latLng.lat(), latLng.lng()],
    //     radius: radiusInKm
    //   });
    // }, 10);
    // google.maps.event.addListener(circle, "drag", updateCriteria);
  }

  return {
    currentUser: currentUser,
    initializeMap : initializeMap
  }

});
