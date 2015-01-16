angular.module('sm-meetApp.userInterfaceController',  [])

.run(function ($state,$rootScope) {
    $rootScope.$state = $state;
})

.controller('uiController', ['$ionicGesture','$window', '$scope', '$ionicSideMenuDelegate', 'itemControls', '$q', function( $ionicGesture, $window, $scope, $ionicSideMenuDelegate, itemControls, $q){

  $scope.loginState = 'login';

  /**
   * Control the type of user login 
   */
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
    };
  };


  $scope.listDrag = function($event){
    var liItem = $(itemControls.getDomItem($event, '.item')).closest('li');
    var leftMin = -113;
    var posChange = 0;
    var margin = 0;
    var currentMarg = parseInt($(liItem).css('margin-left'));

    $(liItem).siblings('.swiped').each(function(key, value){
      itemControls.resetMarg(value);
    });


    if($event.gesture.direction === 'left' && ($event.gesture.deltaX+currentMarg) < leftMin){
      margin = leftMin;
    }else if($event.gesture.direction === 'left'){
      margin = currentMarg - $event.gesture.distance;
    }
    if($event.gesture.direction === 'right' && currentMarg === 0){

    }else if($event.gesture.direction === 'right' && (currentMarg+$event.gesture.deltaX) > 100){
      margin = 0;
    }else if($event.gesture.direction === 'right'){
      margin = currentMarg + $event.gesture.distance;
    }

    $(liItem).css('margin-left', margin).addClass('swiped');
  }; 


  /**
   * Profile settings edit controls
   */
  $scope.settingsTap = function($event){
    var cont = itemControls.getDomItem($event, 'li');

    if($(cont).hasClass('settings-edit-btn')){
      $(cont).hide().siblings().fadeIn().css('display', "inline-block");
      $(cont).closest('.item-content').animate({
        height : '100px'
      },200, function(){
        //animation complete
        $(cont).closest('.item-content').children('.settings-edit-field').fadeIn();
      })
    }else{
      $(cont).siblings('.settings-edit-btn').fadeIn();
      $(cont).closest('.item-content').children('.settings-edit-field').fadeOut(function(){
        $(cont).closest('.item-content').animate({
            height: '53px'
        });
      });
      $(cont).closest('ul').children('.settings-confirm').hide();
    }
  };

  /**
   * Toggle item display
   */
   $scope.toggleItem = function($event, containingEl, target){
     var element = itemControls.getDomItem($event, containingEl);
     $(element).toggle().siblings(target).toggle();
   };


}])

.factory('itemControls', [function(){
    return {
      resetMarg : function(el){
        $(el).removeClass('swiped-left swiped-right swiped').animate({
            "margin-left": '0'
        })
      },
      removeEvent : function(el){
        $(el).fadeOut();
      },
      getDomItem : function($event, selector){
        return $($event.target).closest(selector);
      },
      toggleItem : function(){

      }

    }
}]);
