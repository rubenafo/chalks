// Parametrics: strange attractors. De Jong is a discrete iterated map, so it's
// rendered as a point scatter; Lorenz is a smooth flow, drawn as one continuous path.
let ch

function drawTrail(points, style) {
  let p = ch.path(style).m(points[0])
  for (let i = 1; i < points.length; i++) p.l(points[i])
  p.draw()
}

function drawScatter(points, style) {
  points.forEach(p => ch.path(style).circle(p, 0.6).draw())
}

function setup() {
  ch = new Chalks({width: 420, height: 420, seed: 3}, {fill: "#0b0c10"})
  noLoop()
}

function draw() {
  let dejon = ch.Parametrics.dejon({x: 130, y: 150}, 1.4, -2.3, 2.4, -2.1, 55, 8000)
  drawScatter(dejon, {fill: "#66fcf1", alpha: 0.55})

  let lorenz = ch.Parametrics.lorentz({x: 300, y: 340}, 5, 4000, 0.1, 0, 0, 10, 28, 8 / 3, 0.006)
  drawTrail(lorenz, {stroke: "#f45b69", strokeWidth: 1, alpha: 0.6})

  ch.draw()
}
