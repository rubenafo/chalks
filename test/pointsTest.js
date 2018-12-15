let points = require ("../src/Points.js")
let assert = require ("assert")

it ("subdivide points", function () {
    let pt =  [{x:0, y:0}, {x:20, y:50}, {x:80, y:70}]
    sub = points.subd(pt)
    assert (sub.length == 5)
    assert (sub[0] == pt[0] && sub[1].x == 10 && sub[1].y == 25)
})
