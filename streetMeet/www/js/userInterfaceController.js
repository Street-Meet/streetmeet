angular.module('sm-meetApp.userInterfaceController',  [])

.controller('mainController', ['$scope', 'itemControls', function($scope, itemControls){

  /**
   * Expands the event list item details
   * @param  {object} $event The event object passed in the DOM by AngularJS
   * @return {null}  returns nothing
   */
  $scope.expandTap = function($event){
    var eventBlock = itemControls.getDomItem($event);
    var description = $(eventBlock).children('.event-description');

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
   * Show and hide event controls for joining or removing event 
   * @param  {object} $event The event object passed in the DOM by AngularJS
   * @return {null} returns nothing
   */
  $scope.onSwipe = function($event){
    var direction = $event.gesture.direction;
    var margins = {left: '-30%', right: '30%'};
    var cont = itemControls.getDomItem($event);

    if($(cont).hasClass('swiped') && !$(cont).hasClass('swiped-'+direction)){
      itemControls.resetMarg(cont);
    }else{
      $(cont).addClass('swiped swiped-'+direction).animate({
        left: margins[direction]
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
      }


    }
}]);
