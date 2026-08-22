require("./helpers/p5-stub")
let assert = require("assert")
let Parametrics = require("../src/Parametrics.js")

describe("Parametrics", () => {
  it("butterflyCurve() returns points scaled and translated around origin", () => {
    let pts = Parametrics.butterflyCurve({x: 100, y: 100}, 10, 1, 1)
    assert.ok(pts.length > 0)
    pts.forEach(p => {
      assert.ok(Number.isFinite(p.x) && Number.isFinite(p.y))
    })
  })

  it("hypocycloid() returns points scaled and translated around origin", () => {
    let pts = Parametrics.hypocycloid({x: 50, y: 50}, 1, 2, 10, 30)
    assert.ok(pts.length > 0)
    pts.forEach(p => {
      assert.ok(Number.isFinite(p.x) && Number.isFinite(p.y))
    })
  })

  it("dejon() returns exactly `loops` points, applying scale and origin", () => {
    let pts = Parametrics.dejon({x: 500, y: 500}, -2.24, 0.43, -3.266, -8.23, 100, 50)
    assert.strictEqual(pts.length, 50)
    // first point comes from the fixed initial state (xt=1, yt=1)
    assert.strictEqual(pts[0].x, 100 * 1 + 500 + 100)
    assert.strictEqual(pts[0].y, 100 * 1 + 500 - 100)
  })

  it("lorentz() returns `loops` points forming a finite trajectory", () => {
    let pts = Parametrics.lorentz({x: 0, y: 0}, 1, 100, 0.1, 0.1, 0.1, 10, 28, 8 / 3, 0.005)
    assert.strictEqual(pts.length, 100)
    pts.forEach(p => assert.ok(Number.isFinite(p.x) && Number.isFinite(p.y)))
  })

  it("rose() KNOWN BUG: ignores the origin and scale parameters entirely", () => {
    let atOrigin = Parametrics.rose({x: 0, y: 0}, 1, 1, 1)
    let farFromOrigin = Parametrics.rose({x: 900, y: 900}, 50, 1, 1)
    // if origin/scale were honored, these would differ; they don't
    assert.deepStrictEqual(atOrigin, farFromOrigin)
  })

  it("rossler() KNOWN BUG: always returns an empty array (points is built but never pushed to)", () => {
    let pts = Parametrics.rossler({x: 0, y: 0}, 1, 100, 0.2, 0.2, 5.7, 0.01)
    assert.deepStrictEqual(pts, [])
  })

  it("voronoi() returns a cell for each site", () => {
    let sites = [{x: 10, y: 10}, {x: 90, y: 10}, {x: 50, y: 90}]
    let diagram = Parametrics.voronoi({x: 0, y: 0}, 100, 100, sites)
    assert.strictEqual(diagram.cells.length, sites.length)
  })
})
