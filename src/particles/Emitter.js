

"use strict";

let Point = require ("./Point.js").Point;
let Particle = require ("./Particle.js").Particle;
let Random = require ("./Random.js").Random;

class Emitter {

   // Creates a new Emitter given a point in space and emission velocity
   constructor (point,velocity, xsize, ysize, particleLife, spread, emissionRate) {
    this.position     = point;
    this.velocity     = velocity;
    this.xsize        = xsize;
    this.ysize        = ysize;
    this.particleLife = particleLife || -1;
    this.spread       = spread === undefined? Math.PI / 32 : spread;
    this.emissionRate = emissionRate || 1;
    this.jitter       = 0.05;
    this.rand         = new Random();
  }

  setPos (xy) { this.position = xy; return this; }
  setSpeed (sp) { this.velocity = sp; return this; }
  setSize (xy) { this.xsize = xy.x; this.ysize = xy.y; return this; }
  setJitter (x) { this.jitter = x; return this; }
  setSpread (x) { this.spread = x; return this; }
  setLifetime (x) { this.particleLife = x; return this; }

  // Sets the distribution function
  seed (val) {
    if (val !== undefined) {
      this.rand.setSeed(val);
    }
    return this;
  }

  // Adds a new particle using the Emitter position and velocity as starting point.
  addParticle() {
    var pPosition = this.position.copy();
    pPosition.x += this.rand.random() * this.xsize;
    pPosition.y += this.rand.random() * this.ysize;
    var particle = new Particle (pPosition,
                                 Point.fromAngle(this.velocity.getAngle() - this.spread * this.rand.random()
                                                  - (0 * this.spread * 2),
                                  this.velocity.getMagnitude())
    );
    particle.ttl = this.particleLife;
    return particle;
  }
};

module.exports.Emitter = Emitter;
