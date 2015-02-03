
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

