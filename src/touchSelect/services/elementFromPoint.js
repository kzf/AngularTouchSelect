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