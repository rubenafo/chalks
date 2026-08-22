// Layout.masonry: brick layout driven by a small grammar string.
let ch

function setup() {
  ch = new Chalks({width: 420, height: 420, seed: 9}, {fill: "#151821"})
  noLoop()
}

function draw() {
  let bricks = ch.Layout.masonry(420, 420, "|3-2>1|2>2-3", 4)
  let palette = chroma.scale(["#66fcf1", "#f45b69", "#ffd93d", "#4dd6c1"])

  bricks.forEach((b, i) => {
    ch.path({fill: palette(i / bricks.length).alpha(0.9).css(), stroke: "#151821", strokeWidth: 3})
      .rect({x: b.x, y: b.y}, b.width, b.height)
      .draw()
  })

  ch.draw()
}
