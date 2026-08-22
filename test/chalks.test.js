require("./helpers/scene-stub")
let assert = require("assert")
let Scene = require("../src/chalks.js")

describe("Chalks (Scene) seed requirement", () => {
  it("throws when seed is omitted entirely", () => {
    assert.throws(() => new Scene({width: 100, height: 100}))
  })

  it("throws when seed is a string", () => {
    // p5's randomSeed() strictly requires a Number under its friendly-error
    // system, even for a numeric-looking string -- reject it here instead of
    // letting it fail deep inside p5 with a confusing message.
    assert.throws(() => new Scene({width: 100, height: 100, seed: "42"}))
  })

  it("throws when seed is NaN", () => {
    assert.throws(() => new Scene({width: 100, height: 100, seed: NaN}))
  })

  it("throws when seed is Infinity", () => {
    assert.throws(() => new Scene({width: 100, height: 100, seed: Infinity}))
  })

  it("throws when seed is null or undefined", () => {
    assert.throws(() => new Scene({width: 100, height: 100, seed: null}))
    assert.throws(() => new Scene({width: 100, height: 100, seed: undefined}))
  })

  it("accepts a numeric seed and stores it as-is", () => {
    let scene = new Scene({width: 100, height: 100, seed: 42})
    assert.strictEqual(scene.seed, 42)
  })

  it("accepts a seed of exactly 0 (previously silently discarded by a truthy check)", () => {
    let scene = new Scene({width: 100, height: 100, seed: 0})
    assert.strictEqual(scene.seed, 0)
  })

  it("accepts a negative seed", () => {
    let scene = new Scene({width: 100, height: 100, seed: -7})
    assert.strictEqual(scene.seed, -7)
  })
})
