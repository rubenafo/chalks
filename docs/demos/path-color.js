// Path: fluent shape builder. chroma-js: color scales and CSS output.
let ch

function setup() {
  ch = new Chalks({width: 420, height: 420, seed: 7}, {fill: "#151821"})
  noLoop()
}

function draw() {
  let scale = chroma.scale(["#ff6b6b", "#ffd93d", "#4dd6c1"]).mode("lch")
  let cols = 6, rows = 6, cell = 420 / cols

  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      let t = (x + y) / (cols + rows - 2)
      ch.path({fill: scale(t).alpha(0.85).css(), stroke: "#151821", strokeWidth: 2})
        .rect({x: x * cell + 6, y: y * cell + 6}, cell - 12, cell - 12)
        .draw()
    }
  }

  let grad = ch.lgrad({x: 140, y: 140}, {x: 280, y: 280}, [[0, "#ff6b6b"], [0.5, "#ffd93d"], [1, "#4dd6c1"]])
  ch.path({fill: grad})
    .shadow(28, "black", 0.5, 0, 10)
    .circle({x: 210, y: 210}, 72)
    .draw()

  ch.draw()
}
