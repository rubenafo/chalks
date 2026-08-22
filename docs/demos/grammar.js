// Grammar: rule-based generation. Each take() call enqueues one branch,
// so calling it twice per node yields a bifurcating tree.
let ch

function drawSegment(from, angle, len, mix) {
  let to = from.cadd(len * Math.cos(angle * Math.PI / 180), len * Math.sin(angle * Math.PI / 180))
  ch.path({stroke: chroma.mix("#66fcf1", "#f45b69", mix).css(), strokeWidth: Math.max(1, len / 16)})
    .m(from).l(to).draw()
  return to
}

function setup() {
  ch = new Chalks({width: 420, height: 420, seed: 14}, {fill: "#151821"})
  noLoop()
}

function draw() {
  let g = new ch.Grammar()

  function branch(p, angle, len) {
    if (len < 6) return
    let to = drawSegment(p, angle, len, len / 90)
    let spread = 16 + random(16)
    g.take(() => branch(to, angle - spread, len * 0.72))
    g.take(() => branch(to, angle + spread, len * 0.72))
  }

  g.run(() => branch(createVector(210, 400), -90, 80), null, 800, false)
  ch.draw()
}
