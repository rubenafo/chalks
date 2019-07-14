
"use strict";

let Point = require ("./Point.js").Point;
let Field = require ("./Field.js").Field;
let Emitter = require ("./Emitter.js").Emitter;
let Particle = require ("./Particle.js").Particle;
let Random = require ("./Random.js").Random;

class ParticleSystem {

  // Creates a new ParticleSystem
  constructor(points) {
    this.maxParticles = 2000;
    this.particles = [];
    this.emitters = [];
    this.fields = [];
    this.elapsed = 0;
    this.gen = false;
    this.baseOrigin = new Point(0,0);
    this.rand = new Random();
    var that = this;
    if (points !== undefined) {
      points.forEach(function (point) {
        that.particles.push(new Particle(point));
      });
    }
    return this;
  };

  // Sets the origin of the Particle System
  setOrigin (point) {
    this.baseOrigin = point;
    return this;
  }

  // Sets the distribution function
  seed (val) {
    if (val !== undefined) {
      this.rand.setSeed(val);
    }
    return this;
  }

  // Adds a new Emitter, given a point in space and a velocity
  addEmitter(point, velocity, xsize, ysize, particleLife, spread, emissionRate) {
    this.emitters.push(new Emitter(point, velocity, xsize, ysize, particleLife, spread, emissionRate).seed(this.rand.random()));
    return this;
  }

  // Adds a new Field, given a point in space and its mass
  addField (point, mass, decay) {
    this.fields.push (new Field(point, mass, decay));
    return this;
  }

  // Sets the maximum number of particles in the system
  setMaxParticles (max) {
    this.maxParticles = max;
    return this;
  }

  bounded (width, height) {
    this.maxHeight = height;
    this.maxWidth = width;
    return this;
  }

  // Cleans the traces that are out of the boundaries
  clean () {
    if (this.maxHeight === undefined || this.maxWidth == undefined)
      return this;
    var that = this;
    this.particles.forEach (function (part, i) { // check the traces
        var newTraces = [];
        part.getTrace().forEach (function (pos, i) {
          if ( (pos.x <= that.baseOrigin.x + that.maxWidth) && (pos.y <= that.maxHeight + that.baseOrigin.y)) {
            newTraces.push(pos);
          }
        });
        part.traceRecord = newTraces;
    });

    var i = this.particles.length; // a particle out ot the limits without traces is removed
    while (i--) {
      if (!this.particles[i].getTrace().length)
        this.particles.splice(i,1);
    }
    return this;
  }

  // Checks all the registered emitters, getting new particles from them.
  // This method shouldn't be called directly, use evolve instead()
  addNewParticles () {
    var that = this;
    var emitParticles = function (emitter) {
      for (var i = 0; i < emitter.emissionRate; i++)
        that.particles.push(emitter.addParticle());
      }
    this.emitters.forEach(emitParticles);
    return this;
  }

  // Returns the particles in the system
  getParticles() { return this.particles; }

  // Returns the total particles count
  getParticleCount() {
    return this.particles.length;
  }

  // Returns the Emitters count
  getEmitterCount() {
    return this.emitters.length;
  }

  // Returns the Fields count
  getFieldCount() {
    return this.fields.length;
  }

  // Returns the particle's list
  getParticles () { return this.particles; }

  // This method triggers a particle generation on each registered Emitter and then updates
  // the particles position according to the registered Fields.
  evolve (steps) {
    var fields = this.fields;
    for (var step = 0; step < steps; step++) {
      if (this.particles.length < this.maxParticles)
        this.addNewParticles();
      this.particles.forEach (function(part) {
        part.submitToFields(fields);
        part.move();
      });
      fields.forEach(f => f.decay());
    };
    return this.clean();
  }
};

module.exports.ParticleSystem = ParticleSystem;
module.exports.Point = Point;
module.exports.Field = Field;
module.exports.Emitter = Emitter;
module.exports.Particle = Particle;
