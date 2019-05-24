
"use strict"

class Points {

    static subd (points, level=1) {
        let result = []
        for (let i = 1; i < points.length; i++) {
            result.push (points[i-1],
                        {x:(points[i-1].x + points[i].x)/2, y:(points[i-1].y + points[i].y)/2})
        }
        result.push(points[points.length-1])
        return result
    }

    static rects (points, height) {
        for (let i = 0; i < points.length; i++) {
            let length = Math.sqrt(points[i].x * points[i].x + points[i].y * points[i].y)
        }
    }

    static rslice (points, minSize, maxSize) {
        let distance = maxSize - minSize
        let start = Math.round(random() * points.length) - distance
        let end = start + Math.round(distance * random())
        console.log(end-start)
        return points.slice(start, end)
    }

    static noise (points, val) {
      let f = function (p) { return {x:p.x + random()*val, y:p.y + random()*val}}
      return points.map(f)
    }

    static closest (point, listPoints) {
      let closest = undefined
      let distance = 1e10
      let diffPoints = listPoints.filter(p => p.x !== point.x && p.y !== point.y)
      diffPoints.forEach (p => {
        let d = Math.sqrt(Math.pow(point.x - p.x, 2) + Math.pow(point.y - p.y, 2))
        if (d < distance) {
          distance = d
          closest = p
        }
      })
      return closest
    }

    static rotatePoint (p, deg, around) {
        let radians = deg * Math.PI / 180.0,
            cos = Math.cos(radians),
            sin = Math.sin(radians)
        let dx = p.x - around.x,
            dy = p.y - around.y;
        let newx = cos * dx - sin * dy + around.x
        let newy = sin * dx + cos * dy + around.y
        return {x:newx, y:newy}
      }
}

module.exports = Points
