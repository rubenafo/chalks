// Parametrics: classic curves layered around a shared center.
let ch

function drawTrail(points, style) {
  let p = ch.path(style).m(points[0])
  for (let i = 1; i < points.length; i++) p.l(points[i])
  p.draw()
}

function setup() {
  ch = new Chalks({width: 420, height: 420, seed: 11}, {fill: "#151821"})
  noLoop()
}

function draw() {
  let butterfly = ch.Parametrics.butterflyCurve({x: 210, y: 190}, 26, 6, 4)
  drawTrail(butterfly, {stroke: "#ffd93d", strokeWidth: 1.5, alpha: 0.85})

  let hypo = ch.Parametrics.hypocycloid({x: 210, y: 210}, 1, 12, 40, 105)
  drawTrail(hypo, {stroke: "#66fcf1", strokeWidth: 1.5, alpha: 0.85})

  // rose() returns unit-circle points, so scale/translate them by hand
  let rose = ch.Parametrics.rose({x: 0, y: 0}, 1, 8, 7 / 3)
    .map(p => createVector(p.x * 160 + 210, p.y * 160 + 210))
  drawTrail(rose, {stroke: "#f45b69", strokeWidth: 1.5, alpha: 0.85})

  ch.draw()
}
