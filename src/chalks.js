
let Layout = require("./Layout")
let Path = require("./Path")
let Parametrics = require("./Parametrics")
let Grammar = require ("./Grammar")
let Points = require ("./Points")

let chroma = require ("chroma-js")
global.chroma = chroma;

// Provide debug messages in the console
function debug(str) {
  console.log("Chalks:", str)
}

class Scene {

  constructor(params = {}, style = {}) {
    this.start = Date.now()
    this.scale = params.scale || 1
    if (params.width && params.height) { // create our own canvas
        this.width = params.width * this.scale 
        this.height = params.height * this.scale
        this.p5canvas = createCanvas(this.width,this.height)
        debug (`creating canvas ${this.width}x${this.height}`)
    }
    else { // reuse existing p5js canvas
        this.width = params.width * this.scale || p5.instance.canvas.width
        this.height = params.height * this.scale || p5.instance.canvas.height
        this.p5canvas = p5.instance.canvas
        debug (`reusing existing canvas ${this.width}x${this.height}`)
    }
    this.canvas = document.getElementById('defaultCanvas0');
    this.ctx = this.canvas.getContext("2d")
    this.seed = params.seed ? params.seed : (Math.random() * 10000).toString().substr(5, 8)
    debug("using seed=" + this.seed)
    randomSeed(this.seed)
    this.drawBackground(this.width, this.height, style)
    this._modules()
  }

  _modules() {
    this.Layout = Layout
    this.Path = Path
    this.Parametrics = Parametrics
    this.Grammar = Grammar
    this.Points = Points
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
    return new Path(this, style);
  }

  // Linear gradient: p0, p1, stops as [[num, color]]
  lgrad(p0, p1, colors) {
    let grad = this.ctx.createLinearGradient(0, 0, 1000, 1000)
    colors.forEach(c => grad.addColorStop(c[0], c[1]));
    return grad;
  }

  // Radial gradient
  rgrad(p0, r0, p1, r1, colors) {
    let grad = this.ctx.createRadialGradient(p0.x, p0.y, r0, p1.x, p1.y, r1)
    colors.forEach(c => grad.addColorStop(c[0], c[1]))
    return grad;
  }

  draw(loops=1, targetFile) {
    this.ctx.imageSmoothingQuality = "high"
    this.ctx.save()
    if (this.clipped) {
      this.ctx.clip(this.clipped)
    }
    debug("ended" + " (" + (Date.now() - this.start) / 1000 + " secs)")
    if (targetFile) {
      saveCanvas(this.p5canvas, targetFile, 'png');
    }
    this.ctx.restore()
    noLoop()
  }

  clipTo (x,y,w,h) {
    let region = new Path2D();
    region.rect(x, y, w, h)
    this.clipped = region
  }
}

/**
 * Copy + add. Creates a new vector and adds x,y,z
 */
p5.Vector.prototype.cadd = function (x,y,z) {
  let vx = typeof(x) === "function" ? x() : x
  let vy = typeof(y) === "function" ? y() : y
  let vz = typeof(z) === "function" ? z() : z
  return createVector(this.x, this.y, this.z).add(vx, vy, vz)
}

/**
 * Shortcut for random function, r(x,y,z)
 */
p5.prototype.r = function (x,y,z) {
  return random(x,y,z)
}

/**
 * Shortcut for createVector function, createVector(x,y,z)
 */
p5.prototype.vector = function (x,y,z) {
  return createVector(x,y,z)
}

module.exports = Scene;
