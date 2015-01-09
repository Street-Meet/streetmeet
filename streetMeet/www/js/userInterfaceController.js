angular.module('sm-meetApp.userInterfaceController',  [])

.run(function ($state,$rootScope) {
    $rootScope.$state = $state;
})

.controller('uiController', ['$ionicGesture','$window', '$scope', '$ionicSideMenuDelegate', 'itemControls', '$q', function( $ionicGesture, $window, $scope, $ionicSideMenuDelegate, itemControls, $q){

  console.log()

  /**
   * https://github.com/angular-ui/ui-router/wiki#state-change-events
   */
  // $rootScope.$on('$stateChangeStart', 
  // function(event, toState, toParams, fromState, fromParams){ 
  //     //event.preventDefault();
  //     $scope.state = toState.name;
  //     // console.log(event, toState, toParams, fromState, fromParams);
  //     console.log(toState.name);
  // });
  

  $scope.loginState = 'login';

  $scope.loginSectionChange = function(section){
    $scope.loginState = section;
  };

  $ionicSideMenuDelegate.canDragContent(false);

  /**
   * Expands the event list item details
   * @param  {object} $event The event object passed in the DOM by AngularJS
   * @return {null}  returns nothing
   */


  var element = angular.element(document.querySelector('#listCurrentEvents'));
  console.log(element);

   // $ionicGesture.on('doubletap', function(){
   //  console.log('bound');
   // }, element);


  $scope.expandTap = function($event){
    var eventBlock = itemControls.getDomItem($event);
    var description = $(eventBlock).find('.event-description');

    //Reset left and right margins if it had been swiped
    itemControls.resetMarg(eventBlock);

    if($(description).hasClass('active')){
      $(description).slideUp().removeClass('active');
    }else{
      $(description).slideDown().addClass('active');
    }
  };

  /**
   * Remove event list item from DOM
   * @param  {object} $event The event object passed in the DOM by AngularJS
   * @return {null}        returns nothing
   */
  $scope.removeTap = function($event){
    itemControls.removeEvent(itemControls.getDomItem($event));
  };


  $scope.dragVert = function($event){
    var content = $(itemControls.getDomItem($event)).closest('ul');
    var wrapper = $(content).closest('.scroll-content');
    var hDiff = $(content).closest('ul').outerHeight() - $(wrapper).outerHeight();
    var currMarg = $(content).css('margin-top');
    var threshold = 20;

    if($event.gesture.distance >= threshold){

      if($event.gesture.direction === 'up'){
        var tMarg = Math.max(hDiff*-1, parseInt(currMarg) + $event.gesture.deltaY);
      }else{
        var tMarg = Math.min(0, parseInt(currMarg) + $event.gesture.deltaY);
      } 

      $(content).closest('ul').css('margin-top', tMarg);


    }


    //console.log(hDiff);
    //console.log($(content).closest('ul').outerHeight());

    //console.log(currMarg);
    console.log($event.gesture.deltaY);
  };

  /**
   * Show and hide event controls for joining or removing event 
   * @param  {object} $event The event object passed in the DOM by AngularJS
   * @return {null} returns nothing
   */
  
  $scope.onSwipe = function($event){
    //console.log($event);
    var direction = $event.gesture.direction;
    //var margins = {left: '-30%', right: '30%'};
    var cont = itemControls.getDomItem($event);

    if($(cont).hasClass('swiped') && !$(cont).hasClass('swiped-'+direction)){
      itemControls.resetMarg(cont);
    }else{
      itemControls.resetMarg($(cont).siblings());
      $(cont).addClass('swiped swiped-left').animate({
        left: '-30%'
      }, function(){
        //animation complete
      });
    }
  };
}])

.factory('itemControls', [function(){
    return {
      resetMarg : function(el){
        $(el).removeClass('swiped-left swiped-right swiped').animate({
            left: '0'
        })
      },
      removeEvent : function(el){
        $(el).fadeOut();
      },
      getDomItem : function($event){
        return $($event.target).closest('.item');
      },
      lockVertScroll : function(){

      }

    }
}]);
