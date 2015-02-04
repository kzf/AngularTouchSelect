describe('touchSelector directive', function () {

  var $scope;
  var $compile;

  var generateTemplate = function (options) {
    var defaults = {
      allowMultiple: false,
      customControl: false,
    };

    if (options) {
      angular.extend(defaults, options);
    }

    var template = '<div touch-selector value-var="selected" options-var="options">/div>';

    return template;
  };



  beforeEach(module('touchSelect'));

  beforeEach(inject(function ($rootScope, _$compile_, _touchSelectConfig_) {
    $scope = $rootScope.$new();

    $compile = _$compile_;
    touchSelectConfig = _touchSelectConfig_;
  }));

  afterEach(function () {
    $scope.$destroy();
  });


  it('should add touch-selector class to div with touch-selector directive', function () {
    $scope.selected = 1;
    $scope.options = [{value: 1}, {value: 2}];
    var element = angular.element('<div touch-selector value-var="selected" options-var="options">/div>');
    var template = $compile(element)($scope);

    $scope.$digest();

    expect(element.prop('tagName')).toBe('DIV');
    expect(element.hasClass(touchSelectConfig.classes.selector)).toBe(true);
  });

  it('should throw an error if options variable is not defined', function () {
    $scope.selected = 1;
    var element = angular.element('<div touch-selector value-var="selected">/div>');

    expect(function () { $compile(element)($scope); }).toThrow();
  });

  it('should throw an error if value variable is not defined', function () {
    $scope.options = [{value: 1}, {value: 2}];
    var element = angular.element('<div touch-selector options-var="options">/div>');
    
    expect(function () { $compile(element)($scope); }).toThrow();
  });

  it('should hide the options div on initialisation', function () {
    $scope.selected = 1;
    $scope.options = [{value: 1}, {value: 2}];
    var element = angular.element('<div touch-selector value-var="selected" options-var="options">/div>');

    var template = $compile(element)($scope);
    $scope.$digest();
    
    expect(element.find('div').hasClass(touchSelectConfig.classes.hidden)).toBe(true);
  });

  it('should show the options div when showOptions is callled', function () {
    $scope.selected = 1;
    $scope.options = [{value: 1}, {value: 2}];
    var element = angular.element('<div touch-selector value-var="selected" options-var="options">/div>');

    var template = $compile(element)($scope);
    $scope.$digest();
    
    template.isolateScope().showOptions({
      preventDefault: function() {}
    });
    
    expect(element.find('div').hasClass(touchSelectConfig.classes.hidden)).toBe(false);
  });

  it('should set option when a selectOption event happens', function () {
    $scope.selected = 1;
    $scope.options = [{value: 1}, {value: 2}];
    var element = angular.element('<div touch-selector value-var="selected" options-var="options">/div>');

    var template = $compile(element)($scope);
    $scope.$digest();

    var scope = template.isolateScope();
    
    scope.$emit('selectedOption', 1);
    
    expect(scope.value).toBe(2);
  });

  it('should handle simple options format', function () {
    $scope.selected = 1;
    $scope.options = [1,2,3];
    var element = angular.element('<div touch-selector value-var="selected" options-var="options">/div>');

    var template = $compile(element)($scope);
    $scope.$digest();

    var scope = template.isolateScope();
    
    scope.$emit('selectedOption', 2);
    
    expect(scope.value).toBe(3);
  });

});