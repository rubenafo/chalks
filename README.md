# Chalks
A thin library on top of p5js  containing methods to manipulate points and draw figures.   
Chalks is fully compatible with p5js and just provides some handy tools to simplify the creation process by accessing the p5js _canvas2d_ object.

Some of the components:
* Simplified path object to define styles and define curves in a plain declarative way
* Attractors
    * Butterfly curve
    * Hypocycloid
    * Rose
    * Rossler
    * Lorentz
    * Dejon
* Points manipulation (subidivide, subchunks)
* Layout: column points, row points
* Grammars
* Color handling: integration with [Chromajs](https://www.npmjs.com/package/chroma-js)

## Example
```javascript
function setup() {
    ch = new Chalks({width: 1000, height: 1000, seed:4}, {fill:"c8c8c8"})
    points = ch.Attractors.dejon([500,550], -2.24, 0.43, -3.66, -8.23, 250, 3200)
}

function draw() {
    points.forEach(p => ch.path({fill:"red", alpha:random(), stroke:"black", strokeWidth:2}, 10).m(p).l(p.add(10)))
    ch.draw() // draw once and stop loop at first iteration by default
}
```
## Installation
Copy the file _chalks.min.js_ from /lib and add it to your _index.html_ after your p5js import.

Example:   
```html
<script language="javascript" type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/0.7.1/p5.js"></script>
<script language="javascript" src="./chalks.min.js" type="text/javascript"></script>
<script language="javascript" src="_your_sketch_.js" type="text/javascript"></script>
```
