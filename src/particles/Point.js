  "use strict";

  class Point {

   // Instantiates a new Point given x and y
   constructor (x,y) {
    this.x = x || 0;
    this.y = y || 0;
   }

   // Returns the magnitude of a point considering it a vector starting from (0,0)
   getMagnitude () {
    return Math.sqrt(this.x * this.x + this.y * this.y);
   }

   unit () {
     var mag = this.getMagnitude();
     return new Point (this.x / mag, this.y / mag);
   }

   pow () {
    return Math.pow(this.x, 2) + Math.pow(this.y, 2);
   }

    // Multiplies the point
    multiply (scaleFactor) {
      if (typeof(scaleFactor) === 'object')
      {
        this.x *= scaleFactor.x;
        this.y *= scaleFactor.y;
      }
      else {
        this.x *= scaleFactor;
        this.y *= scaleFactor;
      }
      return this;
    }

    // Translates the point
    add (increased) {
      if (typeof(increased) === 'object')
      {
        this.x += increased.x;
        this.y += increased.y;
      }
      else {
        this.x += increased;
        this.y += increased;
      }
      return this;
    }

    limit (max) {
    	if (this.getMagnitude() > max) {
    	  var unit = this.unit();
    	  return new Point(unit.x * max, unit.y * max);
      }
      return this.copy();
    }

    dec (decrease) {
      if (typeof(decrease) === 'object')
      {
        this.x -= decrease.x;
        this.y -= decrease.y;
      }
      else {
        this.x -= decrease;
        this.y -= decrease;
      }
      return this;
    }

    div (factor) {
      return new Point(this.x / factor, this.y / factor);
    }

    // Returns a new Point
    vectorTo(vector) {
      return new Point(vector.x - this.x, vector.y - this.y);
    }

    // Given a point, checks if it's within the bounds of this vector
    withinBounds (point, size) {
      var radius = ~~(size/2)  + 1;
      return this.x >= point.x - radius &&
             this.x <= point.x + radius &&
             this.y >= point.y - radius &&
             this.y <= point.y + radius ;
    }

    // Calculates the angle of this point relative to (0,0)
    getAngle() {
      var ratio = 0;
      var offset = 0;
      if (this.x > 0) {
        if (this.y > 0) {
          offset = 0;
          ratio = this.y / this.x;
        } else {
          offset = (3 * Math.PI)/2;
          ratio = this.x / this.y;
        }
      } else {
        if (this.y > 0) {
          offset = Math.PI / 2;
          ratio = this.x / this.y;
        } else {
          offset = Math.PI;
          ratio = this.y / this.x;
        }
      }
      var angle = Math.atan(Math.abs(ratio)) + offset;
      return angle;
    }

    // Returns the angle degrees of this point relative to (0,0)
    getAngleDegrees() {
      return this.getAngle() * 180 / Math.PI;
    }

    // Returns a jittered point around the current one
    jitter(jitterAmount, Rnd) {
      randFunc = Rnd ? Rnd.random : Math.random;
      return new Point(
        this.x + this.x * jitterAmount * randFunc(),
        this.y + this.y * jitterAmount * randFunc()
      );
    }

    // Copies a Point
    copy() {
      return new Point(this.x,this.y);
    }

    static euc2d (source, target) {
      let xdist = Math.pow(source.x - target.x);
      let ydist = Math.pow(source.y - target.y);
      return Math.sqrt (xdist + ydist);
    }

    // Returns a new point given the angle from (0,0) and a certain magnitude
    static fromAngle (angle, magnitude) {
      var p = new Point(magnitude * Math.cos(angle), magnitude * Math.sin(angle));
      return p;
    }
};
module.exports.Point = Point;
