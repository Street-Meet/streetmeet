angular.module('sm-meetApp.joinEvent',  ["firebase"])

.controller('JoinEventCtrl', ["$scope", "$firebase", 'Events', function($scope, $firebase, Events) {
    // angular.extend($scope, Events);
    var ref = new Firebase("https://boiling-torch-2747.firebaseio.com/current/events");

    $scope.list =  Events.throwTheEvents(ref);
    console.log($scope.list)
    console.log($scope.list.forEach);

    angular.forEach($scope.list, function(value, key) {
      console.log('ervrev');
      console.log(value, key);
    })

    // $scope.list = [
    //   {
    //     'title': 'title',
    //     'description' : 'Lorem ipsum dolor sit amet.'
    //   },
    //   {
    //     'title': 'title',
    //     'description' : 'Lorem ipsum dolor sit amet.'
    //   },
    //   {
    //     'title': 'title',
    //     'description' : 'Lorem ipsum dolor sit amet.'
    //   },
    //   {
    //     'title': 'title',
    //     'description' : 'Lorem ipsum dolor sit amet.'
    //   },
    //   {
    //     'title': 'title',
    //     'description' : 'Lorem ipsum dolor sit amet.'
    //   },
    //   {
    //     'title': 'title',
    //     'description' : 'Lorem ipsum dolor sit amet.'
    //   },
    //   {
    //     'title': 'title',
    //     'description' : 'Lorem ipsum dolor sit amet.'
    //   },
    //   {
    //     'title': 'title',
    //     'description' : 'Lorem ipsum dolor sit amet.'
    //   },
    //   {
    //     'title': 'title',
    //     'description' : 'Lorem ipsum dolor sit amet.'
    //   },
    //   {
    //     'title': 'title',
    //     'description' : 'Lorem ipsum dolor sit amet.'
    //   },
    //   {
    //     'title': 'title',
    //     'description' : 'Lorem ipsum dolor sit amet.'
    //   },
    //   {
    //     'title': 'title',
    //     'description' : 'Lorem ipsum dolor sit amet.'
    //   }
    // ];


}])
.factory("Events", ["$FirebaseArray", "$firebase", function($FirebaseArray, $firebase) {

    // create a new factory based on $FirebaseArray
  var TotalEvents = $FirebaseArray.$extendFactory({
    getEvents: function() {
      return this.$list;
    }
  });

  var throwTheEvents = function(myRef){
    // override the factory used by $firebase
    var sync = $firebase(myRef, {arrayFactory: TotalEvents});
    return sync.$asArray(); // this will be an instance of TotalEvents
  };

  // var ref = new Firebase("https://boiling-torch-2747.firebaseio.com/current/events");

  // var list = throwTheEvents(ref);

  return {
    throwTheEvents : throwTheEvents,
    // list : list
  };
}])
.filter('reverse', function() {
  return function(items) {
    return items.slice().reverse();
  };
})
.filter('timer', function() {
  return function(items) {
    var result = [];
    for (var i = 0; i < items.length; i++) {
      if (items[i].createdAt && items[i].createdAt > Date.now() - 1320000) {
        result.push(items[i]);
      }
    }
    return result;
  }
});
