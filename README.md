# Chalks
A library containing methods to manipulate points and draw on top of p5js.

Chalks is fully compatible with p5js and just provides some handy tools to simplify the creation process.

Some of the components:
* Random methods: random int, random array element, seed
* Attractors
* Points manipulation (subidivide, subchunks)
* Layout: column points, row points

## Example
```javascript
function setup() {
    ch = new chalks({width: 1000, height: 1000, seed:4, background:215})
    points = ch.attractors.dejon([500,550], -2.24, 0.43, -3.66, -8.23, 250, 3200)
}

function draw() {
    for (var i = 2; i < points.length; i++) {
      p0 = points[i-1]
      p1 = points[i]
      ch.addElem(ch.line(p0, p1),
                    {stroke:color(ch.rnd(["black","white"])), alpha:ch.rnd(12,52), strokeWidth:ch.rnd(2,4)})
    }
    ch.stopAt(1)
}
```
## Installation
Copy the file _chalks.min.js_ from this repository and add it to your _index.html_ after your p5js import.

```html
 <script language="javascript" type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/0.7.1/p5.js"></script>
 <script language="javascript" src="./chalks.min.js" type="text/javascript"></script>
```
