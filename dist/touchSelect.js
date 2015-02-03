/**
 * Touch Select - AngularJS touch option selector component
 * @version v0.0.1
 * @link http://kzf.github.io/AngularTouchSelect
 * @author Kevin Fray <kzfray@gmail.com>
 * @license MIT License, http://www.opensource.org/licenses/MIT
 */

(function (angular) {
'use strict';

// Config
angular.module('touchSelect.config', [])
  .constant('touchSelectConfig', {
    classes: {
      selector: 'tsl-selector',
      options: 'tsl-options',

      hidden: 'tsl-hidden',
      hover: 'tsl-hover',
      disabled: 'tsl-disabled',
      radial: 'tsl-radial',

      top: 'tsl-top',
      left: 'tsl-left',
      right: 'tsl-right',
      bottom: 'tsl-bottom',
      center: 'tsl-center'
    },
    defaultDirection: 'right',
    defaultRadius: 60,
  });


// Modules
angular.module('touchSelect.directives', [ 'ngAnimate' ]);
angular.module('touchSelect.services', []);
angular.module('touchSelect', 
  [
    'touchSelect.config',
    'touchSelect.services',
    'touchSelect.directives'
    
  ]);


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
        $scope.positionStyle = 'transform: ' + transformString + 
                               '; -webkit-transform: ' + transformString +
                               '; -ms-transform: ' + transformString + ';';
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
angular.module('touchSelect.directives')
      .directive('touchSelector', ['touchSelectConfig', 'elementFromPoint', touchSelectorDirective]);

function touchSelectorDirective(touchSelectConfig, elementFromPoint) {
  return {
    restrict: 'A',
    replace: true,
    template: '<div ng-class="selectorClasses" ng-mousedown="showOptions($event)"'+
              ' touch-start="showOptions($event)" touch-end="touchSelectOption($event)">'+
              '<span ng-bind-html="textValue"></span>'+
              '<div ng-class="optionsClasses">'+
              '<tsl-option-button tsl-radial="isRadial" ng-repeat="option in _options" option-index="{{$index}}" option-data="option" />'+
              '</div>'+
              '</div>',
    scope: {
      value: '=valueVar',
      options: '=optionsVar',
      updateCallback: '=updateCallback'
    },
    link: function(scope) {
      // When the value updates, we update the text value to match
      scope.$watch('value', function() {
        scope._options.forEach(function(opt) {
          if (opt.value === scope.value) {
            scope.textValue = opt.text;
          }
        });
      });
    },
    controller: ['$scope', '$element', '$attrs', '$document', '$sce', 'radialPosition', 
                  function($scope, $element, $attrs, $document, $sce, radialPosition) {
      // Throw error if no value or options variable defined
      if (!$attrs.optionsVar || !$attrs.valueVar) {
        throw new Error('touch-selector directive used without settings options and value variables');
      }

      // Compute radial options positions if we are using the radial option
      var isRadial = typeof $attrs.tslRadial !== 'undefined';
      $scope.isRadial = isRadial;
      var positions;
      if (isRadial) {
        if (typeof $attrs.tslStartAngle !== 'undefined' &&
            typeof $attrs.tslEndAngle !== 'undefined') {
          // We are given a start and end angle so use an arc
          positions = radialPosition.arc(
            $scope.options.length, 
            $attrs.tslRadius || touchSelectConfig.defaultRadius,
            $attrs.tslStartAngle,
            $attrs.tslEndAngle
            );
        } else {
          // No arc position given so use a circle
          positions = radialPosition.circle(
            $scope.options.length, 
            $attrs.tslRadius || touchSelectConfig.defaultRadius
            );
        }
      }

      // Load classes from either $attrs or config
      var selectorClass = touchSelectConfig.classes.selector;
      // The direction is in the center if we are using radial positioning,
      // otherwise use the attribute or the default
      var directionClass = touchSelectConfig.classes[
        (isRadial && 'center') || 
        $attrs.tslDirection || 
        touchSelectConfig.defaultDirection
        ];
      $scope.selectorClasses = [selectorClass, directionClass];

      var hiddenClass = $attrs.hiddenClass || touchSelectConfig.classes.hidden;
      var optionClass = touchSelectConfig.classes.options;
      var radialClass = touchSelectConfig.classes.radial;
      $scope.optionsClasses = [hiddenClass, optionClass];
      if (isRadial) {
        $scope.optionsClasses.push(radialClass);
      }
      
      var optionsDiv = $element.find('div');

      // Set initial text value
      $scope.textValue = $sce.trustAsHtml($scope.value.toString());

      // Build the _options array which we will use internally
      // instead of the passed in options. It has $sce secure 
      // text values and also stores positions if the options
      // are to be positioned radially
      $scope._options = [];
      $scope.options.forEach(function(opt, i) {
        var _opt = {};

        if (typeof opt !== 'object') {
          // Using simplified format, so take the given entry
          // as both value and text value
          _opt.value = opt;
          _opt.text = opt.toString();
        } else {
          _opt = opt;
          if (!_opt.text) {
            _opt.text = _opt.value.toString();
          }
        }

        if (isRadial) {
          _opt.position = positions[i];
        }

        // $sce secure the text value
        if (typeof _opt.text === 'string') {
          _opt.text = $sce.trustAsHtml(_opt.text);
        }
        $scope._options.push(_opt);
      });


      // Function to show the options on press/touch
      $scope.showOptions = function($event) {
        $event.preventDefault();
        
        if (!optionsDiv.hasClass(hiddenClass)) {
          throw new Error('Tried to show options when options were already showing');
        }
        optionsDiv.removeClass(hiddenClass);
        
        // Set up an event listener to hide the options on mouseup.
        // If we are triggered by a touch event, we don't need this.
        if ($event.type === 'mousedown') {
          var mouseup = function() {
            optionsDiv.addClass(hiddenClass);
            $document.off('mouseup', mouseup);
          };
          
          $document.on('mouseup', mouseup);
        }
      };
      
      // Listener for selected events from child option buttons
      $scope.$on('selectedOption', function(event, index) {
        var opt = $scope._options[index];
        $scope.value = opt.value;
        $scope.textValue = opt.text;
      });
      
      // Function to test if the jqlite list contains a certain DOM element
      var _contains = function(list, el) {
        var i;
        for (i = 0; i < list.length; i++) {
          if (list[i] === el) {
            return true;
          }
        }
        return false;
      };

      // Handler for touchEnd event.
      $scope.touchSelectOption = function(event) {
        event.preventDefault();

        var touch = event.changedTouches[0];

        // Find the element we touched
        var element = angular.element(
          elementFromPoint(touch.clientX, touch.clientY)
        );
        
        // Check if the touched element is inside the options div
        if (_contains(optionsDiv.find(element[0].tagName), element[0])) {
          // Find the actual optionButton element which we assume
          // will be the first element with an 'option-index' attribute
          while (element.attr('option-index') === undefined) {
            element = element.parent();
          }

          var index = element.attr('option-index');
          var opt = $scope._options[index];
          if (!opt.disabled) {
            $scope.$emit('selectedOption', index);
          }
        }
        
        optionsDiv.addClass(hiddenClass);
      };
      
    }]
  };
}
/*******************
	Cross-browser document.elementFromPoint function
	by Andri Möll
	https://github.com/moll/js-element-from-point
	Released under a Lesser GNU Affero General Public License
 *******************/


angular.module('touchSelect.services')
		.factory('elementFromPoint', function() {
      var elementFromPoint = function(x, y) {
        if (!isRelativeToViewport()) x += window.pageXOffset, y += window.pageYOffset;
        return document.elementFromPoint(x, y);
      }

      var relativeToViewport;
      var isRelativeToViewport = function() {
        if (relativeToViewport != null) return relativeToViewport;

        var x = window.pageXOffset ? window.pageXOffset + window.innerWidth - 1 : 0;
        var y = window.pageYOffset ? window.pageYOffset + window.innerHeight - 1 : 0;
        if (!x && !y) return true;
        
        // Test with a point larger than the viewport. If it returns an element,
        // then that means elementFromPoint takes page coordinates.
        return relativeToViewport = !document.elementFromPoint(x, y);
      }

      return function(x, y) {
				return elementFromPoint(x, y);
			};
    });

angular.module('touchSelect.services')
		.factory('radialPosition', function() {
			var PI = Math.PI;

			var fourDecimalPlaces = function(val) {
				return Math.round(val*10000)/10000;
			}

			// Calculate the $n points which are $radius distance from
			// (0,0) starting at the angle $angle radians (clockwise,
			// with 0 being the positive x axis), and moving by 
		  // $step radians each step
			var calculatePositions = function(n, radius, angle, step) {
				var positions = [];
				var i;
				for (i = 0; i < n; i++) {
					positions.push({
						x: fourDecimalPlaces(Math.cos(angle)*radius),
						y: fourDecimalPlaces(Math.sin(angle)*radius),
					});
					angle += step;
				}
				return positions;
			}

			return {
				// n points on a circle, starting at 12 o'clock
				circle: function(n, radius) {
					var angle = -PI/2;
					var step = 2*PI/n;
					return calculatePositions(n, radius, angle, step);
				},
				// n points on the arc between start and end, with
				// the first point at the angle start and the last
				// point at the angle end (so we divide by n-1)
				arc: function(n, radius, start, end) {
					var angle = 2*PI*start;
					var step = 2*PI*(end-start)/(n-1);
					return calculatePositions(n, radius, angle, step);
				}
			}
		});
})(angular);