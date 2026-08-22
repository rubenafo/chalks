// Minimal stand-in for the p5/DOM surface Scene's constructor touches
// (p5.instance.canvas, createCanvas, a 2d context), on top of the p5-stub's
// global functions. Enough to exercise Scene's own logic (seed validation,
// background fill) without a real browser.
require("./p5-stub")

function fakeCtx() {
  return {fillRect() {}, fillStyle: null}
}
function fakeCanvasEl() {
  return {getContext: () => fakeCtx()}
}

// chalks.js also attaches methods to p5.Vector.prototype/p5.prototype as a
// module-load side effect, so those need to exist too, not just .instance.
global.p5 = {instance: {canvas: fakeCanvasEl()}, Vector: {prototype: {}}, prototype: {}}
global.createCanvas = () => fakeCanvasEl()
