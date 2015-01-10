angular.module('sm-meetApp.userInterfaceController',  [])

.run(function ($state,$rootScope) {
    $rootScope.$state = $state;
})

.controller('uiController', ['$ionicGesture','$window', '$scope', '$ionicSideMenuDelegate', 'itemControls', '$q', function( $ionicGesture, $window, $scope, $ionicSideMenuDelegate, itemControls, $q){

  $scope.loginState = 'login';

  $scope.loginSectionChange = function(section){
    $scope.loginState = section;
  };

  /**
   * Expands the event list item details
   * @param  {object} $event The event object passed in the DOM by AngularJS
   * @return {null}  returns nothing
   */
  $scope.expandTap = function($event){
    var eventBlock = itemControls.getDomItem($event, '.item');
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


  /**
   * In Progress fix for drag controls no-scrolling problem on list events page
   */

  $scope.dragVert = function($event){
    var content = $(itemControls.getDomItem($event, '.item')).closest('ul');
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
    // console.log($event.gesture.deltaY);
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
    var cont = itemControls.getDomItem($event, '.item');

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

  /**
   * Profile settings edit controls
   */
  
  $scope.settingsTap = function($event){
    var cont = itemControls.getDomItem($event, 'li');

    if($(cont).hasClass('settings-edit-btn')){
      $(cont).hide().siblings().fadeIn().css('display', "inline-block");
      $(cont).closest('.item-content').children('.settings-edit-field').fadeIn();
    }else{
      $(cont).siblings('.settings-edit-btn').fadeIn();
      $(cont).closest('.item-content').children('.settings-edit-field').fadeOut();
      $(cont).closest('ul').children('.settings-confirm').hide();
    }

    console.log(cont);
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
      getDomItem : function($event, selector){
        return $($event.target).closest(selector);
      },
      lockVertScroll : function(){

      }

    }
}]);
