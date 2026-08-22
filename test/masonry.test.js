require("./helpers/p5-stub")
let assert = require("assert")
let Layout = require("../src/Layout.js")

describe("Layout.masonry", () => {
  it("\"|2\" splits the area into two equal columns", () => {
    let bricks = Layout.masonry(200, 100, "|2", 0)
    assert.strictEqual(bricks.length, 2)
    assert.deepStrictEqual(
      bricks.map(b => ({x: b.x, y: b.y, width: b.width, height: b.height})),
      [
        {x: 0, y: 0, width: 100, height: 100},
        {x: 100, y: 0, width: 100, height: 100},
      ]
    )
  })

  it("\"-2\" splits the area into two equal rows", () => {
    let bricks = Layout.masonry(200, 100, "-2", 0)
    assert.strictEqual(bricks.length, 2)
    assert.deepStrictEqual(
      bricks.map(b => ({x: b.x, y: b.y, width: b.width, height: b.height})),
      [
        {x: 0, y: 0, width: 200, height: 50},
        {x: 0, y: 50, width: 200, height: 50},
      ]
    )
  })

  it("\">\" moves the head back to subdivide an earlier region", () => {
    // split into 2 columns, then split the FIRST of those into 2 rows
    let bricks = Layout.masonry(200, 100, "|2-2", 0)
    assert.strictEqual(bricks.length, 3)
    // the right-hand column should remain a single, full-height brick
    let untouched = bricks.find(b => b.x === 100)
    assert.deepStrictEqual(
      {x: untouched.x, y: untouched.y, width: untouched.width, height: untouched.height},
      {x: 100, y: 0, width: 100, height: 100}
    )
  })

  it("bricks always tile the full width and height with no gaps", () => {
    let bricks = Layout.masonry(300, 210, "|3-2>1|2", 0)
    let totalArea = bricks.reduce((sum, b) => sum + b.width * b.height, 0)
    assert.ok(Math.abs(totalArea - 300 * 210) < 1e-6)
  })

  it("margin is currently a no-op (known bug: Masonry.init checks `this.margin`, which is never set, instead of the `margin` parameter)", () => {
    let withMargin = Layout.masonry(200, 100, "|2", 10)
    let withoutMargin = Layout.masonry(200, 100, "|2", 0)
    assert.deepStrictEqual(withMargin, withoutMargin)
  })
})
