
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
      listPoints.forEach (p => {
        let d = Math.sqrt(Math.pow(p.x,2) + Math.pow(p.y, 2))
        if (d < distance) {
          distance = d
          closest = p
        }
      })
      return closest
    }
}

module.exports = Points
