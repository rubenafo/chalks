
let attractors = require("./Parametrics")
let layout = require("./Layout")
let points = require("./Points")

class chalks {

  constructor(params) {
    this.canvas = createCanvas(params.width, params.height)
    params.background = params.background || 1
    if (typeof (params.background) === "string") {
      background(color(params.background))
    }
    else {
      background(params.background);
    }
    if (params.seed)
      randomSeed(params.seed)
    else {
      let seed = (Math.random() * 10000).toString().substr(5, 11)
      console.log("Using seed: " + seed)
      randomSeed(seed)
    }
    this.startTime = Date.now()
    this.attractors = attractors
    this.layout = layout
    this.points = points
  }

  addElem(f, attrs) {
    if (attrs) {
    let strokeAttr = attrs["stroke"]
    let alphaAttr = attrs["alpha"]
    let strokeWeightAttr = attrs["strokeWidth"]
    let noFillAttr = attrs["noFill"]
    let strokeCapAttr = attrs["strokeCap"]
    if (strokeWeightAttr)
      strokeWeight(strokeWeightAttr)
    if (typeof (strokeAttr) === "string")
      strokeAttr = color(strokeAttr)
    if (strokeCapAttr)
      strokeCap(strokeCapAttr)
    if (typeof (strokeAttr) === "object" && alphaAttr)
      strokeAttr.setAlpha(alphaAttr)
    if (noFillAttr !== "undefined" && noFillAttr) {
      noFill();
    }
    stroke(strokeAttr)
  }
    f()
  }

  rect(ats) { return function () { rect(ats.x, ats.y, ats.width, ats.height) } }

  line(p0, p1) { return function () { line(p0.x, p0.y, p1.x, p1.y) } }

  point(ats) { return function () { point(ats.x, ats.y) } }


  shape(pts, closed = true) {
    return function () {
      beginShape()
      pts.forEach(p => vertex(p.x, p.y))
      closed ? endShape(CLOSE) : endShape()
    }
  }

  curveVertex(pts) {
    return function () {
      beginShape()
      if (pts.length) {
        curveVertex(pts[0].x, pts[0].y)
        pts.forEach(p => curveVertex(p.x, p.y))
        curveVertex(pts[pts.length - 1].x, pts[pts.length - 1].y)
      }
      endShape()
    }
  }

  stopAt(countLimit, saveToFile) {
    if (frameCount == countLimit) {
      let time = (Date.now() - this.startTime) / 1000
      console.log("Execution stopped at " + countLimit + " iterations (" + time + " secs)")
      if (saveToFile) {
        save(this.canvas, saveToFile, "png")
        console.log("File saved to ", saveToFile)
      }
      noLoop()
    }
  }
}

p5.prototype.rint = function (lower, upper) {
  return Math.round(random(lower, upper))
}

p5.prototype.rnd = function (start, end) {
  if (Array.isArray(start)) {
    return start[rint(0, start.length - 1)]
  }
  let val = 0
  if (start && end)
    val = random(start, end)
  else if (start !== undefined)
    val = random(0, start)
  else val = random(0, 1)
  return val
}

p5.prototype.rscale = function (scaleStart, scaleEnd, inputStart, inputEnd, value) {
  let distance = scaleEnd - scaleStart
  let step = (value - inputStart) / (inputEnd - inputStart)
  let returnVal = scaleStart + (distance * step)
  returnVal = Math.max(returnVal, scaleStart)
  returnVal = Math.min(returnVal, scaleEnd)
  return returnVal
}

module.exports = chalks
