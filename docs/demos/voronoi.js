// Parametrics.voronoi: cell diagram over a set of random sites.
let ch

function setup() {
  ch = new Chalks({width: 420, height: 420, seed: 5}, {fill: "#151821"})
  noLoop()
}

function draw() {
  let sites = []
  for (let i = 0; i < 40; i++) sites.push({x: random(420), y: random(420)})

  let diagram = ch.Parametrics.voronoi({x: 0, y: 0}, 420, 420, sites)
  let palette = chroma.scale(["#66fcf1", "#f45b69", "#ffd93d"])

  diagram.cells.forEach((cell, i) => {
    if (!cell.halfedges.length) return
    let pts = cell.halfedges.map(he => he.getStartpoint())
    let p = ch.path({fill: palette(i / diagram.cells.length).alpha(0.85).css(), stroke: "#151821", strokeWidth: 2}).m(pts[0])
    for (let j = 1; j < pts.length; j++) p.l(pts[j])
    p.draw()
  })

  ch.draw()
}
