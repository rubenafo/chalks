
"use strict";

var Point = require ("./Point.js").Point;
var Rnd   = require ("../../Rnd.js").Rnd;

class Boid {

  constructor (params) {
    this.rnd = params.rnd || Math.random;
    this.pos = new Point (params.x + this.rnd.random() * 25 || 0,
                          params.y + this.rnd.random() * 25 || 0);
    this.speed = new Point (params.speedx || 0, params.speedx || 0);
    this.acc = new Point (params.accx || 0, params.accy || 0);
    this.trace = [];
  };

  getPos()   { return this.pos;}
  getSpeed() { return this.speed;}
  getAccel() { return this.acc;}
  getTrace() { return this.trace;}
};

class Attractor {

  constructor (params) {
    this.pos = new Point(Infinity, Infinity);
    this.distance = 150;
    this.spd = 0.25;
  }

  getPos () { return this.pos;}
  getDistance() { return this.distance;}
  getSpd() { return this.spd;}
}

class Boids {

  constructor (opts) {
    this.speedLimitRoot = opts.speedLimit || 0
    this.accelerationLimitRoot = opts.accelerationLimit || 1.7
    this.speedLimit = Math.pow(this.speedLimitRoot, 2)
    this.accelerationLimit = Math.pow(this.accelerationLimitRoot, 2)
    this.separationDistance = Math.pow(opts.separationDistance || 60, 2)
    this.alignmentDistance = Math.pow(opts.alignmentDistance || 180, 2)
    this.cohesionDistance = Math.pow(opts.cohesionDistance || 180, 2)
    this.separationForce = opts.separationForce || 0.45
    this.cohesionForce = opts.cohesionForce || 0.1
    this.alignmentForce = opts.alignmentForce || opts.alignment || 0.25
    this.attractors = opts.attractors || []
    this.x0 = opts.x0 || 0
    this.y0 = opts.y0 || 0
    this.rnd = new Rnd (opts.seed || 1);

    this.boids = [];
    for (var i = 0, l = opts.boids === undefined ? 50 : opts.boids; i < l; i += 1) {
      this.boids.push(new Boid({x: this.x0, y: this.y0, rnd:this.rnd}));
    }
    return this;
  }

  addAttractor (params) {
    this.attractors.push (new Attractor({x:params.x, y:params.y, dist:params.dist, spd:params.spd}));
    return this;
  };

  ticks (its) {
    var loops = its | 1;
    while (loops--)
      this.tick();
    return this;
  }

  limitTraces (width, height, excess) {
    var that = this;
    this.boids.forEach (function (boid, i) { // check the traces
        var newTraces = [];
        boid.trace.forEach (function (point, i) {
          if ((point.x >= 0 - width * excess) && (point.x <= width + width * excess) &&
              (point.y >= 0 - height * excess) && (point.y <= height + height * excess)) {
            newTraces.push(point); // the point passes the filter
          }
        });
        boid.trace = newTraces;
    });
    return this;
  }

  tick () {
    var sepDist = this.separationDistance
    , cohDist = this.cohesionDistance
    , cohForce = this.cohesionForce
    , aliDist = this.alignmentDistance
    , aliForce = this.alignmentForce

    let current = this.boids.length;
    while (current--) {
      let sforce = new Point(), cforce = new Point(), aforce = new Point();
      let boid = this.boids[current];

      // Attractors
      let attrIte = this.attractors.length;
      while (attrIte--) {
        let attractor = this.attractors[attrIte];
        let spare = boid.getPos().copy().dec(attractor.getPos());
        //  length
        if (spare.pow() < attractor.getDistance() * attractor.getDistance()) {
          let length = hypot(spare.x, spare.y);
          boid.getSpeed().dec (new Point(attractor.getSpd() * spare.x / length,
                                         attractor.getSpd() * spare.y / length));
        }
      }

      let itBoids = this.boids.length;
      while (itBoids--) {
        if (itBoids === current)
          continue;
        let comparedBoid = this.boids[itBoids];
        let distance = boid.getPos().copy().dec(comparedBoid.getPos());
        let distSquared = distance.pow();
        if (distSquared < sepDist)
          sforce.add (distance);
        else {
          if (distSquared < cohDist)
            cforce.add(distance);
          if (distSquared < aliDist)
            aforce.add (comparedBoid.getSpeed());
        }
      }

      // Separation
      let length = hypot(sforce.x, sforce.y);
      boid.getAccel().add (sforce.div(length).multiply(this.separationForce));
      // Cohesion
      length = hypot(cforce.x, cforce.y)
      boid.getAccel().dec (cforce.div(length).multiply(cohForce));
      // Alignment
      length = hypot(aforce.x, aforce.y);
      boid.getAccel().dec (aforce.div(length).multiply(aliForce));
    } // end while current

    // Apply speed/acceleration for this tick
    var that = this;
    this.boids.forEach (function (boid) {
      if (that.accelerationLimit) {
        let acc = boid.getAccel().pow();
        if (acc > that.accelerationLimit) {
          let ratio = that.accelerationLimitRoot / hypot(boid.getAccel().x, boid.getAccel().y);
          boid.getAccel().multiply(ratio);
        }
      }
      boid.getSpeed().add (boid.getAccel());
      if (that.speedLimit) {
        let distSquared = boid.getSpeed().pow();
        if (distSquared > that.speedLimit) {
          let ratio = that.speedLimitRoot / hypot(boid.getSpeed().x, boid.getSpeed().y);
          boid.getSpeed().multiply(ratio);
        }
      }
      boid.getTrace().push (boid.getPos().copy());
      boid.getPos().add(boid.getSpeed());
    });
  }
};

// double-dog-leg hypothenuse approximation
// http://forums.parallax.com/discussion/147522/dog-leg-hypotenuse-approximation
function hypot(a, b) {
  a = Math.abs(a);
  b = Math.abs(b);
  var lo = Math.min(a, b);
  var hi = Math.max(a, b);
  return hi + 3 * lo / 32 + Math.max(0, 2 * lo - hi) / 8 + Math.max(0, 4 * lo - hi) / 16;
}

module.exports = Boids;
