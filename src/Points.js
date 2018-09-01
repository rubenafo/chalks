
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
        let start = Math.round(random() * points.length)
        let end = start + Math.round((maxSize - minSize) * random() + minSize)
        return points.slice(start, end)
    }
}

module.exports = Points