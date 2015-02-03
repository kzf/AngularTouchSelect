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