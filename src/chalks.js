
let attractors = require("./Parametrics.js")

class chalks {

  constructor(params) {
    this.canvas = createCanvas(params.width, params.height)
    background(params.background);
    randomSeed(params.seed || 3)
    this.startTime = Date.now()
    this.attractors = attractors
  }

  addElem(f, attrs) {
    let strokeAttr = attrs["stroke"]
    let alphaAttr = attrs["alpha"]
    let strokeWeightAttr = attrs["strokeWidth"]
    if (strokeWeightAttr)
      strokeWeight(strokeWeightAttr)
    if (typeof (strokeAttr) === "object" && alphaAttr)
      strokeAttr.setAlpha(alphaAttr)
    stroke(strokeAttr)
    f()
  }

  rect(ats) { return function () { rect(ats.x, ats.y, ats.width, ats.height) } }

  line(p0, p1) { return function () { line(p0.x, p0.y, p1.x, p1.y) } }

  point(ats) { return function () { point(ats.x, ats.y) } }

  rint(lower, upper) { return Math.round(random(lower, upper)) }

  shape (pts, closed=true) {
    return function () {
      beginShape()
      pts.forEach (p => vertex(p.x, p.y))
      closed? endShape (CLOSE) : endShape()
    }
  }

  rnd(start, end) {
    if (Array.isArray(start)) {
      return start[this.rint(0, start.length - 1)]
    }
    let val = 0
    if (start && end)
      val = random(start, end)
    else if (start !== undefined)
      val = random(0, start)
    else val = random(0, 1)
    return val
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

module.exports = chalks