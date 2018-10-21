/**
* @license
* Copyright 2016 Ruben Afonso, rubenaf.com
* This source code is licensed under the Apache license (see LICENSE file)
**/

"use strict";

/**
 * @classdesc This module contains functions to generate layout points
 * @class
 */
class Layout {

  /**
   * Returns a grid of x,y values
   * @param {number} xrows - number of points in x
   * @param {number} yrows - number of points in y
   * @param {number} width - total width
   * @param {number} height - total height
   * @return {array} list of xy values {x:val, y:val}
   */
  static grid (xrows, yrows, width, height)
  {
    let points = [];
    let xspan = width / xrows;
    let yspan = height / yrows;
    for (let ypoints = 1; ypoints < yrows ; ypoints++)
      for (let xpoints = 1;  xpoints < xrows; xpoints++)
        points.push ({x: xpoints * xspan, y: ypoints * yspan});
    return points;
  }

  /**
  *  Returns a Spiral of points centered at x,y
  * @param {number} points - number of points
  * @param {number} x - initial x coord
  * @param {number} y - initial y
  * @param {number} radius - radio
  * @param {number} coils - number of coils
  * @param {number} chord - chord value
  * @return {array} list of xy values {x:val, y:val}
  */
  static spiral (params)
  {
    let points = [];
    let centerX = params.x,
        centerY = params.y,
        radius = params.radius,
        coils = params.coils,
        chord = params.chord,
        maxPoints = params.points;
    let rotation = 2 * Math.PI;
    let thetaMax = coils * 2 * Math.PI;
    let awayStep = radius / thetaMax;
    let theta = chord/awayStep;
    for (let i = 0; i < maxPoints; i++) {
      if (theta > thetaMax)
        break;
      let away = awayStep * theta;
      let around = theta + rotation;
      let x = centerX + Math.cos ( around ) * away;
      let y = centerY + Math.sin ( around ) * away;
      theta += chord / away;
      points.push({x: x, y: y, r: theta});
    }
    return points;
  }

  /**
   * Returns the intersecting points after dividing the input area in three sections,
   * following the principles of the Rule Of Thirds.
   * @param {number} x0 - top leftmost x coord
   * @param {number} y0 - top leftmost y coord
   * @param {number} width - width of the area
   * @param {number} length - length of the area
   * @return {array} list containg the four {x,y} points of the intersections
   */
  static rof3 (x0, y0, width, height) {
    let rulePoints = [];
    let thirdWidth = width / 3;
    let thirdHeight = height / 3;
    rulePoints.push ({x: thirdWidth + x0, y: thirdHeight + y0});
    rulePoints.push ({x: thirdWidth * 2 + x0, y: thirdHeight + y0});
    rulePoints.push ({x: thirdWidth * 2 + x0, y: thirdHeight * 2 + y0});
    rulePoints.push ({x: thirdWidth + x0, y: thirdHeight * 2 + y0});
    return rulePoints;
  }

  /**
   * Returns a list of points along x-axis
   * @param {object} origin      - xy coords to start from
   * @param {number} interColumn - space between columns
   * @param {number} width       - max width
   * @return {object} a list of xy points
   */
  static cols (origin, interColumn, width) {
    let points = [];
    for (let i = origin.x; i < width; i += interColumn) {
      points.push({x:i, y:origin.y});
    }
    return points;
  }

  /**
   * Returns a list of points along y-axis
   * @param {object} origin   - xy coords to start from
   * @param {number} interRow - space between rows
   * @param {number} height   - max height
   * @return {object} a list of xy points
   */
  static rows (origin={x:0, y:0}, interRow=10, height=100) {
    let points = [];
    for (let i = origin.y; i < height; i += interRow) {
      points.push({x: origin.x, y: i});
    }
    return points;
  }

  /**
   * Returns a list of objects as masonry blocks
   * @param {number} width     - width of the masonry
   * @param {number} height    - height of the masonry
   * @param {string} configStr - ops string with the masonry layout
   * @return {object} a list of bricks with the x,y starting point, width and height of the brick, respectively
   */
  static masonry (width, height, configStr) {
    return new Masonry (width, height, configStr);
  }

}; // end Layout

module.exports = Layout;
