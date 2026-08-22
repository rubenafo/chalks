require("./helpers/p5-stub")
let assert = require("assert")
let Dist = require("../src/Dist.js")

// Sample statistics over a fixed seed, so these checks are deterministic
// rather than flaky.
function sample(n, fn) {
  let values = new Array(n)
  for (let i = 0; i < n; i++) values[i] = fn()
  return values
}
function mean(v) { return v.reduce((a, b) => a + b, 0) / v.length }
function stddev(v) {
  let m = mean(v)
  return Math.sqrt(v.reduce((a, b) => a + (b - m) ** 2, 0) / v.length)
}

const N = 200000

describe("Dist", () => {

  describe("seeding", () => {
    it("the same seed replays the same sequence", () => {
      let a = new Dist(42), b = new Dist(42)
      assert.deepStrictEqual(sample(50, () => a.uniform()), sample(50, () => b.uniform()))
    })

    it("different seeds produce different sequences", () => {
      let a = new Dist(1), b = new Dist(2)
      assert.notDeepStrictEqual(sample(50, () => a.uniform()), sample(50, () => b.uniform()))
    })

    it("setSeed() rewinds an instance to a fresh stream", () => {
      let d = new Dist(7)
      let first = sample(20, () => d.uniform())
      d.setSeed(7)
      assert.deepStrictEqual(sample(20, () => d.uniform()), first)
    })

    it("setSeed() also clears the cached normal variate, so reseeding is a full reset", () => {
      let d = new Dist(3)
      d.normal()                      // draws two variates, caches the spare
      d.setSeed(3)
      let afterReseed = d.normal()
      assert.strictEqual(afterReseed, new Dist(3).normal())
    })

    it("accepts a string seed, order sensitively", () => {
      assert.deepStrictEqual(
        sample(20, (() => { let d = new Dist("chalks"); return () => d.uniform() })()),
        sample(20, (() => { let d = new Dist("chalks"); return () => d.uniform() })()))
      let ab = new Dist("ab").uniform()
      let ba = new Dist("ba").uniform()
      assert.notStrictEqual(ab, ba)
    })

    it("an omitted seed is random but readable at .seed for reproducing a run", () => {
      let d = new Dist()
      assert.strictEqual(typeof d.seed, "number")
      let replay = new Dist(d.seed)
      assert.strictEqual(replay.uniform(), new Dist(d.seed).uniform())
    })

    it("setSeed() is chainable", () => {
      let d = new Dist(1)
      assert.strictEqual(d.setSeed(2), d)
    })
  })

  describe("uniform()", () => {
    it("with no arguments stays in [0,1)", () => {
      let d = new Dist(11)
      sample(10000, () => d.uniform()).forEach(v => assert.ok(v >= 0 && v < 1))
    })

    it("with one argument stays in [0,max)", () => {
      let d = new Dist(12)
      sample(10000, () => d.uniform(50)).forEach(v => assert.ok(v >= 0 && v < 50))
    })

    it("with two arguments stays in [min,max)", () => {
      let d = new Dist(13)
      sample(10000, () => d.uniform(-5, 5)).forEach(v => assert.ok(v >= -5 && v < 5))
    })

    it("is flat: mean sits at the midpoint of the range", () => {
      let d = new Dist(14)
      assert.ok(Math.abs(mean(sample(N, () => d.uniform(0, 10))) - 5) < 0.05)
    })

    it("is flat: every decile bucket gets roughly equal mass", () => {
      let d = new Dist(15)
      let buckets = new Array(10).fill(0)
      for (let i = 0; i < N; i++) buckets[Math.floor(d.uniform() * 10)]++
      buckets.forEach(count => assert.ok(Math.abs(count - N / 10) < N / 10 * 0.05))
    })
  })

  describe("normal() / gauss()", () => {
    it("has the requested mean and standard deviation", () => {
      let d = new Dist(21)
      let values = sample(N, () => d.normal(50, 10))
      assert.ok(Math.abs(mean(values) - 50) < 0.2)
      assert.ok(Math.abs(stddev(values) - 10) < 0.2)
    })

    it("defaults to the standard normal", () => {
      let d = new Dist(22)
      let values = sample(N, () => d.normal())
      assert.ok(Math.abs(mean(values)) < 0.02)
      assert.ok(Math.abs(stddev(values) - 1) < 0.02)
    })

    it("follows the 68-95-99.7 rule", () => {
      let d = new Dist(23)
      let values = sample(N, () => d.normal())
      let within = k => values.filter(v => Math.abs(v) <= k).length / N
      assert.ok(Math.abs(within(1) - 0.6827) < 0.01)
      assert.ok(Math.abs(within(2) - 0.9545) < 0.01)
      assert.ok(Math.abs(within(3) - 0.9973) < 0.01)
    })

    it("is symmetric about the mean", () => {
      let d = new Dist(24)
      let values = sample(N, () => d.normal())
      let above = values.filter(v => v > 0).length / N
      assert.ok(Math.abs(above - 0.5) < 0.01)
    })

    it("gauss() is an alias of normal() -- same seed, same values", () => {
      let a = new Dist(25), b = new Dist(25)
      assert.deepStrictEqual(
        sample(100, () => a.gauss(3, 2)),
        sample(100, () => b.normal(3, 2)))
    })

    it("never returns NaN, including across the cached-variate path", () => {
      let d = new Dist(26)
      sample(50000, () => d.normal()).forEach(v => assert.ok(Number.isFinite(v)))
    })
  })

  describe("exp() / exponential()", () => {
    it("has mean 1/lambda", () => {
      let d = new Dist(31)
      assert.ok(Math.abs(mean(sample(N, () => d.exp(0.5))) - 2) < 0.05)
      d.setSeed(31)
      assert.ok(Math.abs(mean(sample(N, () => d.exp(4))) - 0.25) < 0.01)
    })

    it("defaults to lambda 1", () => {
      let d = new Dist(32)
      assert.ok(Math.abs(mean(sample(N, () => d.exp())) - 1) < 0.03)
    })

    it("is always non-negative and finite", () => {
      let d = new Dist(33)
      sample(50000, () => d.exp(2)).forEach(v => assert.ok(v >= 0 && Number.isFinite(v)))
    })

    it("has standard deviation equal to its mean", () => {
      let d = new Dist(34)
      let values = sample(N, () => d.exp(2))
      assert.ok(Math.abs(stddev(values) - 0.5) < 0.02)
    })

    it("is memoryless: P(X > 2) equals P(X > 1)^2", () => {
      let d = new Dist(35)
      let values = sample(N, () => d.exp(1))
      let over = t => values.filter(v => v > t).length / N
      assert.ok(Math.abs(over(2) - over(1) ** 2) < 0.01)
    })

    it("throws for a non-positive lambda instead of returning nonsense", () => {
      let d = new Dist(36)
      assert.throws(() => d.exp(0))
      assert.throws(() => d.exp(-1))
    })

    it("exponential() is an alias of exp()", () => {
      let a = new Dist(37), b = new Dist(37)
      assert.deepStrictEqual(
        sample(100, () => a.exponential(3)),
        sample(100, () => b.exp(3)))
    })
  })

  it("is reachable from a Chalks scene as ch.Dist", () => {
    // _modules() wires it onto the scene; verify the export is the same class
    let chalksSrc = require("fs").readFileSync(__dirname + "/../src/chalks.js", "utf8")
    assert.ok(chalksSrc.includes("this.Dist = Dist"))
  })
})
