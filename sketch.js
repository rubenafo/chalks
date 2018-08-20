
function setup() {
    custom = new Custom({width: 1000, height: 1000, seed:45, background:215})
}

function draw() {
    x = random(-100,1100)
    y = random(-100,1100)
    //custom.addElem (custom.rect({x: x, y:y, width: x/10, height:y/10}), {noStroke:"true", fill:color(255,0,0, random(20,15)) })
    custom.addElem (custom.line({x1: x, y1:y, x2: custom.rnd(1000), y2:custom.rnd(1000)}),
                    { stroke:color(10,60,60, custom.rnd(10,80)), strokeWeight:custom.rnd(2,4) })
    custom.addElem(custom.point({x:x, y:y}),{})
    custom.stopAt(60)
}
