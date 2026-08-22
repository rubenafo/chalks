// Minimal stand-in for the p5 globals chalks assumes are present (global mode).
// Lets the pure generative logic in src/ be unit tested under plain Node/mocha,
// without a browser. Path's Canvas2D drawing and chalks.js's Scene/DOM wiring
// are NOT covered by this stub -- those need a real canvas context.
"use strict"

class StubVector {
  constructor(x = 0, y = 0, z = 0) {
    this.x = x
    this.y = y
    this.z = z
  }

  add(x, y, z) {
    if (typeof x === "object") {
      this.x += x.x || 0
      this.y += x.y || 0
      this.z += x.z || 0
    } else {
      this.x += x || 0
      this.y += y || 0
      this.z += z || 0
    }
    return this
  }

  div(n) {
    this.x /= n
    this.y /= n
    this.z /= n
    return this
  }

  cadd(x, y, z) {
    let vx = typeof x === "function" ? x() : (x || 0)
    let vy = typeof y === "function" ? y() : (y || 0)
    let vz = typeof z === "function" ? z() : (z || 0)
    return new StubVector(this.x, this.y, this.z).add(vx, vy, vz)
  }
}

global.createVector = (x, y, z) => new StubVector(x, y, z)

global.randomSeed = () => {}

global.random = (a, b) => {
  if (Array.isArray(a)) return a[Math.floor(Math.random() * a.length)]
  if (a === undefined) return Math.random()
  if (b === undefined) return Math.random() * a
  return a + Math.random() * (b - a)
}

global.noLoop = () => {}

module.exports = { StubVector }
