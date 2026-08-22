require("./helpers/p5-stub")
let assert = require("assert")
let Layout = require("../src/Layout.js")

describe("Layout", () => {
  it("grid() returns (xrows-1)*(yrows-1) interior points", () => {
    let pts = Layout.grid(4, 3, 400, 300)
    assert.strictEqual(pts.length, 3 * 2)
    pts.forEach(p => {
      assert.ok(p.x > 0 && p.x < 400)
      assert.ok(p.y > 0 && p.y < 300)
    })
  })

  it("rof3() returns the four rule-of-thirds intersection points", () => {
    let pts = Layout.rof3(0, 0, 300, 300)
    assert.strictEqual(pts.length, 4)
    assert.deepStrictEqual(
      pts.map(p => ({x: p.x, y: p.y})),
      [
        {x: 100, y: 100},
        {x: 200, y: 100},
        {x: 200, y: 200},
        {x: 100, y: 200},
      ]
    )
  })

  it("rof3() offsets by the given x0/y0 origin", () => {
    let pts = Layout.rof3(50, 20, 300, 300)
    assert.strictEqual(pts[0].x, 150)
    assert.strictEqual(pts[0].y, 120)
  })

  it("cols() spaces points along the x axis until width is reached", () => {
    let pts = Layout.cols({x: 0, y: 5}, 10, 35)
    assert.deepStrictEqual(pts.map(p => p.x), [0, 10, 20, 30])
    pts.forEach(p => assert.strictEqual(p.y, 5))
  })

  it("rows() spaces points along the y axis until height is reached", () => {
    let pts = Layout.rows({x: 5, y: 0}, 10, 35)
    assert.deepStrictEqual(pts.map(p => p.y), [0, 10, 20, 30])
    pts.forEach(p => assert.strictEqual(p.x, 5))
  })

  it("spiral() returns points that move outward from the center", () => {
    let pts = Layout.spiral(60, 0, 0, 100, 3, 4)
    assert.ok(pts.length > 0)
    let firstDist = Math.hypot(pts[0].x, pts[0].y)
    let lastDist = Math.hypot(pts[pts.length - 1].x, pts[pts.length - 1].y)
    assert.ok(lastDist > firstDist)
  })
})
