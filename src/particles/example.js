
"use strict";

let ParticleSystem = require ("./ParticleSystem.js").ParticleSystem;
let Point = require ("./Point.js").Point;

function main (){

    var particleSystem = new ParticleSystem();
    particleSystem.addEmitter(new Point(360,230),Point.fromAngle(0,2));
    particleSystem.addField(new Point(700,230), -140);
    for (var i = 0; i < 5; i++) {
      particleSystem.evolve(200);
      particleSystem.getParticles().forEach(function (part) {
        console.log(part);
      });
    }
    console.log("total = " + particleSystem.getParticleCount());
    console.log("emitters = " + particleSystem.getEmitterCount());
    console.log("fields = " + particleSystem.getFieldCount());
}

main ();
