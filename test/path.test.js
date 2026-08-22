require("./helpers/p5-stub")
let assert = require("assert")
let Path = require("../src/Path.js")

// Path only ever calls methods on scene.ctx -- a fake Canvas2D context that
// just logs calls is enough to test it without a real browser canvas.
function fakeScene() {
  let calls = []
  let ctx = new Proxy({}, {
    get(target, prop) {
      if (prop in target) return target[prop]
      return (...args) => calls.push([prop, ...args])
    },
    set(target, prop, value) {
      calls.push(["set:" + prop, value])
      target[prop] = value
      return true
    },
  })
  return {ctx, calls}
}

describe("Path", () => {
  it("m()/l() push move/line instructions", () => {
    let {ctx} = fakeScene()
    let p = new Path({ctx}).m(10, 20).l(30, 40)
    assert.deepStrictEqual(p.instrs, [
      {instr: "m", p: {x: 10, y: 20}},
      {instr: "l", p: {x: 30, y: 40}},
    ])
  })

  it("m()/l() accept an {x,y} object in place of two numbers", () => {
    let {ctx} = fakeScene()
    let p = new Path({ctx}).m({x: 1, y: 2})
    assert.deepStrictEqual(p.instrs[0], {instr: "m", p: {x: 1, y: 2}})
  })

  it("rect() builds a closed rectangle from its top-left corner", () => {
    let {ctx} = fakeScene()
    let p = new Path({ctx}).rect({x: 0, y: 0}, 40, 20)
    let corners = p.instrs.map(i => i.p)
    let xs = corners.map(c => c.x), ys = corners.map(c => c.y)
    assert.strictEqual(Math.min(...xs), 0)
    assert.strictEqual(Math.max(...xs), 40)
    assert.strictEqual(Math.min(...ys), 0)
    assert.strictEqual(Math.max(...ys), 20)
  })

  it("circle() pushes a single arc instruction", () => {
    let {ctx} = fakeScene()
    let p = new Path({ctx}).circle({x: 5, y: 5}, 12)
    assert.strictEqual(p.instrs.length, 1)
    assert.strictEqual(p.instrs[0].instr, "arc")
    assert.strictEqual(p.instrs[0].r, 12)
  })

  it("clone() deep-copies instructions and style, and drops `hide`", () => {
    let {ctx} = fakeScene()
    let original = new Path({ctx}, {fill: "red", hide: true}).m(1, 1)
    let cloned = original.clone()
    assert.deepStrictEqual(cloned.instrs, original.instrs)
    assert.notStrictEqual(cloned.instrs, original.instrs)
    assert.strictEqual(cloned.style.fill, "red")
    assert.strictEqual("hide" in cloned.style, false)
  })

  it("clone() merges in an override style without mutating the original", () => {
    let {ctx} = fakeScene()
    let original = new Path({ctx}, {fill: "red"})
    let cloned = original.clone({fill: "blue"})
    assert.strictEqual(cloned.style.fill, "blue")
    assert.strictEqual(original.style.fill, "red")
  })

  it("draw() replays instructions onto ctx in order", () => {
    let {ctx, calls} = fakeScene()
    new Path({ctx}, {stroke: "black", strokeWidth: 2}).m(0, 0).l(10, 10).draw()
    let opNames = calls.map(c => c[0])
    assert.ok(opNames.includes("moveTo"))
    assert.ok(opNames.includes("lineTo"))
    assert.ok(opNames.indexOf("moveTo") < opNames.indexOf("lineTo"))
  })

  it("draw() calls ctx.fill() when a fill style is set", () => {
    let {ctx, calls} = fakeScene()
    new Path({ctx}, {fill: "red"}).circle({x: 0, y: 0}, 5).draw()
    assert.ok(calls.some(c => c[0] === "fill"))
    assert.ok(calls.some(c => c[0] === "set:fillStyle" && c[1] === "red"))
  })

  it("draw() calls ctx.stroke() only when strokeWidth or stroke is set", () => {
    let {ctx: ctxNoStroke, calls: callsNoStroke} = fakeScene()
    new Path({ctx: ctxNoStroke}, {fill: "red"}).circle({x: 0, y: 0}, 5).draw()
    assert.ok(!callsNoStroke.some(c => c[0] === "stroke"))

    let {ctx: ctxStroke, calls: callsStroke} = fakeScene()
    new Path({ctx: ctxStroke}, {stroke: "black", strokeWidth: 3}).circle({x: 0, y: 0}, 5).draw()
    assert.ok(callsStroke.some(c => c[0] === "stroke"))
    assert.ok(callsStroke.some(c => c[0] === "set:lineWidth" && c[1] === 3))
  })

  it("rotate() rotates every point in the path around its center", () => {
    let {ctx} = fakeScene()
    let p = new Path({ctx}).m(10, 0).l(-10, 0)
    p.rotate(90, {x: 0, y: 0})
    assert.ok(Math.abs(p.instrs[0].p.x - 0) < 1e-9)
    assert.ok(Math.abs(p.instrs[0].p.y - 10) < 1e-9)
  })

  it("moveTo() translates every point so the path's center lands on the target", () => {
    let {ctx} = fakeScene()
    let p = new Path({ctx}).m(0, 0).l(10, 0)
    p.moveTo({x: 100, y: 100})
    let center = p.center()
    assert.ok(Math.abs(center.x - 100) < 1e-9)
    assert.ok(Math.abs(center.y - 100) < 1e-9)
  })
})
