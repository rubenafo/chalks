
function setup() {
    custom = new Custom({width: 1000, height: 1000, seed:4, background:215})
    points = dejon([500,500], -2.24, 0.43, -0.66, -8.23, 510, 90)
}

function draw() {
    //custom.addElem (custom.rect({x: x, y:y, width: x/10, height:y/10}), {noStroke:"true", fill:color(255,0,0, random(20,15)) })
    //custom.addElem (custom.line({x1: x, y1:y, x2: custom.rnd(6100), y2:custom.rnd(6000)}),
    //                { stroke:color(10,60,60, custom.rnd(10,80)), strokeWeight:custom.rnd(12,24) })
    for (var i = 1; i < points.length; i++) {
      p0 = points[i-1]
      p1 = points[i]
      //custom.addElem(custom.point({x:x, y:y}),{strokeWeight:custom.rnd(1,2)})
      custom.addElem(custom.line({x1:p0[0], y1:p0[1], x2:p1[0], y2:p1[1]}), {stroke:color("black"), alpha:22, strokeWeight:custom.rnd(1,2)})
    }
    custom.stopAt(1)
    noLoop()
}
