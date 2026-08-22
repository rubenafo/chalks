/**
* @license

* Copyright 2019 Ruben Afonso, rubenaf.com
* This source code is licensed under the Apache license (see LICENSE file)
**/

"use strict"

// ---------------------------------------------------------------------------
// Storage
//
// A path is held in two flat, growable numeric arrays rather than an array of
// per-instruction objects:
//
//   _ops     one opcode per instruction
//   _coords  the operands of every instruction, packed end to end
//
// Each opcode occupies a fixed number of slots in _coords: its transformable
// x,y pairs first, then any trailing scalar that must NOT be transformed
// (only ARCTO has one, its radius).
//
// This is what lets translate(), rotate(), center() and draw() walk a path as
// a tight numeric loop with zero per-point allocation, and lets clone() copy a
// path with two slice()s instead of a JSON round trip.
//
// These are plain arrays, not Float64Array/Uint8Array: V8 stores them unboxed
// (PACKED_DOUBLE_ELEMENTS / PACKED_SMI_ELEMENTS), giving the same flat memory
// layout, but they are far cheaper to allocate and grow for the short-lived
// single-shape paths that dominate real sketches (one per dot in a scatter).
// Every value pushed is coerced with unary + so the arrays never transition
// away from the unboxed representation.
// ---------------------------------------------------------------------------

const MOVE = 0, BEZIER = 1, QUAD = 2, ARCTO = 3

const OP_PAIRS   = [1, 3, 2, 2]  // transformable x,y pairs
const OP_SCALARS = [0, 0, 0, 1]  // trailing non-positional operands
const OP_SLOTS   = [2, 6, 4, 5]  // total slots = pairs * 2 + scalars
const OP_END     = [0, 4, 2, 2]  // slot offset of the instruction's endpoint x

class Path {

  constructor (scene, style={}) {
    this.style = style
    this.parent = scene
    this.ctx = scene.ctx
    this.clippedBy = undefined
    this._ops = []
    this._coords = []
    this._endOff = -1  // _coords index of the current point's x (-1 when empty)
  }

  /**
   * The path's instructions as plain objects, in the pre-1.x shape
   * ({instr:"b", c1, c2, p2} and friends). Materialized on each access from
   * the packed arrays, so it is a read-only snapshot: mutating the returned
   * objects does not affect the path. Use the builder methods and
   * translate()/rotate() to modify a path.
   */
  get instrs() {
    const k = this._coords
    let out = new Array(this._ops.length)
    let c = 0
    for (let i = 0; i < this._ops.length; i++) {
      const op = this._ops[i]
      switch (op) {
        case MOVE:
          out[i] = {instr: "m", p: {x: k[c], y: k[c+1]}}
          break
        case BEZIER:
          out[i] = {instr: "b",
            c1: {x: k[c],   y: k[c+1]},
            c2: {x: k[c+2], y: k[c+3]},
            p2: {x: k[c+4], y: k[c+5]}}
          break
        case QUAD:
          out[i] = {instr: "q", c: {x: k[c], y: k[c+1]}, p: {x: k[c+2], y: k[c+3]}}
          break
        case ARCTO:
          out[i] = {instr: "a",
            p1: {x: k[c],   y: k[c+1]},
            p2: {x: k[c+2], y: k[c+3]}, r: k[c+4]}
          break
      }
      c += OP_SLOTS[op]
    }
    return out
  }

  /** Number of instructions in the path. */
  get length() { return this._ops.length }

  // Records an opcode and where its endpoint will land, then returns the base
  // index its operands should be written at.
  _open(op) {
    this._ops.push(op)
    const base = this._coords.length
    this._endOff = base + OP_END[op]
    return base
  }

  // Current pen position, i.e. the endpoint of the last instruction.
  _curX() { return this._endOff < 0 ? 0 : this._coords[this._endOff] }
  _curY() { return this._endOff < 0 ? 0 : this._coords[this._endOff + 1] }

  _bezierTo(c1x, c1y, c2x, c2y, px, py) {
    this._open(BEZIER)
    this._coords.push(+c1x, +c1y, +c2x, +c2y, +px, +py)
    return this
  }

  // Clone a path.
  // "hide" style parameter is not propagated.
  // The style is copied shallowly on purpose: it may hold a live CanvasGradient
  // (from Scene.lgrad/rgrad), which a deep copy would flatten into a dead {}.
  clone(style={}) {
    let newStyle = Object.assign({}, this.style, style)
    delete newStyle.hide
    let newPath = new Path(this.parent, newStyle)
    newPath._ops = this._ops.slice()
    newPath._coords = this._coords.slice()
    newPath._endOff = this._endOff
    return newPath
  }

  m(x,y) {
    const px = typeof(x) === "object" ? x.x : x
    const py = typeof(x) === "object" ? x.y : y
    this._open(MOVE)
    this._coords.push(+px, +py)
    return this
  }

  // A straight line, expressed as a cubic bezier whose control points sit on
  // the line itself (at 1/3 and 2/3), so it renders identically to lineTo().
  l(x,y) {
    const px = typeof(x) === "object" ? x.x : x
    const py = typeof(x) === "object" ? x.y : y
    const fx = this._curX(), fy = this._curY()
    const dx = px - fx, dy = py - fy
    return this._bezierTo(fx + dx/3, fy + dy/3, fx + dx*2/3, fy + dy*2/3, px, py)
  }

  bezier(c1, c2, p2) {
    return this._bezierTo(c1.x, c1.y, c2.x, c2.y, p2.x, p2.y)
  }

  bc (p) {
    if (this._ops.length === 0 || this._ops[this._ops.length-1] !== BEZIER)
      throw ("Previous instruction to bc() must be bezier()")
    const prev = this._coords.length - OP_SLOTS[BEZIER]
    const k = this._coords
    return this._bezierTo(k[prev], k[prev+1], k[prev+2], k[prev+3], p.x, p.y)
  }

  arc(p1, p2, r) {
    this._open(ARCTO)
    this._coords.push(+p1.x, +p1.y, +p2.x, +p2.y, +r)
    return this
  }

  quad(c, p) {
    this._open(QUAD)
    this._coords.push(+c.x, +c.y, +p.x, +p.y)
    return this
  }

  center() {
    const k = this._coords, ops = this._ops, n = ops.length
    let sx = 0, sy = 0, pts = 0, c = 0
    for (let i = 0; i < n; i++) {
      const op = ops[i]
      for (let pair = OP_PAIRS[op]; pair > 0; pair--) {
        sx += k[c]; sy += k[c+1]
        c += 2; pts++
      }
      c += OP_SCALARS[op]
    }
    return pts ? createVector(sx / pts, sy / pts) : createVector(0, 0)
  }

  shadow(blur=0, color="black", alpha=1, x=5, y=5) {
    this.ctx.shadowBlur = blur
    this.ctx.shadowColor = color
    this.ctx.shadowOffsetX = x
    this.ctx.shadowOffsetY = y
    this.ctx.shadowAlpha = alpha
    return this
  }

  // Shifts every point in the path by a relative (dx,dy) offset.
  translate(dx, dy) {
    const ax = typeof(dx) === "object" ? dx.x : dx
    const ay = typeof(dx) === "object" ? dx.y : dy
    const k = this._coords, ops = this._ops, n = ops.length
    let c = 0
    for (let i = 0; i < n; i++) {
      const op = ops[i]
      for (let pair = OP_PAIRS[op]; pair > 0; pair--) {
        k[c] += ax; k[c+1] += ay
        c += 2
      }
      c += OP_SCALARS[op]
    }
    return this
  }

  // Moves the path so its center lands on the given absolute point.
  moveTo(p0,y) {
    let p = typeof(p0) === "object" ? p0 : {x:p0, y:y}
    let center = this.center()
    return this.translate(p.x - center.x, p.y - center.y)
  }

  // Rotates the path `deg` degrees around `pt` (the path's center by default).
  // sin/cos are evaluated once for the whole path rather than per point.
  rotate (deg, pt) {
    const pivot = pt || this.center()
    const radians = deg * Math.PI / 180.0
    const cos = Math.cos(radians), sin = Math.sin(radians)
    const px = pivot.x, py = pivot.y
    const k = this._coords, ops = this._ops, n = ops.length
    let c = 0
    for (let i = 0; i < n; i++) {
      const op = ops[i]
      for (let pair = OP_PAIRS[op]; pair > 0; pair--) {
        const dx = k[c] - px, dy = k[c+1] - py
        k[c]   = cos * dx - sin * dy + px
        k[c+1] = sin * dx + cos * dy + py
        c += 2
      }
      c += OP_SCALARS[op]
    }
    return this
  }

  draw (scale=1) {
    const ctx = this.ctx
    ctx.save()
    if (this.clippedBy) {
      let region = new Path2D();
      region.rect(this.clippedBy.x, this.clippedBy.y, this.clippedBy.w, this.clippedBy.h)
      ctx.clip(region)
    }
    if (this.style.filter) {
      ctx.filter = this.style.filter
    }
    ctx.beginPath()
    const k = this._coords, ops = this._ops, n = ops.length
    let c = 0
    for (let i = 0; i < n; i++) {
      switch (ops[i]) {
        case MOVE:
          ctx.moveTo(k[c]*scale, k[c+1]*scale)
          c += 2; break
        case BEZIER:
          ctx.bezierCurveTo(k[c]*scale, k[c+1]*scale,
                            k[c+2]*scale, k[c+3]*scale,
                            k[c+4]*scale, k[c+5]*scale)
          c += 6; break
        case QUAD:
          ctx.quadraticCurveTo(k[c]*scale, k[c+1]*scale, k[c+2]*scale, k[c+3]*scale)
          c += 4; break
        case ARCTO:
          ctx.arcTo(k[c]*scale, k[c+1]*scale, k[c+2]*scale, k[c+3]*scale, k[c+4])
          c += 5; break
      }
    }
    this._applyStyle()
    return this
   }

   _applyStyle() {
     if (this.style.fill) {
       this.ctx.globalAlpha = "alpha" in this.style ? this.style.alpha : 1
       this.ctx.fillStyle = this.style.fill
       this.ctx.fill()
     }
     else {
       this.ctx.noFill
     }
    this.ctx.globalAlpha = this.style.strokeAlpha || this.style.alpha || 1
    if (this.style.strokeWidth || this.style.stroke) {
      this.ctx.strokeStyle = this.style.stroke || "black"
      this.ctx.lineWidth=this.style.strokeWidth || 1
      this.ctx.stroke()
    }
    if (this.style.shadow) {
       this.ctx.shadowColor = this.style.shadow
       this.ctx.shadowOffsetX = 10
       this.ctx.shadowOffsetY = 10
       //this.ctx.shadowBlur = this.style.shadowBlur;
     }
     this.ctx.lineCap = this.style.lineCap || "butt"
     this.ctx.restore()
     this.ctx.setTransform(1, 0, 0, 1, 0, 0);
   }

   fromPoints(m, n, height=10, padding=0) {
     let vector = {x: n.x - m.x, y:n.y - m.y}
     let length = Math.sqrt(vector.x * vector.x + vector.y * vector.y)
     let p0 = {x:m.x -padding, y:m.y - height/2}
     let p1 = {x:m.x + length + padding, y:m.y - height/2}
     let p2 = {x:m.x + length + padding, y:m.y + height/2}
     let p3 = {x:m.x- padding, y:m.y + height/2}
     this.m(p0).l(p1).l(p2).l(p3).l(p0)
     let xdiff = n.x - m.x
     let ydiff = n.y - m.y
     let deg = Math.atan2(ydiff, xdiff) * (180 / Math.PI)
     this.rotate(deg, m)
     return this
   }

   // Approximates the arc from sa to ea with cubic bezier segments (<=90deg
   // each, the standard bezier-circle technique), instead of ctx.arc().
   // Direction always sweeps from sa to ea in increasing-angle order; `cw`
   // is accepted for signature compatibility but does not reverse the sweep.
   circle(p, r=10, sa=0, ea=Math.PI * 2, cw=true) {
     const span = ea - sa
     const segments = Math.max(1, Math.ceil(Math.abs(span) / (Math.PI / 2)))
     const step = span / segments
     const kappa = (4 / 3) * Math.tan(step / 4)
     this.m(p.x + r * Math.cos(sa), p.y + r * Math.sin(sa))
     for (let i = 0; i < segments; i++) {
       const a0 = sa + i * step
       const a1 = sa + (i + 1) * step
       const cos0 = Math.cos(a0), sin0 = Math.sin(a0)
       const cos1 = Math.cos(a1), sin1 = Math.sin(a1)
       const p0x = p.x + r * cos0, p0y = p.y + r * sin0
       const p1x = p.x + r * cos1, p1y = p.y + r * sin1
       this._bezierTo(p0x - kappa * r * sin0, p0y + kappa * r * cos0,
                      p1x + kappa * r * sin1, p1y - kappa * r * cos1,
                      p1x, p1y)
     }
     return this
   }

   rect(p0, w, h) {
     return this.fromPoints({x:p0.x, y:p0.y+h/2}, {x:p0.x+w, y:p0.y+h/2}, h)
   }

   line(p0, p1) {
     this.m(p0).l(p1)
     return this
   }

   clip (x,y,w,h) {
     this.clippedBy = {x:x, y:y, w:w, h:h}
     return this
   }
}

module.exports = Path
