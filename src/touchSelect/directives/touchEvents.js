angular.module('touchSelect.directives')
    .directive('touchStart', ['$parse', touchStartDirective])
    .directive('touchEnd', ['$parse', touchEndDirective]);

function touchStartDirective($parse) {
  return {
    restrict: 'A',
    compile: function($element, attr) {
      var fn = $parse(attr.touchStart, null, true);
      return function (scope, element) {
        element.on('touchstart', function (event) {
          scope.$apply(function() {
            fn(scope, {$event: event});
          });
        });
      };
    }
  };
}

function touchEndDirective($parse) {
  return {
    restrict: 'A',
    compile: function($element, attr) {
      var fn = $parse(attr.touchEnd, null, true);
      return function (scope, element) {
        element.on('touchend', function (event) {
          scope.$apply(function() {
            fn(scope, {$event: event});
          });
        });
      };
    }
  };
}