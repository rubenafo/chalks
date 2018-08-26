
"use strict"

class points {

    static subd (points, level=1) {
        let result = []
        for (let i = 1; i < points.length; i++) {
            result.push (points[i-1], 
                        {x:(points[i-1].x + points[i].x)/2, y:(points[i-1].y + points[i].y)/2})
        }
        return result
    }


}

module.exports = points