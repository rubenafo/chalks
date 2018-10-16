
"use strict"

class Path {

  constructor (scene, style={}) {
    this.style = style
    this.instrs = []
    this.ops = []
    this.parent = scene
    this.parent.children.push(this)
    this.ctx = scene.ctx
  }

  clone(style) {
    let newPath = new Path(this.parent, style || this.style)
    delete(newPath.style.hide)
    newPath.instrs = JSON.parse(JSON.stringify(this.instrs))
    newPath.ops = JSON.parse(JSON.stringify(this.ops))
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
  arc(p1, p2, r) { this.instrs.push({instr:"a", p1:p1, p2:p2, r:r}); return this}
  quad(c, p) { this.instrs.push({instr:"q", c:c, p:p}); return this }

  center() {
    let x = 0, y = 0, pts = 0;
    this.instrs.forEach (i => {
      switch(i.instr) {
        case "l" :
          x += i.p.x; y += i.p.y
          pts += 1
          break
        case "q":
          x += i.p.x; y += i.p.y;
          x += i.c.x; y += i.c.y;
          pts += 2
          break;
        case "b":
          x += i.c1.x; y += i.c1.y
          x += i.c2.x; y += i.c2.y
          x += i.p2.x; y += i.p2.y
          pts += 3
          break;
        case "a":
          x += i.p1.x; y += i.p1.y
          x += i.p2.x; y += i.p2.y
          pts += 2
          break;
      }
    })
    if (pts) {
      x = x / (pts)
      y = y / (pts)
    }
    return {x:x, y:y}
  }

  shadow(blur=0, color="black", alpha=1, x=5, y=5) {
    this.ctx.shadowBlur = blur
    this.ctx.shadowColor = color
    this.ctx.shadowOffsetX = x
    this.ctx.shadowOffsetY = y
    this.ctx.shadowAlpha = alpha
    return this
  }

  add(p1,p2) {
    return ({x: p1.x + p2.x, y: p1.y + p2.y})
  }

  moveTo(p0,y) {
    let p = typeof(p0) === "object" ? p0 : {x:p0, y:y}
    let center = this.center()
    let distance = {x: p.x - center.x, y: p.y - center.y}
    this.instrs.forEach ((i,ind) => {
      switch(i.instr) {
        case "m" : case "l" : case "arc":
          this.instrs[ind].p = this.add(i.p, distance)  //this.add(i.p, distance);
          break
        case "q":
          i.p = this.add(i.p, distance);
          i.c = this.add(i.c, distance); break
        case "b":
          i.c1 = this.add(i.c1, distance)
          i.c2 = this.add(i.c2, distance)
          i.p2 = this.add(i.p2, distance); break;
        case "a":
          i.p1 = this.add(i.p1, distance);
          i.p2 = this.add(i.p2, distance); break;
      }
    })
    return this
  }

  rotate(deg, pt) {
    let p = pt || this.center()
    if(p) {
      this.ops.push({op:"translate", values:[p.x, p.y]})
      this.ops.push({op:"rotate", values:[deg * Math.PI/180]})
      this.ops.push({op:"translate", values:[-p.x, -p.y]})
    }
    else{
      this.ops.push({op:"rotate", values:[deg * Math.PI/180]})
    }
    return this
  }

  draw () {
    this.ctx.save()
    this.ops.forEach (op => {
      if (op.op === "translate") {
        this.ctx.translate(op.values[0], op.values[1])
      }
      else { // rotate
        this.ctx.rotate(op.values[0])
      }
    })
    this.ctx.beginPath()
    this.instrs.forEach (instr => {
       switch (instr.instr) {
         case "m": this.ctx.moveTo(instr.p.x, instr.p.y); break
         case "l": this.ctx.lineTo(instr.p.x, instr.p.y); break
         case "b": this.ctx.bezierCurveTo(instr.c1.x, instr.c1.y,
                                               instr.c2.x, instr.c2.y,
                                               instr.p2.x, instr.p2.y); break
         case "a": this.ctx.arcTo(instr.p1.x, instr.p1.y, instr.p2.x, instr.p2.y, instr.r); break
         case "q": this.ctx.quadraticCurveTo(instr.c.x, instr.c.y, instr.p.x, instr.p.y); break
         case "arc": this.ctx.arc(instr.p.x, instr.p.y, instr.r, instr.sa, instr.ea, instr.cw); break
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
     if (this.style.stroke) {
       this.ctx.globalAlpha = this.style.strokeAlpha || this.style.alpha || 1
       this.ctx.strokeStyle = this.style.stroke
       this.ctx.lineWidth=this.style.strokeWidth || 1
       this.ctx.stroke()
     }
     if (this.style.shadow) {
       this.ctx.shadowColor = this.style.shadow
       this.ctx.shadowOffsetX = 10
       this.ctx.shadowOffsetY = 10
       //this.ctx.shadowBlur = this.style.shadowBlur;
     }
     if (this.style.filter) {
       this.style.filter.forEach(f => this.ctx.filter(f))
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

   circle(p, r=10, sa=0, ea=Math.PI * 2, cw=true) {
     this.instrs.push({instr:"arc", p:{x:0,y:0}, r:r, sa:sa, ea:ea, cw:cw})
     this.moveTo(p)
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
}

module.exports = Path
