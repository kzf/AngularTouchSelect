describe('radialPosition service', function () {

  var radialPosition;

  var distBetween = function(a, b) {
    var dx = a.x - b.x,
        dy = a.y - b.y;
    return Math.sqrt(dx*dx + dy*dy);
  }


  beforeEach(module('touchSelect'));

  beforeEach(inject(function (_radialPosition_) {
    radialPosition = _radialPosition_;
  }));

  it('should compute correct number of circle positions', function() {
    var positions = radialPosition.circle(4, 1);

    expect(positions.length).toBe(4);
  });

  it('should start at 12 o\'clock on the circle', function() {
    var positions = radialPosition.circle(4, 1);

    expect(positions[0].x).toBe(0);
    expect(positions[0].y < 0).toBe(true);
  });

  it('should space out points equally on circle', function() {
    var positions;

    positions = radialPosition.circle(4, 1);
    
    expect(distBetween(positions[0], positions[1]) - distBetween(positions[1], positions[2]) < 1e-5).toBe(true);
  });


  it('should compute correct number of arc positions', function() {
    var positions = radialPosition.arc(18, 1, 0, 0.5);

    expect(positions.length).toBe(18);
  });

  it('should start at start angle on arc', function() {
    var positions;
    positions = radialPosition.arc(4, 1, 0, 0.5);

    expect(Math.atan2(positions[0].y, positions[0].x)).toBe(0);
  });

  it('should end at end angle on arc', function() {
    var positions;
    positions = radialPosition.arc(4, 1, 0, 0.5);

    expect(Math.atan2(positions[3].y, positions[3].x)).toBe(Math.PI);
  });

  it('should space out points equally on arc', function() {
    var positions;
    positions = radialPosition.arc(4, 1, 0, 0.5);
    
    expect(distBetween(positions[0], positions[1]) - distBetween(positions[1], positions[2]) < 1e-5).toBe(true);
  });


});