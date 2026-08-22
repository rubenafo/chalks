require("./helpers/p5-stub")
let assert = require("assert")
let Rnd = require("../src/Rnd.js").Rnd

describe("Rnd", () => {
  let rnd

  beforeEach(() => { rnd = new Rnd() })

  it("normal() returns a finite number", () => {
    for (let i = 0; i < 20; i++) {
      assert.ok(Number.isFinite(rnd.normal(0, 1)))
    }
  })

  it("geo() returns a finite number", () => {
    for (let i = 0; i < 20; i++) {
      assert.ok(Number.isFinite(rnd.geo(0.5)))
    }
  })
})
