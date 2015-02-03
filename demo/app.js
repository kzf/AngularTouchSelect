(function (angular) {
  'use strict';

  angular
    .module('myApp', [ 'touchSelect' ])

    .directive("sudokuSquare", function($parse) {
      return {
        restrict: 'A',
        link: function(scope, $element, attrs) {
          var index = attrs.sudokuSquare;
          var row = Math.floor(index / 9);
          var col = index % 9;
          
          var topRow = row === 0;
          var leftCol = col === 0;
          var thickBottom = row === 2 || row === 5;
          var thickRight = col === 2 || col === 5;
          
          $element.addClass("sudoku-square");
          if (topRow) $element.addClass("sd-top");
          if (leftCol) $element.addClass("sd-left");
          if (thickBottom) $element.addClass("sd-thick-btm");
          if (thickRight) $element.addClass("sd-thick-right");
        }
      }
    })

    .controller('MainController', function ($scope) {

      $scope.grade = '-';
      $scope.options = ['A','B','C'];
      
      $scope.digit = 4;
      $scope.digits = [1,2,3,4,5,6,7,8,9];

      $scope.letter = 'a';
      $scope.letters = 'abcdefghijklmn'.split('');

      $scope.seatNumber = 1;
      $scope.seatChoices = [
        {value: 1},
        {value: 2, disabled: true},
        {value: 3},
        {value: 4},
        {value: 5, disabled: true},
      ];

      $scope.thumbRating = 'up';
      $scope.thumbChoices = [
        {value: 'up', text: '<i class="fa fa-thumbs-o-up"></i>'},
        {value: 'meh', text: '<i class="fa fa-meh-o"></i>'},
        {value: 'down', text: '<i class="fa fa-thumbs-o-down"></i>'},
      ];

      $scope.description = 'Average';
      $scope.descriptions = [
        'Excellent',
        'Above Average',
        'Average',
        'Poor',
        'Abysmal'
      ];

      $scope.places = ['-', '-', '-'];
      $scope.placeChoices = [
        {value: '1st'}, {value: '2nd'}, {value: '3rd'}, {value: '-'}
      ];
      $scope.$watch('places', function() {
        for (var i = 0; i < $scope.places.length; i++) {
          var alreadyUsed = false;
          for (var j = 0; j < $scope.places.length; j++) {
            if ($scope.places[j] === $scope.placeChoices[i].value) {
              alreadyUsed = true;
            }
          }
          $scope.placeChoices[i].disabled = alreadyUsed;
        }
      }, true);

      
      $scope.sudoku = [];
      for (var i = 0; i < 9*9; i++) {
        $scope.sudoku.push('-');
      }
      
    });

})(angular);