
//let fs = require ("fs")
//let path = require ("path")
//let Canvas = require('canvas')
//let Image = Canvas.Image

let Brush = require ("./Brush")
let Layout = require ("./Layout")
//let Rnd = require ("./Rnd").Rnd
let Path = require ("./Path")
let Parametrics = require ("./Parametrics")

class Scene {

  constructor (params, style={}) {
    this.Brush = Brush
    this.scale = params.scale || 1
    this.width = params.width * this.scale || 1000
    this.height = params.height * this.scale || 1000
    this.canvas = document.getElementById('canvas');
    canvas.width = this.width
    canvas.height = this.height
    this.ctx = this.canvas.getContext('2d')
    this.start = Date.now()
    // if (params.seed) {
    //   console.log("Using seed: " + params.seed)
    //   this.rnd = new Rnd(params.seed)
    // }
    // else {
    //     let seed = (Math.random() * 10000).toString().substr(5, 8)
    //     console.log("Using seed: " + seed)
    //     this.rnd = new Rnd(seed)
    // }
    this.drawBackground(this.width, this.height, style)
  }

  drawBackground (width, height, style) {
    this.ctx.fillStyle = style.fill || "white"
    this.ctx.fillRect(0, 0, width * this.scale , height * this.scale)
    this.ctx.fillStyle = "black"
  }

  rint (lower, upper) { return this.rnd.int(lower, upper) }
  rand (lower, upper) { return this.rnd.random(lower, upper)}
  pick (list, ...elems) { return this.rnd.pick(list, ...elems)}

  path(style) {
    return new Path(this.ctx, style)
  }

  saveTo (fileName) {
    this.canvas.createPNGStream().pipe(fs.createWriteStream(fileName))
    console.log("Save to " + fileName + " (" + (Date.now()-this.start)/1000 + " secs)")
  }
}

module.exports =  { Scene, Layout, Path, Parametrics}
