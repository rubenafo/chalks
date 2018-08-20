
class Custom {

  constructor (params) {
    this.canvas = createCanvas(params.width, params.height)
    background(params.background);
    randomSeed(params.seed || 3)
    this.startTime = Date.now()
  }

  addElem (f, attrs) {
    let color = attrs["color"]
    for (let key in attrs) {
      let val = attrs[key]
      if (val == true) {
        eval(key + "()")
      } else {
        eval(key + "('" + attrs[key] + "')")
      }
    }
    f()
  }

  rect (params) {
    return function () { rect(params.x, params.y, params.width, params.height) }
  }

  line (params) {
    return function () { line(params.x1, params.y1, params.x2, params.y2) }
  }

  point(params) {
    return function () { point (params.x, params.y)}
  }

  rnd (start, end) {
    if (start && end)
      return random(start,end)
    if (start !== undefined)
      return random(0, start)
    return random(0,1)
  }

  stopAt (countLimit) {
    if (frameCount == countLimit) {
      let time = (Date.now() - this.startTime)/1000
      console.log ("Execution stopped at " + countLimit + " iterations (" + time + " secs)")
      //save(this.canvas, "~/Desktop/canvas","png")
      noLoop()
    }
  }
}
