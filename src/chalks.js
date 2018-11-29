
let Layout = require("./Layout")
let Path = require("./Path")
let Parametrics = require("./Parametrics")
let Grammar = require ("./Grammar")

let chroma = require ("chroma-js")
global.chroma = chroma;
// Provide debug messages in the console
function debug(str) {
  console.log("Chalks:", str)
}

class Scene {

  constructor(params, style = {}) {
    this.start = Date.now()
    this.scale = params.scale || 1
    this.width = params.width * this.scale || 1000
    this.height = params.height * this.scale || 1000
    this.p5canvas = createCanvas(this.width,this.height)

    this.canvas = document.getElementById('defaultCanvas0');
    this.ctx = this.canvas.getContext("2d")
    this.seed = params.seed ? params.seed : (Math.random() * 10000).toString().substr(5, 8)
    debug("using seed=" + this.seed)
    randomSeed(this.seed)
    this.children = []
    this.drawBackground(this.width, this.height, style)
    this._modules()
  }

  _modules() {
    this.Layout = Layout
    this.Path = Path
    this.Parametrics = Parametrics
    this.Grammar = Grammar
  }

  drawBackground(width, height, style) {
    this.ctx.fillStyle = style.fill || "white"
    this.ctx.fillRect(0, 0, width, height)
    this.ctx.fillStyle = "black"
  }

  setStyle(style) {
    this.drawBackground(this.width, this.height, style)
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

  draw(loops=1, targetFile) {
    let i = loops
    while (i--)
      this.children.filter(c => !c.style.hide).forEach(c => c.draw(this.scale))
    debug("ended" + " (" + (Date.now() - this.start) / 1000 + " secs)")
    if (targetFile) {
      saveCanvas(this.p5canvas, targetFile, 'png');
    }
    noLoop()
  }
}

String.prototype.chroma = function () {
  return chroma(this.toString())
}

p5.Vector.prototype.radd = function (x,y) {
  return createVector(this.x, this.y, this.z).add(random(x,y), random(x,y), random(x,y))
}

p5.Vector.prototype.rsub = function (x,y) {
  return createVector(this.x, this.y, this.z).sub(random(x,y), random(x,y), random(x,y))
}

module.exports = Scene;
