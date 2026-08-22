require("./helpers/p5-stub")
let assert = require("assert")
let Point = require("../src/particles/Point.js").Point
let Field = require("../src/particles/Field.js").Field
let Particle = require("../src/particles/Particle.js").Particle
let Random = require("../src/particles/Random.js").Random
let {ParticleSystem} = require("../src/particles/ParticleSystem.js")

describe("particles/Point", () => {
  it("getMagnitude() returns the Euclidean length", () => {
    assert.strictEqual(new Point(3, 4).getMagnitude(), 5)
  })

  it("fromAngle() places a point at the given angle and magnitude", () => {
    let p = Point.fromAngle(0, 10)
    assert.ok(Math.abs(p.x - 10) < 1e-9)
    assert.ok(Math.abs(p.y - 0) < 1e-9)
  })

  it("add() accepts either a Point or a scalar", () => {
    assert.deepStrictEqual(new Point(1, 1).add(new Point(2, 3)), new Point(3, 4))
    assert.deepStrictEqual(new Point(1, 1).add(2), new Point(3, 3))
  })

  it("copy() returns an equal but distinct Point", () => {
    let original = new Point(5, 5)
    let copy = original.copy()
    assert.deepStrictEqual(copy, original)
    assert.notStrictEqual(copy, original)
  })
})

describe("particles/Random (seeded)", () => {
  it("produces the same sequence for the same seed", () => {
    let a = new Random(42)
    let b = new Random(42)
    let seqA = [a.random(), a.random(), a.random()]
    let seqB = [b.random(), b.random(), b.random()]
    assert.deepStrictEqual(seqA, seqB)
  })

  it("random(lower, upper) stays within range", () => {
    let r = new Random(7)
    for (let i = 0; i < 50; i++) {
      let v = r.random(5, 10)
      assert.ok(v >= 5 && v < 10)
    }
  })
})

describe("particles/Field", () => {
  it("decay() reduces mass by decayVal each call", () => {
    let f = new Field(new Point(0, 0), 100, 10)
    f.decay()
    assert.strictEqual(f.mass, 90)
    f.decay()
    assert.strictEqual(f.mass, 80)
  })
})

describe("particles/Particle", () => {
  it("move() advances position by velocity and records a trace point", () => {
    let particle = new Particle(new Point(0, 0), new Point(2, 3))
    particle.move()
    assert.deepStrictEqual(particle.position, new Point(2, 3))
    assert.strictEqual(particle.getTrace().length, 2)
  })

  it("KNOWN BUG: Field.js's comment claims negative mass attracts, but " +
     "submitToFields() accelerates AWAY from a negative-mass field", () => {
    let particle = new Particle(new Point(0, 0))
    let field = new Field(new Point(100, 0), -50)
    particle.submitToFields([field])
    // acceleration.x should point toward the field (positive) if this were a
    // real attractor; instead it points away (negative).
    assert.ok(particle.acceleration.x < 0)
  })

  it("positive mass genuinely attracts, per the real force calculation", () => {
    let particle = new Particle(new Point(0, 0))
    let field = new Field(new Point(100, 0), 50)
    particle.submitToFields([field])
    assert.ok(particle.acceleration.x > 0)
  })
})

describe("particles/ParticleSystem", () => {
  it("evolve() spawns particles from each emitter up to emissionRate per step", () => {
    let ps = new ParticleSystem()
    ps.addEmitter(new Point(0, 0), Point.fromAngle(0, 1), 0, 0, -1, 0, 5)
    ps.evolve(1)
    assert.strictEqual(ps.getParticleCount(), 5)
  })

  it("evolve() stops spawning once maxParticles is reached", () => {
    let ps = new ParticleSystem()
    ps.setMaxParticles(3)
    ps.addEmitter(new Point(0, 0), Point.fromAngle(0, 1), 0, 0, -1, 0, 5)
    ps.evolve(1)
    ps.evolve(1)
    assert.strictEqual(ps.getParticleCount(), 5)
  })

  it("bounded()+clean() removes a particle once its entire trace has left the bounds", () => {
    let ps = new ParticleSystem()
    ps.bounded(10, 10)
    // spawns motionless, already outside the [0,10]x[0,10] bounds
    ps.addEmitter(new Point(50, 50), Point.fromAngle(0, 0), 0, 0, -1, 0, 1)
    ps.evolve(1)
    assert.strictEqual(ps.getParticleCount(), 0)
  })

  it("bounded()+clean() keeps a particle whose trace is still within bounds", () => {
    let ps = new ParticleSystem()
    ps.bounded(1000, 1000)
    ps.addEmitter(new Point(0, 0), Point.fromAngle(0, 1), 0, 0, -1, 0, 1)
    ps.evolve(1)
    assert.strictEqual(ps.getParticleCount(), 1)
  })

  it("getEmitterCount() / getFieldCount() reflect what was added", () => {
    let ps = new ParticleSystem()
    ps.addEmitter(new Point(0, 0), Point.fromAngle(0, 1))
    ps.addField(new Point(1, 1), 10)
    assert.strictEqual(ps.getEmitterCount(), 1)
    assert.strictEqual(ps.getFieldCount(), 1)
  })
})
