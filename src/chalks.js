
let Layout = require("./Layout")
//let Rnd = require ("./Rnd").Rnd
let Path = require("./Path")
let Rnd = require("./Rnd").Rnd
let Parametrics = require("./Parametrics")
let wcag = require("wcag-contrast")

// Provide debug messages in the console
function debug(str) {
  console.log("Chalks:", str)
}

class Scene {
  constructor(params, style = {}) {
    this.scale = params.scale || 1
    this.width = params.width * this.scale || 1000
    this.height = params.height * this.scale || 1000
    this.canvas = document.getElementById('canvas');
    canvas.width = this.width
    canvas.height = this.height
    this.ctx = this.canvas.getContext('2d')
    this.start = Date.now()
    this.scale = params.scale || 1
    if (params.seed) {
      debug("using seed=" + params.seed)
      this.rnd = new Rnd(params.seed)
    } else {
      let seed = (Math.random() * 10000).toString().substr(5, 8)
      debug("using seed: " + seed)
      this.rnd = new Rnd(seed)
    }
    this.children = []
    this.drawBackground(this.width, this.height, style)
  }

  drawBackground(width, height, style) {
    this.ctx.fillStyle = style.fill || "white"
    this.ctx.fillRect(0, 0, width * this.scale, height * this.scale)
    this.ctx.fillStyle = "black"
  }

  setStyle(style) {
    this.drawBackground(this.width, this.height, style)
  }

  rint(lower, upper) {
    return this.rnd.int(lower, upper)
  }
  rand(lower, upper) {
    return this.rnd.random(lower, upper)
  }
  pick(list, ...elems) {
    return this.rnd.pick(list, ...elems)
  }

  path(style) {
    return new Path(this, style)
  }

  // Linear gradient: p0, p1, stops as [[num, color]]
  lgrad(p0, p1, colors) {
    let grad = this.ctx.createLinearGradient(0, 0, 1000, 1000)
    colors.forEach(c => {
      grad.addColorStop(c[0], c[1])
    })
    return grad
  }

  // Radial gradient
  rgrad(p0, r0, p1, r1, colors) {
    let grad = this.ctx.createRadialGradient(p0.x, p0.y, r0, p1.x, p1.y, r1)
    colors.forEach(c => {
      grad.addColorStop(c[0], c[1])
    })
    return grad
  }

  draw() {
    this.children.filter(c => !c.style.hide).forEach(c => c.draw())
    debug("ended" + " (" + (Date.now() - this.start) / 1000 + " secs)")
  }

  //saveTo(fileName) {
  //  this.canvas.createPNGStream().pipe(fs.createWriteStream(fileName))
  //    console.log("Save to " + fileName + " (" + (Date.now() - this.start) / 1000 + " secs)")
  //}
}

module.exports = {
  Scene,
  Layout,
  Path,
  Parametrics
}
