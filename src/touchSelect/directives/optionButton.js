angular.module('touchSelect.directives')
      .directive('tslOptionButton', ['touchSelectConfig', tslOptionButtonDirective]);

function tslOptionButtonDirective(touchSelectConfig) {
  var disabledClass = touchSelectConfig.classes.disabled;
  var hoverClass = touchSelectConfig.classes.hover;

  return {
    restrict: 'E',
    replace: true,
    template: '<span ng-class="elementClasses" ng-mouseover="mouseoverOption()" ng-mouseout="mouseoutOption()"'+
              ' style="{{positionStyle}}"'+
              ' ng-mouseup="selectOption()" ng-bind-html="data.text"></span>',
    scope: {
      index: '@optionIndex',
      data: '=optionData',
      radial: '=tslRadial'
    },
    link: function(scope) {
      // Watch for changes in the disabled attribute so that we can
      // toggle the disabled class for disabled choices
      scope.$watch('data.disabled', function() {
        scope.elementClasses['tsl-disabled'] = scope.data.disabled;
      });
    },
    controller: function($scope, $element) {
      // Add inline positional style if this is a radially positioned selector
      $scope.positionStyle = '';
      if ($scope.radial) {
        var transformString = 'translateX(-50%) translateY(-50%) '+
                               'translateX('+$scope.data.position.x+
                               'px) translateY('+$scope.data.position.y+'px)';
        $scope.positionStyle = 'transform: ' + transformString + '; -webkit-transform: ' + transformString;
      }
      
      $scope.elementClasses = {};
      $scope.elementClasses[disabledClass] = $scope.data.disabled;

      // We have to implemenet hovering manually since :hover pseudoclass
      // will not be applied while dragging
      $scope.mouseoverOption = function() {
        $element.addClass(hoverClass);
      };
      $scope.mouseoutOption = function() {
        $element.removeClass(hoverClass);
      };

      // Emit selected event to parent controller when clicked
      $scope.selectOption = function() {
        if ($scope.data.disabled) {
          return;
        }
        $scope.$emit('selectedOption', $scope.index);
      };
    }
  };
}