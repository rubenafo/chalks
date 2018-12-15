/**
 * @license
 * Copyright 2018 Ruben Afonso, rubenaf.com
 * This source code is licensed under the Apache license (see LICENSE file)
 **/

"use strict";

class Parametrics {

  /**
   * Returns the points generated by a Butterfly curve
   * @param {object} origin - xymap with coordinates
   * @param {number} scale  - value to scale the points
   * @param {number} loops  - number of loops to iterate
   * @param {number} lambda - lambda parameter of the curve
   */
  static butterflyCurve(origin, scale, loops, lambda) {
    let points = [];
    let stepSize = 0.025;
    let upperLimit = loops * Math.PI;
    for (let t = 0.0; t < upperLimit; t += stepSize) {
      let e = (Math.exp(Math.cos(t)) - 2 * Math.cos(lambda * t) - Math.pow(Math.sin(t / 12), 5));
      let x = Math.sin(t) * e;
      let y = Math.cos(t) * e;
      points.push(createVector(x * scale + origin.x, y * scale + origin.y))
    }
    return points;
  }

  /**
   * Returns the points generated by a Hypocycloid curve
   * @param {object} origin - xymap with starting coordinates
   * @param {number} r      - minor circle radio
   * @param {number} R      - major circle radio
   * @param {number} loops  - number of loops to iterate
   */
  static hypocycloid(origin, scale, loops, r, R) {
    let points = [];
    let stepSize = 0.025;
    let upperLimit = loops * Math.PI;
    for (let th = 0.0; th < upperLimit; th += stepSize) {
      let x = (R - r) * Math.cos(th) + r * Math.cos(((R - r) / r) * th);
      let y = (R - r) * Math.sin(th) - r * Math.sin(((R - r) / r) * th);
      points.push(createVector(x * scale + origin.x, y * scale + origin.y))
    }
    return points;
  }

  /**
   * Returns the points generated by a Rose curve.
   * The k parameter can be expressed as (n/d), being both integer values
   * @param {object} origin - xymap with starting coordinates
   * @param {number} k      - k factor of the Rose curve (n/d)
   * @param {number} loops  - number of loops to iterate
   */
  static rose(origin, scale, loops, k) {
    let points = [];
    let stepSize = 0.025;
    let upperLimit = loops * Math.PI;
    for (let th = 0.0; th < upperLimit; th += stepSize) {
      let x = Math.cos(k * th) * Math.cos(th);
      let y = Math.cos(k * th) * Math.sin(th);
      points.push(createVector(x, y));
    }
    return points;
  }

  /**
   * Returns the points from the Rossler attractor
   * @param {object} origin - xy coordinates to center the attractor
   * @param {number} scale - scale factor
   * @param {number} loops - number of iterations
   * @param {number} a a value
   * @param {number} b b value
   * @param {number} c c value
   * @param {number} h h value
   * @return a list of xy points
   *
   *  Rossler Attractor code.
   *  http://paulbourke.net/fractals/rossler/
   */
  static rossler(origin, scale, loops, a, b, c, h) {
    function rosslerPoint(x, y, z, a, b, c) {
      let dx = -(y + z);
      let dy = x + a * y;
      let dz = b + z * (x - c);
      return {
        x: dx,
        y: dy,
        z: dz
      };
    };
    let center = {
      x: origin.x,
      y: origin.y
    }; // center in the screen
    let x = 0.1,
      y = 0.1,
      z = 0.1;
    let tmpx = 0,
      tmpy = 0,
      tmpz = 0;
    let points = [];
    for (let i = 0; i < loops; i++) {
      let dt = rosslerPoint(x, y, z, a, b, c);
      tmpx = x + h * dt.x;
      tmpy = y + h * dt.y;
      tmpz = z + h * dt.z;
      let point = createVector(tmpx * scale + center.x, tmpy * scale + center.y, tmpz)
      x = tmpx;
      y = tmpy;
      z = tmpz;
    }
    return points;
  }

  /**
   * Returns the Lorent attractor points
   * @param {object} origin - xy coordinates
   * @param {number} scale - scale factor
   * @param {number} loops - iterations
   * @param {number} z - value
   * @param {number} a - value
   * @param {number} b - value
   * @param {number} c - value
   * @param {number} h - value
   * @return a list of xypoints

    Lorentz Attractor code.
    http://www.algosome.com/articles/lorenz-attractor-programming-code.html
  */
 static lorentz(origin, scale, loops, x, y, z, a, b, c, h) {
    function lorentzPoint(x, y, z, a, b, c) {
      let dx = a * (y - x);
      let dy = x * (b - z) - y;
      let dz = x * y - c * z;
      return {
        x: dx,
        y: dy,
        z: dz
      };
    };

    //var x = 0.1, y = 0.1, z = 0.1;
    let tmpx = 0,
      tmpy = 0,
      tmpz = 0;
    let points = [];
    for (let i = 0; i < loops; i++) {
      let dt = lorentzPoint(x, y, z, a, b, c);
      tmpx = x + h * dt.x;
      tmpy = y + h * dt.y;
      tmpz = z + h * dt.z;
      points.push(createVector(tmpx * scale + origin.x, tmpy * scale + origin.y, tmpz))
      x = tmpx;
      y = tmpy;
      z = tmpz;
    }
    return points;
  }

  /**
   * Returns the points from an attractor
   * http://struct.cc/blog/2011/08/15/strange-attractors/
   * @param {number} numPoints number of points to generate
   * @param {string} entryString initial configuration string
   * @return a list of xy points
   */
  static attractor(origin, loops, entryString) {
    // Fractal pattern and coefficients.
    let a = [];
    let points = [];

    // Parameters.
    let x = 0.1,
      y = 0.1;
    let r = 360 % entryString.length;

    // Initialize coefficients.
    for (let i = 0; i < entryString.length; i++) {
      a[i] = (entryString.charCodeAt(i) - 65 - 12) / 10;
    }
    points.push({
      x: origin.x + 50 * Math.cos(r),
      y: origin.y + 58 * Math.sin(r),
      r: 0
    });
    for (let i = 0; i < loops; i++) {
      let nx = a[0] + a[1] * x + a[2] * x * x +
        a[3] * x * y + a[4] * y + a[5] * y * y;
      let ny = a[6] + a[7] * x + a[8] * x * x +
        a[9] * x * y + a[10] * y + a[11] * y * y;
      let xvalue = (origin.x) * nx + origin.x;
      let yvalue = (origin.y) * ny + origin.y;
      points.push(createVector(Math.abs(xvalue), Math.abs(yvalue)))
      x = nx;
      y = ny;
    }
    return points;
  }

  /*a = -2.24, b = 0.43, c = -0.65, d = -2.43
    a = 2.01, b = -2.53, c = 1.61, d = -0.33
    a = -2, b = -2, c = -1.2, d = 2
    a = 2.01, b = -2.53, c = 1.61, d = -0.33
    a = -2, b = -2, c = -1.2, d = 2
  */
 static dejon(origin, a, b, c, d, scale = 100, loops = 10) {
    let points = []
    let xt = 1, yt = 1
    for (let i = 0; i < loops; i++) {
      let nextx = (Math.sin(a * yt) - Math.cos(b * xt))
      let nexty = (Math.sin(c * xt) - Math.cos(d * yt))
      points.push(createVector(scale * xt + origin.x + scale, scale * yt + origin.y - scale))
      xt = nextx
      yt = nexty
    }
    return points
  }
}

module.exports = Parametrics
