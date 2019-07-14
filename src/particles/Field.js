
"use strict";

let Point = require ("./Point.js").Point;

  class Field {

    // Creates a new Field given a point and a mass. Use a negative mass for attractors and positive for repulsive behaviour.
    constructor (point, mass, decay) {
      this.position   = point || new Point(0,0) ;
      this.mass       = mass || 100;
      this.decayVal   = decay || 0;
    }

    decay () {
      this.mass = this.mass - this.decayVal;
    }
}
module.exports.Field = Field;
