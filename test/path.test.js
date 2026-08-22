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

// True if `point` lies on the segment from `from` to `to` (collinear + between).
function isOnLine(point, from, to, tolerance = 1e-9) {
  let cross = (to.x - from.x) * (point.y - from.y) - (to.y - from.y) * (point.x - from.x)
  if (Math.abs(cross) > tolerance) return false
  let dot = (point.x - from.x) * (to.x - from.x) + (point.y - from.y) * (to.y - from.y)
  let lenSq = (to.x - from.x) ** 2 + (to.y - from.y) ** 2
  return dot >= -tolerance && dot <= lenSq + tolerance
}

function cubicBezierPoint(p0, c1, c2, p3, t) {
  let mt = 1 - t
  return {
    x: mt ** 3 * p0.x + 3 * mt ** 2 * t * c1.x + 3 * mt * t ** 2 * c2.x + t ** 3 * p3.x,
    y: mt ** 3 * p0.y + 3 * mt ** 2 * t * c1.y + 3 * mt * t ** 2 * c2.y + t ** 3 * p3.y,
  }
}

describe("Path", () => {
  it("l() expresses a straight line as a bezier curve with collinear control points", () => {
    let {ctx} = fakeScene()
    let p = new Path({ctx}).m(10, 20).l(30, 40)
    assert.strictEqual(p.instrs.length, 2)
    assert.deepStrictEqual(p.instrs[0], {instr: "m", p: {x: 10, y: 20}})
    let seg = p.instrs[1]
    assert.strictEqual(seg.instr, "b")
    assert.deepStrictEqual(seg.p2, {x: 30, y: 40})
    assert.ok(isOnLine(seg.c1, {x: 10, y: 20}, {x: 30, y: 40}))
    assert.ok(isOnLine(seg.c2, {x: 10, y: 20}, {x: 30, y: 40}))
  })

  it("consecutive l() calls chain each bezier segment from the previous one's endpoint", () => {
    let {ctx} = fakeScene()
    let p = new Path({ctx}).m(0, 0).l(10, 0).l(10, 10)
    assert.deepStrictEqual(p.instrs[1].p2, {x: 10, y: 0})
    // the second segment must start at (10,0), where the first one ended -- not back at (0,0)
    assert.ok(isOnLine(p.instrs[2].c1, {x: 10, y: 0}, {x: 10, y: 10}))
    assert.deepStrictEqual(p.instrs[2].p2, {x: 10, y: 10})
  })

  it("m()/l() accept an {x,y} object in place of two numbers", () => {
    let {ctx} = fakeScene()
    let p = new Path({ctx}).m({x: 1, y: 2})
    assert.deepStrictEqual(p.instrs[0], {instr: "m", p: {x: 1, y: 2}})
  })

  it("rect() builds a closed rectangle from its top-left corner, every edge as a bezier segment", () => {
    let {ctx} = fakeScene()
    let p = new Path({ctx}).rect({x: 0, y: 0}, 40, 20)
    assert.strictEqual(p.instrs[0].instr, "m")
    p.instrs.slice(1).forEach(i => assert.strictEqual(i.instr, "b"))
    let corners = [p.instrs[0].p, ...p.instrs.slice(1).map(i => i.p2)]
    let xs = corners.map(c => c.x), ys = corners.map(c => c.y)
    assert.strictEqual(Math.min(...xs), 0)
    assert.strictEqual(Math.max(...xs), 40)
    assert.strictEqual(Math.min(...ys), 0)
    assert.strictEqual(Math.max(...ys), 20)
  })

  it("rect()'s edges are true straight lines -- every control point is collinear with its edge", () => {
    let {ctx} = fakeScene()
    let p = new Path({ctx}).rect({x: 0, y: 0}, 40, 20)
    let corners = [p.instrs[0].p, ...p.instrs.slice(1).map(i => i.p2)]
    p.instrs.slice(1).forEach((seg, i) => {
      assert.ok(isOnLine(seg.c1, corners[i], corners[i + 1]))
      assert.ok(isOnLine(seg.c2, corners[i], corners[i + 1]))
    })
  })

  it("circle() approximates a full circle with 4 bezier segments landing back on the radius", () => {
    let {ctx} = fakeScene()
    let p = new Path({ctx}).circle({x: 0, y: 0}, 10)
    assert.strictEqual(p.instrs[0].instr, "m")
    let segments = p.instrs.slice(1)
    assert.strictEqual(segments.length, 4)
    segments.forEach(s => {
      assert.strictEqual(s.instr, "b")
      assert.ok(Math.abs(Math.hypot(s.p2.x, s.p2.y) - 10) < 1e-9)
    })
  })

  it("circle()'s bezier approximation stays within ~0.1% of the true arc at each segment's midpoint", () => {
    let {ctx} = fakeScene()
    let r = 100
    let p = new Path({ctx}).circle({x: 0, y: 0}, r)
    let start = p.instrs[0].p
    let seg = p.instrs[1]
    let mid = cubicBezierPoint(start, seg.c1, seg.c2, seg.p2, 0.5)
    let dist = Math.hypot(mid.x, mid.y)
    assert.ok(Math.abs(dist - r) < r * 0.001)
  })

  it("circle() splits a large arc into multiple <=90deg bezier segments", () => {
    let {ctx} = fakeScene()
    let p = new Path({ctx}).circle({x: 0, y: 0}, 10, 0, Math.PI) // half circle = 180deg
    assert.strictEqual(p.instrs.slice(1).length, 2) // 180 / 90 = 2 segments
  })

  it("circle() uses a single segment for a small arc", () => {
    let {ctx} = fakeScene()
    let p = new Path({ctx}).circle({x: 0, y: 0}, 10, 0, Math.PI / 4) // 45deg
    assert.strictEqual(p.instrs.slice(1).length, 1)
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

  it("draw() replays instructions onto ctx as moveTo followed by bezierCurveTo (never lineTo)", () => {
    let {ctx, calls} = fakeScene()
    new Path({ctx}, {stroke: "black", strokeWidth: 2}).m(0, 0).l(10, 10).draw()
    let opNames = calls.map(c => c[0])
    assert.ok(opNames.includes("moveTo"))
    assert.ok(opNames.includes("bezierCurveTo"))
    assert.ok(!opNames.includes("lineTo"))
    assert.ok(opNames.indexOf("moveTo") < opNames.indexOf("bezierCurveTo"))
  })

  it("draw() replays circle() as moveTo followed by bezierCurveTo (never arc)", () => {
    let {ctx, calls} = fakeScene()
    new Path({ctx}, {fill: "red"}).circle({x: 0, y: 0}, 5).draw()
    let opNames = calls.map(c => c[0])
    assert.ok(opNames.includes("moveTo"))
    assert.ok(opNames.includes("bezierCurveTo"))
    assert.ok(!opNames.includes("arc"))
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

  it("rotate() rotates every point in the path around a given pivot", () => {
    let {ctx} = fakeScene()
    let p = new Path({ctx}).m(10, 0).l(-10, 0)
    p.rotate(90, {x: 0, y: 0})
    assert.ok(Math.abs(p.instrs[0].p.x - 0) < 1e-9)
    assert.ok(Math.abs(p.instrs[0].p.y - 10) < 1e-9)
  })

  it("rotate() defaults to pivoting around the path's own center", () => {
    let {ctx} = fakeScene()
    let p = new Path({ctx}).m(0, 0).l(10, 0)
    let centerBefore = p.center()
    p.rotate(180)
    let centerAfter = p.center()
    assert.ok(Math.abs(centerAfter.x - centerBefore.x) < 1e-9)
    assert.ok(Math.abs(centerAfter.y - centerBefore.y) < 1e-9)
  })

  it("rotate() keeps a bezier-based straight edge straight (rigid transform, not just endpoint rotation)", () => {
    let {ctx} = fakeScene()
    let p = new Path({ctx}).rect({x: 0, y: 0}, 40, 20)
    p.rotate(37, {x: 20, y: 10})
    let corners = [p.instrs[0].p, ...p.instrs.slice(1).map(i => i.p2)]
    p.instrs.slice(1).forEach((seg, i) => {
      assert.ok(isOnLine(seg.c1, corners[i], corners[i + 1], 1e-6))
      assert.ok(isOnLine(seg.c2, corners[i], corners[i + 1], 1e-6))
    })
  })

  it("rotate(360) returns every point to its original coordinates", () => {
    let {ctx} = fakeScene()
    let p = new Path({ctx}).rect({x: 10, y: 10}, 40, 20)
    let before = JSON.parse(JSON.stringify(p.instrs))
    p.rotate(360)
    // Not a bit-exact roundtrip: Math.sin(360deg in radians) leaves a ~1e-16
    // residual rather than landing on exactly 0 (Math.PI is itself only an
    // approximation of pi), so a 360deg spin lands within floating-point
    // precision of the start, not literally === to it. Compare with a tight
    // epsilon instead of strict/deep equality.
    p.instrs.forEach((instr, i) => {
      Object.keys(instr).forEach(k => {
        if (k === "instr") return
        assert.ok(Math.abs(instr[k].x - before[i][k].x) < 1e-9)
        assert.ok(Math.abs(instr[k].y - before[i][k].y) < 1e-9)
      })
    })
  })

  it("translate() shifts every point by a relative (dx,dy) offset", () => {
    let {ctx} = fakeScene()
    let p = new Path({ctx}).rect({x: 0, y: 0}, 40, 20)
    p.translate(5, 7)
    let corners = [p.instrs[0].p, ...p.instrs.slice(1).map(i => i.p2)]
    let xs = corners.map(c => c.x), ys = corners.map(c => c.y)
    assert.strictEqual(Math.min(...xs), 5)
    assert.strictEqual(Math.max(...xs), 45)
    assert.strictEqual(Math.min(...ys), 7)
    assert.strictEqual(Math.max(...ys), 27)
  })

  it("translate() accepts an {x,y} object in place of two numbers", () => {
    let {ctx} = fakeScene()
    let p = new Path({ctx}).m(0, 0)
    p.translate({x: 3, y: 4})
    assert.deepStrictEqual(p.instrs[0].p, {x: 3, y: 4})
  })

  it("translate() is a rigid transform -- shape and size are preserved", () => {
    let {ctx} = fakeScene()
    let p = new Path({ctx}).circle({x: 0, y: 0}, 10)
    p.translate(50, -20)
    p.instrs.slice(1).forEach(seg => {
      let dist = Math.hypot(seg.p2.x - 50, seg.p2.y - (-20))
      assert.ok(Math.abs(dist - 10) < 1e-9)
    })
  })

  it("translate() is chainable", () => {
    let {ctx} = fakeScene()
    let p = new Path({ctx}).m(0, 0)
    assert.strictEqual(p.translate(1, 1), p)
  })

  it("moveTo() moves the path's center to an absolute target (built on translate())", () => {
    let {ctx} = fakeScene()
    let p = new Path({ctx}).m(0, 0).l(10, 0)
    p.moveTo({x: 100, y: 100})
    let center = p.center()
    assert.ok(Math.abs(center.x - 100) < 1e-9)
    assert.ok(Math.abs(center.y - 100) < 1e-9)
  })
})
