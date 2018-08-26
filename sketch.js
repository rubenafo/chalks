
function setup() {
    ch = new chalks({width: 1000, height: 1000, seed:4, background:215})
    points = ch.attractors.dejon([500,650], -2.24, 0.43, -0.66, -8.23, 250, 3200)
}

function draw() {
    // for (var i = 2; i < points.length; i++) {
    //   p0 = points[i-1]
    //   p1 = points[i]
    //   ch.addElem(ch.line(p0, p1),
    //                 {stroke:color(ch.rnd(["black","white"])), alpha:ch.rnd(12,52), strokeWidth:ch.rnd(2,4)})
    // }
    ch.addElem(ch.shape(points),
        {stroke:color(ch.rnd(["black","white"])), alpha:ch.rnd(12,52), strokeWidth:ch.rnd(2,4)})
    ch.stopAt(1)
}
