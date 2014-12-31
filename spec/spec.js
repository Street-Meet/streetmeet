describe('createEvents', function(){
  //Set our own scope variable
  var $scope, $rootScope, createController, $httpBackend;

  // using angular mocks, we can inject the injector
  // to retrieve our dependencies
  beforeEach(module('sm-meetApp', 'firebase', 'ngCookies'));
  beforeEach(inject(function($injector) {

    // mock out our dependencies
    $rootScope = $injector.get('$rootScope');
  
    itemControls = $injector.get('itemControls');

    $scope = $rootScope.$new();

    var $controller = $injector.get('$controller');

    createController = function () {
      return $controller('CreateEventsCtrl', {
        $scope: $scope
      });
    };

    createController();
  }));

  //Checks for continued connections after run
  // afterEach(function() {
  //   $httpBackend.verifyNoOutstandingExpectation();
  //   $httpBackend.verifyNoOutstandingRequest();
  // });

  // tests start here
  // it('should have a function: "expandTap"', function() {
  //   expect(typeof $scope.expandTap).toBe('function');
  // });



});
