
function setup() {
    cr = new Chalks({width: 1000, height: 1000, seed:4, background:215})
    points = dejon([500,650], -2.24, 0.43, -0.66, -8.23, 250, 3200)
}

function draw() {
    for (var i = 2; i < points.length; i++) {
      p0 = points[i-1]
      p1 = points[i]
      cr.addElem(cr.line(p0, p1),
                    {stroke:color(cr.rnd(["black","white"])), alpha:cr.rnd(12,52), strokeWidth:cr.rnd(2,4)})
    }
    cr.stopAt(1)
}
