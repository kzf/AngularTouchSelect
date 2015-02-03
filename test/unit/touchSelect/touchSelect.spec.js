'use strict';

describe('touchSelect', function () {

  var dependencies = [];

  var hasModule = function(module) {
    return dependencies.indexOf(module) >= 0;
  };



  beforeEach(function () {
    dependencies = angular.module('touchSelect').requires;
  });

  
  
  it('should load config module', function () {
    expect(hasModule('touchSelect.config')).toBe(true);
  });


  it('should load directives module', function () {
    expect(hasModule('touchSelect.directives')).toBe(true);
  });

  it('should load services module', function () {
    expect(hasModule('touchSelect.services')).toBe(true);
  });

});