
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