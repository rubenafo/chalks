/**
* @license
* Copyright 2019 Ruben Afonso, rubenaf.com
* This source code is licensed under the Apache license (see LICENSE file)
**/

"use strict";

let MasonryParser = require ("./MasonryGrammar.js");

class Brick {

  constructor (x0, y0, width, height) {
    this.x = x0;
    this.y = y0;
    this.width = width;
    this.height = height;
  }
}

class Masonry {

    constructor (width, height, configString, margin) {
      this.bricks = [];   // a brick: {x0, y0, width, height}
      this.init(width, height, configString, margin)
      return this.bricks;
    }

    init (width, height, configString, margin) {
      this.contextInfo(width, height, configString)
      if (this.margin) {
        this.bricks.forEach (b => {
          b.x += margin
          b.y += margin
          b.width -= margin
          b.width -= margin
        })
      }
    }

    contextInfo (w, h, configStr) {
      var ops = MasonryParser.parse(configStr);
      var posStack = [];
      var width = w, height = h, x0 = 0, y0 = 0, headPos = 0;
      this.bricks.push(new Brick(x0, y0, width, height));
      posStack.push(headPos);

      while (ops.length > 0) {
        posStack.push(headPos);
        var currentBrick = this.bricks[headPos];
        var lookahead = ops[0];
        if (lookahead.op == '|') {
          var widthCount = this.bricks[headPos].x;
          this.bricks.splice(headPos,1);
          for (var i = 0; i < lookahead.values.length; i++) {
            this.bricks.splice (headPos+i, 0,
              new Brick (widthCount, currentBrick.y,
                         currentBrick.width * lookahead.values[i], currentBrick.height));
            widthCount += currentBrick.width * lookahead.values[i];
          }
          posStack.forEach(function(elem, i) { posStack[i] += lookahead.splits-1});
        }
        else if (lookahead.op == "-") {
          var heightCount = this.bricks[headPos].y;
          this.bricks.splice (headPos,1);
          for (var i = 0; i < lookahead.values.length; i++) {
            this.bricks.splice (headPos+i, 0,
              new Brick (currentBrick.x, heightCount,
                         currentBrick.width, currentBrick.height * lookahead.values[i]));
            heightCount += currentBrick.height * lookahead.values[i];
          }
          posStack.forEach(function(elem, i) { posStack[i] += lookahead.splits-1});
        }
        else if (lookahead.op == '>') {
          headPos = posStack.shift();
        }
        ops = ops.slice(1);
      }
    }
};

module.exports.Masonry = Masonry;
