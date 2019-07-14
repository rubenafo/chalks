
"use strict";

let Point = require ("./Point.js").Point;


  class Particle {

    // Creates a new Particle given a x,y point and a velocity
    constructor (point,velocity){
      this.position     = point || new Point(0,0);
      this.velocity     = velocity || new Point(0,0);
      this.initialVelocity = this.velocity.copy();
      this.acceleration = new Point(0,0);
      this.ttl          = -1;
      this.lived        = 0;
      this.traceRecord = [];
      this.traceRecord.push(this.position.copy());
    }

  // Updates the acceleration of this particle taking into account the fields surrounding the particle
  submitToFields (fields) {
    var that = this;
    var totalAccelerationX = 0;
    var totalAccelerationY = 0;
    fields.forEach (function(field) {
      var vectorX = field.position.x - that.position.x;
      var vectorY = field.position.y - that.position.y;
      var distance = Math.pow((vectorX*vectorX+vectorY*vectorY),0.5);
      //var normForce = new Point (vectorX/distance, vectorY/distance);
      var force = field.mass  / Math.pow(distance,2);
      totalAccelerationX += vectorX * force;
      totalAccelerationY += vectorY * force;
    });
    this.acceleration = new Point(totalAccelerationX,totalAccelerationY);
  }

  // Moves this particle according to its position, its velocity and its acceleration
  move() {
    //this.velocity.x = this.initialVelocity.x;
    //this.velocity.y = this.initialVelocity.y;
    this.velocity.x += this.acceleration.x;
    this.velocity.y += this.acceleration.y;
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
    this.traceRecord.push (this.position.copy());
  }

  // Returns the position of this particle
  getPos() { return this.position; }

  // Returns the trace history of the particle
  getTrace() { return this.traceRecord; }
};
module.exports.Particle = Particle;
