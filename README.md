# Chalks
A thin, independent library on top of p5js containing methods to manipulate points and draw figures.   
Chalks is fully compatible with p5js and just provides some handy tools to simplify the creation process by accessing the p5js _canvas2d_ object.

Some of the components:
* Simplified path object to define styles and curves in a functional, declarative way.
* Generative:
    * Butterfly curve
    * Hypocycloid
    * Rose
    * Rossler
    * Lorentz
    * Dejon
    * Voronoi points (thanks to [voronoi](https://npmjs.com/package/voronoi))
* Points manipulation (subdivide, subchunks)
* Layout functions: column, rows, masonry
* Grammars
* Color handling using [Chromajs](https://www.npmjs.com/package/chroma-js)
 
## Installation
```
npm i chalks
```
Keep in mind that _chalks_ requires [p5js](https://www.npmjs.com/package/p5) to be present.   
You can reference the _chalks.min.js_ library contained in the node_modules folder in your index.html:
```html
<script language="javascript" type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/0.7.1/p5.js"></script>
<script language="javascript" src="./node_modules/chalks/dist/chalks.min.js" type="text/javascript"></script>
<script language="javascript" src="_your_sketch_.js" type="text/javascript"></script>
```
Alternatively you can simply clone this repo and add _chalks.min.js_, e.g.   
Copy the file _chalks.min.js_ from /lib and add it to your _index.html_ after your p5js import.

Example:   
```html
<script language="javascript" type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/0.7.1/p5.js"></script>
<script language="javascript" src="./chalks/dist/chalks.min.js" type="text/javascript"></script>
<script language="javascript" src="_your_sketch_.js" type="text/javascript"></script>
```

## Example
```javascript
function setup() {
    ch = new Chalks({width: 1000, height: 1000, seed:4}, {fill:"c8c8c8"})
    points = ch.Parametrics.dejon({x:500, y:900}, -2.24, 0.43, -3.266, -8.23, 250, 6200)
    console.log(points)
}

function draw() {
    points.forEach(p => ch.path({fill:"red", alpha:random(), stroke:"black", strokeWidth:12}, 10).m(p).l(p, p.cadd(150, 50)).draw())
    noLoop()
}
```
