require("./helpers/p5-stub")
let assert = require("assert")
let Points = require("../src/Points.js")

describe("Points", () => {
  it("subd() inserts a midpoint between each pair of points", () => {
    let pts = [{x: 0, y: 0}, {x: 20, y: 50}, {x: 80, y: 70}]
    let sub = Points.subd(pts)
    assert.strictEqual(sub.length, 5)
    assert.strictEqual(sub[0], pts[0])
    assert.strictEqual(sub[1].x, 10)
    assert.strictEqual(sub[1].y, 25)
    assert.strictEqual(sub[4], pts[2])
  })

  it("subd() is a no-op shape-wise on a single point", () => {
    let pts = [{x: 5, y: 5}]
    assert.deepStrictEqual(Points.subd(pts), [{x: 5, y: 5}])
  })

  it("closest() returns the nearest other point", () => {
    let target = {x: 0, y: 0}
    let candidates = [{x: 10, y: 10}, {x: 1, y: 1}, {x: -5, y: -5}]
    assert.deepStrictEqual(Points.closest(target, candidates), {x: 1, y: 1})
  })

  it("rotatePoint() rotates 90 degrees around the origin", () => {
    let rotated = Points.rotatePoint({x: 10, y: 0}, 90, {x: 0, y: 0})
    assert.ok(Math.abs(rotated.x - 0) < 1e-9)
    assert.ok(Math.abs(rotated.y - 10) < 1e-9)
  })

  it("rotatePoint() leaves a point unchanged for a 0 degree rotation", () => {
    let p = {x: 7, y: -3}
    let rotated = Points.rotatePoint(p, 0, {x: 2, y: 2})
    assert.ok(Math.abs(rotated.x - p.x) < 1e-9)
    assert.ok(Math.abs(rotated.y - p.y) < 1e-9)
  })

  it("noise() returns the same number of points, each within range of the original", () => {
    let pts = [{x: 0, y: 0}, {x: 100, y: 100}]
    let noised = Points.noise(pts, 10)
    assert.strictEqual(noised.length, pts.length)
    noised.forEach((p, i) => {
      assert.ok(p.x >= pts[i].x && p.x <= pts[i].x + 10)
      assert.ok(p.y >= pts[i].y && p.y <= pts[i].y + 10)
    })
  })

  it("rslice() returns a subset of the input array", () => {
    let pts = Array.from({length: 50}, (_, i) => ({x: i, y: i}))
    let sliced = Points.rslice(pts, 5, 15)
    assert.ok(Array.isArray(sliced))
    assert.ok(sliced.length <= pts.length)
  })
})
