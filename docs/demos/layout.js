// Layout: point-generating helpers -- grid, spiral, rule of thirds.
let ch

function setup() {
  ch = new Chalks({width: 420, height: 420, seed: 2}, {fill: "#151821"})
  noLoop()
}

function draw() {
  ch.Layout.grid(14, 14, 420, 420).forEach(p =>
    ch.path({fill: "#3a3f4b"}).circle(p, 2).draw()
  )

  let spiralPts = ch.Layout.spiral(220, 210, 210, 190, 6, 6)
  spiralPts.forEach((p, i) =>
    ch.path({fill: chroma.scale(["#66fcf1", "#f45b69"])(i / spiralPts.length).css()}).circle(p, 4).draw()
  )

  ch.Layout.rof3(0, 0, 420, 420).forEach(p =>
    ch.path({stroke: "#ffd93d", strokeWidth: 2}).circle(p, 12).draw()
  )

  ch.draw()
}
