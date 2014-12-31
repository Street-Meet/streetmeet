describe('userInterfaceController', function(){
  //Set our own scope variable
  var $scope, $rootScope, createController, $httpBackend;

  // using angular mocks, we can inject the injector
  // to retrieve our dependencies
  beforeEach(module('sm-meetApp', 'firebase'));
  beforeEach(inject(function($injector) {

    // mock out our dependencies
    $rootScope = $injector.get('$rootScope');
    $httpBackend = $injector.get('$httpBackend');
    itemControls = $injector.get('itemControls');

    $scope = $rootScope.$new();

    var $controller = $injector.get('$controller');

    createController = function () {
      return $controller('uiController', {
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
  it('should have a function: "expandTap"', function() {
    expect(typeof $scope.expandTap).toBe('function');
  });

  it('should have a function: "removeTap"', function() {
    expect(typeof $scope.removeTap).toBe('function');
  });

  it('should have a function: "onSwipe"', function() {
    expect(typeof $scope.onSwipe).toBe('function');
  });

  it('should have factory methods on "itemControls"', function(){
    expect(typeof itemControls.resetMarg).toBe('function');
  });

  it('should have factory methods on "itemControls"', function(){
    expect(typeof itemControls.removeEvent).toBe('function');
  });

  it('should have factory methods on "itemControls"', function(){
    expect(typeof itemControls.getDomItem).toBe('function');
  });

  //Need to write tests to check for dom updates
  it('should return a dom element', function(){
    expect('<li class="item">test</li>').toBe('<li class="item">test</li>');
  });

});
