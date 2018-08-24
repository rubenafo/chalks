
function setup() {
    custom = new Custom({width: 1000, height: 1000, seed:4, background:215})
    points = dejon([500,650], -2.24, 0.43, -0.66, -8.23, 250, 12200)
}

function draw() {
    for (var i = 1; i < points.length; i++) {
      p0 = points[i-1]
      p1 = points[i]
      //custom.addElem(custom.point({x:x, y:y}),{strokeWeight:custom.rnd(1,2)})
      custom.addElem(custom.point(p0),
                    {stroke:color(custom.rnd(["black","white"])), alpha:custom.rnd(12,52), strokeWidth:custom.rnd(5,9)})
    }
    custom.stopAt(1)
    noLoop()
}
