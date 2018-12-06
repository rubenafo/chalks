/**
* @license

* Copyright 2019 Ruben Afonso, rubenaf.com
* This source code is licensed under the Apache license (see LICENSE file)
**/

"use strict"

let chroma = require ("chroma-js")

class Path {

  constructor (scene, style={}) {
    this.style = style
    this.instrs = []
    this.parent = scene
    this.parent.children.push(this)
    this.ctx = scene.ctx
    this.clippedBy = undefined
  }

  // Clone an object.
  // "hide" style parameter is not propagated
  clone(style={}) {
    let newStyle = JSON.parse(JSON.stringify(this.style))
    Object.keys(style).forEach(k => newStyle[k] = style[k])
    let newPath = new Path(this.parent, newStyle)
    delete(newPath.style.hide)
    newPath.instrs = JSON.parse(JSON.stringify(this.instrs))
    return newPath
  }

  m(x,y) {
    let point = typeof(x) === "object" ? x : {x:x, y:y}
    this.instrs.push({instr:"m", p:point}); return this
  }

  l(x,y) {
    let point = typeof(x) === "object" ? x : {x:x, y:y}
    this.instrs.push({instr:"l", p:point}); return this
  }

  bezier(c1, c2, p2) { this.instrs.push({instr:"b", c1:c1, c2:c2, p2:p2}); return this }
  bc (p) {
    let previous = this.instrs[this.instrs.length-1]
    if (previous.instr !== "b")
      throw ("Previous instruction to bc() must be bezier()")
    this.bezier(previous.c1, previous.c2, p)
  }
  arc(p1, p2, r) { this.instrs.push({instr:"a", p1:p1, p2:p2, r:r}); return this}
  quad(c, p) { this.instrs.push({instr:"q", c:c, p:p}); return this }

  center() {
    let pts = 0;
    let centerPt = createVector(0,0)
    this.instrs.forEach (i => {
      Object.keys(i).filter(k => k !== "instr").forEach (k => {
          centerPt.add(i[k].x, i[k].y)
      })
      pts += Object.keys(i).length -1
    })
    if (pts)
      centerPt.div(pts)
    return centerPt;
  }

  shadow(blur=0, color="black", alpha=1, x=5, y=5) {
    this.ctx.shadowBlur = blur
    this.ctx.shadowColor = color
    this.ctx.shadowOffsetX = x
    this.ctx.shadowOffsetY = y
    this.ctx.shadowAlpha = alpha
    return this
  }

  moveTo(p0,y) {
    let p = typeof(p0) === "object" ? p0 : {x:p0, y:y}
    let center = this.center()
    let distance = {x: p.x - center.x, y: p.y - center.y}
    this.instrs.forEach (i => {
      Object.keys(i).forEach (k => {
        if (k !== "instr") {
          i[k].x += distance.x
          i[k].y += distance.y
        }
      })
    })
    return this
  }

  rotate (deg, pt) {
    pt = pt || this.center()
    this.instrs.forEach (instr => {
      Object.keys(instr).forEach(k => {
        if ( k !== "instr")
          instr[k] = this.rotatePoint(instr[k], deg, pt)
      })
    })
  }

  draw (scale=1) {
    this.ctx.save()
    if (this.clippedBy) {
      let region = new Path2D();
      region.rect(this.clippedBy.x, this.clippedBy.y, this.clippedBy.w, this.clippedBy.h)
      this.ctx.clip(region)
    }
    if (this.style.filter) {
      this.ctx.filter = this.style.filter
    }
    this.ctx.beginPath()
    this.instrs.forEach (instr => {
       switch (instr.instr) {
         case "m": this.ctx.moveTo(instr.p.x*scale, instr.p.y*scale); break
         case "l": this.ctx.lineTo(instr.p.x*scale, instr.p.y*scale); break
         case "b": this.ctx.bezierCurveTo(instr.c1.x*scale, instr.c1.y*scale,
                                               instr.c2.x*scale, instr.c2.y*scale,
                                               instr.p2.x*scale, instr.p2.y*scale); break
         case "a": this.ctx.arcTo(instr.p1.x*scale, instr.p1.y*scale, instr.p2.x*scale, instr.p2.y*scale, instr.r); break
         case "q": this.ctx.quadraticCurveTo(instr.c.x*scale, instr.c.y*scale, instr.p.x*scale, instr.p.y*scale); break
         case "arc": this.ctx.arc(instr.p.x*scale, instr.p.y*scale, instr.r, instr.sa, instr.ea, instr.cw); break
       }
    })
    this.applyStyle()
   }

   applyStyle() {
     if (this.style.fill) {
       this.ctx.globalAlpha = this.style.alpha || 1
       this.ctx.fillStyle = this.style.fill
       this.ctx.fill()
     }
     else {
       this.ctx.noFill
     }
    this.ctx.globalAlpha = this.style.strokeAlpha || this.style.alpha || 1
    if (this.style.strokeWidth || this.style.stroke) {
      this.ctx.strokeStyle = this.style.stroke || "black"
      this.ctx.lineWidth=this.style.strokeWidth || 1
      this.ctx.stroke()
    }
    if (this.style.shadow) {
       this.ctx.shadowColor = this.style.shadow
       this.ctx.shadowOffsetX = 10
       this.ctx.shadowOffsetY = 10
       //this.ctx.shadowBlur = this.style.shadowBlur;
     }
     this.ctx.lineCap = this.style.lineCap || "butt"
     this.ctx.restore()
     this.ctx.setTransform(1, 0, 0, 1, 0, 0);
   }

   fromPoints(m, n, height=10, padding=0) {
     let vector = {x: n.x - m.x, y:n.y - m.y}
     let length = Math.sqrt(vector.x * vector.x + vector.y * vector.y)
     let p0 = {x:m.x -padding, y:m.y - height/2}
     let p1 = {x:m.x + length + padding, y:m.y - height/2}
     let p2 = {x:m.x + length + padding, y:m.y + height/2}
     let p3 = {x:m.x- padding, y:m.y + height/2}
     this.m(p0).l(p1).l(p2).l(p3).l(p0)
     let xdiff = n.x - m.x
     let ydiff = n.y - m.y
     let deg = Math.atan2(ydiff, xdiff) * (180 / Math.PI)
     this.rotate(deg, m)
     return this
   }

   rotatePoint (p, deg, around) {
     let radians = deg * Math.PI / 180.0,
         cos = Math.cos(radians),
         sin = Math.sin(radians)
     let dx = p.x - around.x,
         dy = p.y - around.y;
     let newx = cos * dx - sin * dy + around.x
     let newy = sin * dx + cos * dy + around.y
     return createVector(newx, newy)
   }

   circle(p, r=10, sa=0, ea=Math.PI * 2, cw=true) {
     this.instrs.push({instr:"arc", p:p, r:r, sa:sa, ea:ea, cw:cw})
     return this
   }

   rect(p0, w, h) {
     return this.fromPoints({x:p0.x, y:p0.y+h/2}, {x:p0.x+w, y:p0.y+h/2}, h)
   }

   line(p0, p1) {
     this.ctx.beginPath()
     this.m(p0).l(p1)
     this.applyStyle()
     return this
   }

   clip (x,y,w,h) {
     this.clippedBy = {x:x, y:y, w:w, h:h}
     return this
   }
}

module.exports = Path
