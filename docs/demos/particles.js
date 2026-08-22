// Particles: an emitter stream pulled toward an attractor field, animated.
let ch, ps

function setup() {
  ch = new Chalks({width: 420, height: 420, seed: 21}, {fill: "#0b0c10"})
  ps = new ch.Particles.ParticleSystem()
  ps.bounded(420, 420)
  ps.setMaxParticles(150)
  ps.addEmitter(new ch.Particles.Point(60, 350), ch.Particles.Point.fromAngle(-1.15, 3), 20, 0, -1, Math.PI / 10, 3)
  // Field.js's doc comment claims negative mass attracts, but the actual
  // force math in Particle.submitToFields() does the opposite -- positive
  // mass is what pulls particles in. Using the real behavior here.
  ps.addField(new ch.Particles.Point(340, 90), 45, 0)
}

function draw() {
  background(11, 12, 16, 60)
  ps.evolve(1)
  ps.getParticles().forEach(part => {
    ch.path({fill: "#66fcf1", alpha: 0.85}).circle(part.position, 3).draw()
  })
}
