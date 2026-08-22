var Chalks = (() => {
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __commonJS = (cb, mod) => function __require() {
    try {
      return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
    } catch (e) {
      throw mod = 0, e;
    }
  };

  // src/MasonryGrammar.js
  var require_MasonryGrammar = __commonJS({
    "src/MasonryGrammar.js"(exports, module) {
      module.exports = (function() {
        function quote(s) {
          return '"' + s.replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\x08/g, "\\b").replace(/\t/g, "\\t").replace(/\n/g, "\\n").replace(/\f/g, "\\f").replace(/\r/g, "\\r").replace(/[\x00-\x07\x0B\x0E-\x1F\x80-\uFFFF]/g, escape) + '"';
        }
        var result = {
          /*
           * Parses the input with a generated parser. If the parsing is successfull,
           * returns a value explicitly or implicitly specified by the grammar from
           * which the parser was generated (see |PEG.buildParser|). If the parsing is
           * unsuccessful, throws |PEG.parser.SyntaxError| describing the error.
           */
          parse: function(input, startRule) {
            var parseFunctions = {
              "start": parse_start,
              "content": parse_content,
              "number": parse_number,
              "shortActions": parse_shortActions,
              "moveForward": parse_moveForward
            };
            if (startRule !== void 0) {
              if (parseFunctions[startRule] === void 0) {
                throw new Error("Invalid rule name: " + quote(startRule) + ".");
              }
            } else {
              startRule = "start";
            }
            var pos = 0;
            var reportFailures = 0;
            var rightmostFailuresPos = 0;
            var rightmostFailuresExpected = [];
            function padLeft(input2, padding, length) {
              var result3 = input2;
              var padLength = length - input2.length;
              for (var i = 0; i < padLength; i++) {
                result3 = padding + result3;
              }
              return result3;
            }
            function escape2(ch) {
              var charCode = ch.charCodeAt(0);
              var escapeChar;
              var length;
              if (charCode <= 255) {
                escapeChar = "x";
                length = 2;
              } else {
                escapeChar = "u";
                length = 4;
              }
              return "\\" + escapeChar + padLeft(charCode.toString(16).toUpperCase(), "0", length);
            }
            function matchFailed(failure) {
              if (pos < rightmostFailuresPos) {
                return;
              }
              if (pos > rightmostFailuresPos) {
                rightmostFailuresPos = pos;
                rightmostFailuresExpected = [];
              }
              rightmostFailuresExpected.push(failure);
            }
            function parse_start() {
              var result0, result1;
              result0 = [];
              result1 = parse_shortActions();
              if (result1 === null) {
                result1 = parse_moveForward();
              }
              while (result1 !== null) {
                result0.push(result1);
                result1 = parse_shortActions();
                if (result1 === null) {
                  result1 = parse_moveForward();
                }
              }
              return result0;
            }
            function parse_content() {
              var result0, result1, result22, result3, result4;
              var pos0, pos1;
              pos0 = pos;
              pos1 = pos;
              if (input.charCodeAt(pos) === 91) {
                result0 = "[";
                pos++;
              } else {
                result0 = null;
                if (reportFailures === 0) {
                  matchFailed('"["');
                }
              }
              if (result0 !== null) {
                result22 = parse_number();
                if (result22 !== null) {
                  result1 = [];
                  while (result22 !== null) {
                    result1.push(result22);
                    result22 = parse_number();
                  }
                } else {
                  result1 = null;
                }
                if (result1 !== null) {
                  if (input.charCodeAt(pos) === 93) {
                    result22 = "]";
                    pos++;
                  } else {
                    result22 = null;
                    if (reportFailures === 0) {
                      matchFailed('"]"');
                    }
                  }
                  if (result22 !== null) {
                    if (input.charCodeAt(pos) === 44) {
                      result3 = ",";
                      pos++;
                    } else {
                      result3 = null;
                      if (reportFailures === 0) {
                        matchFailed('","');
                      }
                    }
                    result3 = result3 !== null ? result3 : "";
                    if (result3 !== null) {
                      result4 = parse_number();
                      result4 = result4 !== null ? result4 : "";
                      if (result4 !== null) {
                        result0 = [result0, result1, result22, result3, result4];
                      } else {
                        result0 = null;
                        pos = pos1;
                      }
                    } else {
                      result0 = null;
                      pos = pos1;
                    }
                  } else {
                    result0 = null;
                    pos = pos1;
                  }
                } else {
                  result0 = null;
                  pos = pos1;
                }
              } else {
                result0 = null;
                pos = pos1;
              }
              if (result0 !== null) {
                result0 = (function(offset2, n, pos2) {
                  var percN = n.map(function(i) {
                    return i / 100;
                  });
                  return { splits: n.length, pos: pos2 || 0, values: percN };
                })(pos0, result0[1], result0[4]);
              }
              if (result0 === null) {
                pos = pos0;
              }
              if (result0 === null) {
                pos0 = pos;
                pos1 = pos;
                result0 = parse_number();
                if (result0 !== null) {
                  if (input.charCodeAt(pos) === 44) {
                    result1 = ",";
                    pos++;
                  } else {
                    result1 = null;
                    if (reportFailures === 0) {
                      matchFailed('","');
                    }
                  }
                  result1 = result1 !== null ? result1 : "";
                  if (result1 !== null) {
                    result22 = parse_number();
                    result22 = result22 !== null ? result22 : "";
                    if (result22 !== null) {
                      result0 = [result0, result1, result22];
                    } else {
                      result0 = null;
                      pos = pos1;
                    }
                  } else {
                    result0 = null;
                    pos = pos1;
                  }
                } else {
                  result0 = null;
                  pos = pos1;
                }
                if (result0 !== null) {
                  result0 = (function(offset2, splits, pos2) {
                    var elems = [];
                    for (var i = 0; i < splits; i++)
                      elems[i] = 1 / splits;
                    return { splits, pos: pos2 || 0, values: elems };
                  })(pos0, result0[0], result0[2]);
                }
                if (result0 === null) {
                  pos = pos0;
                }
              }
              return result0;
            }
            function parse_number() {
              var result0, result1, result22, result3;
              var pos0, pos1, pos2;
              pos0 = pos;
              pos1 = pos;
              if (/^[0-9]/.test(input.charAt(pos))) {
                result1 = input.charAt(pos);
                pos++;
              } else {
                result1 = null;
                if (reportFailures === 0) {
                  matchFailed("[0-9]");
                }
              }
              if (result1 !== null) {
                result0 = [];
                while (result1 !== null) {
                  result0.push(result1);
                  if (/^[0-9]/.test(input.charAt(pos))) {
                    result1 = input.charAt(pos);
                    pos++;
                  } else {
                    result1 = null;
                    if (reportFailures === 0) {
                      matchFailed("[0-9]");
                    }
                  }
                }
              } else {
                result0 = null;
              }
              if (result0 !== null) {
                pos2 = pos;
                if (input.charCodeAt(pos) === 46) {
                  result1 = ".";
                  pos++;
                } else {
                  result1 = null;
                  if (reportFailures === 0) {
                    matchFailed('"."');
                  }
                }
                if (result1 !== null) {
                  if (/^[0-9]/.test(input.charAt(pos))) {
                    result3 = input.charAt(pos);
                    pos++;
                  } else {
                    result3 = null;
                    if (reportFailures === 0) {
                      matchFailed("[0-9]");
                    }
                  }
                  if (result3 !== null) {
                    result22 = [];
                    while (result3 !== null) {
                      result22.push(result3);
                      if (/^[0-9]/.test(input.charAt(pos))) {
                        result3 = input.charAt(pos);
                        pos++;
                      } else {
                        result3 = null;
                        if (reportFailures === 0) {
                          matchFailed("[0-9]");
                        }
                      }
                    }
                  } else {
                    result22 = null;
                  }
                  if (result22 !== null) {
                    result1 = [result1, result22];
                  } else {
                    result1 = null;
                    pos = pos2;
                  }
                } else {
                  result1 = null;
                  pos = pos2;
                }
                result1 = result1 !== null ? result1 : "";
                if (result1 !== null) {
                  if (input.charCodeAt(pos) === 44) {
                    result22 = ",";
                    pos++;
                  } else {
                    result22 = null;
                    if (reportFailures === 0) {
                      matchFailed('","');
                    }
                  }
                  result22 = result22 !== null ? result22 : "";
                  if (result22 !== null) {
                    result0 = [result0, result1, result22];
                  } else {
                    result0 = null;
                    pos = pos1;
                  }
                } else {
                  result0 = null;
                  pos = pos1;
                }
              } else {
                result0 = null;
                pos = pos1;
              }
              if (result0 !== null) {
                result0 = (function(offset2, digits) {
                  return parseFloat(digits.join(""), 10);
                })(pos0, result0[0]);
              }
              if (result0 === null) {
                pos = pos0;
              }
              return result0;
            }
            function parse_shortActions() {
              var result0, result1;
              var pos0, pos1;
              pos0 = pos;
              pos1 = pos;
              if (input.charCodeAt(pos) === 124) {
                result0 = "|";
                pos++;
              } else {
                result0 = null;
                if (reportFailures === 0) {
                  matchFailed('"|"');
                }
              }
              if (result0 === null) {
                if (input.charCodeAt(pos) === 45) {
                  result0 = "-";
                  pos++;
                } else {
                  result0 = null;
                  if (reportFailures === 0) {
                    matchFailed('"-"');
                  }
                }
              }
              if (result0 !== null) {
                result1 = parse_content();
                result1 = result1 !== null ? result1 : "";
                if (result1 !== null) {
                  result0 = [result0, result1];
                } else {
                  result0 = null;
                  pos = pos1;
                }
              } else {
                result0 = null;
                pos = pos1;
              }
              if (result0 !== null) {
                result0 = (function(offset2, op, p) {
                  var act = { op, splits: 2, pos: 0, values: [0.5, 0.5] };
                  if (p != null && p) {
                    act.splits = p.splits;
                    act.pos = p.pos;
                    act.values = p.values;
                  }
                  return act;
                })(pos0, result0[0], result0[1]);
              }
              if (result0 === null) {
                pos = pos0;
              }
              return result0;
            }
            function parse_moveForward() {
              var result0, result1;
              var pos0, pos1;
              pos0 = pos;
              pos1 = pos;
              if (input.charCodeAt(pos) === 62) {
                result0 = ">";
                pos++;
              } else {
                result0 = null;
                if (reportFailures === 0) {
                  matchFailed('">"');
                }
              }
              if (result0 !== null) {
                result1 = parse_number();
                result1 = result1 !== null ? result1 : "";
                if (result1 !== null) {
                  result0 = [result0, result1];
                } else {
                  result0 = null;
                  pos = pos1;
                }
              } else {
                result0 = null;
                pos = pos1;
              }
              if (result0 !== null) {
                result0 = (function(offset2, pos2) {
                  var act = { op: ">", pos: "1" };
                  if (pos2 != null && pos2)
                    act.pos = pos2;
                  return act;
                })(pos0, result0[1]);
              }
              if (result0 === null) {
                pos = pos0;
              }
              return result0;
            }
            function cleanupExpected(expected) {
              expected.sort();
              var lastExpected = null;
              var cleanExpected = [];
              for (var i = 0; i < expected.length; i++) {
                if (expected[i] !== lastExpected) {
                  cleanExpected.push(expected[i]);
                  lastExpected = expected[i];
                }
              }
              return cleanExpected;
            }
            function computeErrorPosition() {
              var line = 1;
              var column = 1;
              var seenCR = false;
              for (var i = 0; i < Math.max(pos, rightmostFailuresPos); i++) {
                var ch = input.charAt(i);
                if (ch === "\n") {
                  if (!seenCR) {
                    line++;
                  }
                  column = 1;
                  seenCR = false;
                } else if (ch === "\r" || ch === "\u2028" || ch === "\u2029") {
                  line++;
                  column = 1;
                  seenCR = true;
                } else {
                  column++;
                  seenCR = false;
                }
              }
              return { line, column };
            }
            var result2 = parseFunctions[startRule]();
            if (result2 === null || pos !== input.length) {
              var offset = Math.max(pos, rightmostFailuresPos);
              var found = offset < input.length ? input.charAt(offset) : null;
              var errorPosition = computeErrorPosition();
              throw new this.SyntaxError(
                cleanupExpected(rightmostFailuresExpected),
                found,
                offset,
                errorPosition.line,
                errorPosition.column
              );
            }
            return result2;
          },
          /* Returns the parser source code. */
          toSource: function() {
            return this._source;
          }
        };
        result.SyntaxError = function(expected, found, offset, line, column) {
          function buildMessage(expected2, found2) {
            var expectedHumanized, foundHumanized;
            switch (expected2.length) {
              case 0:
                expectedHumanized = "end of input";
                break;
              case 1:
                expectedHumanized = expected2[0];
                break;
              default:
                expectedHumanized = expected2.slice(0, expected2.length - 1).join(", ") + " or " + expected2[expected2.length - 1];
            }
            foundHumanized = found2 ? quote(found2) : "end of input";
            return "Expected " + expectedHumanized + " but " + foundHumanized + " found.";
          }
          this.name = "SyntaxError";
          this.expected = expected;
          this.found = found;
          this.message = buildMessage(expected, found);
          this.offset = offset;
          this.line = line;
          this.column = column;
        };
        result.SyntaxError.prototype = Error.prototype;
        return result;
      })();
    }
  });

  // src/Masonry.js
  var require_Masonry = __commonJS({
    "src/Masonry.js"(exports, module) {
      "use strict";
      var MasonryParser = require_MasonryGrammar();
      var Brick = class {
        constructor(x0, y0, width, height) {
          this.x = x0;
          this.y = y0;
          this.width = width;
          this.height = height;
        }
      };
      var Masonry = class {
        constructor(width, height, configString, margin) {
          this.bricks = [];
          this.init(width, height, configString, margin);
          return this.bricks;
        }
        init(width, height, configString, margin) {
          this.contextInfo(width, height, configString);
          if (this.margin) {
            this.bricks.forEach((b) => {
              b.x += margin;
              b.y += margin;
              b.width -= margin;
              b.width -= margin;
            });
          }
        }
        contextInfo(w, h, configStr) {
          var ops = MasonryParser.parse(configStr);
          var posStack = [];
          var width = w, height = h, x0 = 0, y0 = 0, headPos = 0;
          this.bricks.push(new Brick(x0, y0, width, height));
          posStack.push(headPos);
          while (ops.length > 0) {
            posStack.push(headPos);
            var currentBrick = this.bricks[headPos];
            var lookahead = ops[0];
            if (lookahead.op == "|") {
              var widthCount = this.bricks[headPos].x;
              this.bricks.splice(headPos, 1);
              for (var i = 0; i < lookahead.values.length; i++) {
                this.bricks.splice(
                  headPos + i,
                  0,
                  new Brick(
                    widthCount,
                    currentBrick.y,
                    currentBrick.width * lookahead.values[i],
                    currentBrick.height
                  )
                );
                widthCount += currentBrick.width * lookahead.values[i];
              }
              posStack.forEach(function(elem, i2) {
                posStack[i2] += lookahead.splits - 1;
              });
            } else if (lookahead.op == "-") {
              var heightCount = this.bricks[headPos].y;
              this.bricks.splice(headPos, 1);
              for (var i = 0; i < lookahead.values.length; i++) {
                this.bricks.splice(
                  headPos + i,
                  0,
                  new Brick(
                    currentBrick.x,
                    heightCount,
                    currentBrick.width,
                    currentBrick.height * lookahead.values[i]
                  )
                );
                heightCount += currentBrick.height * lookahead.values[i];
              }
              posStack.forEach(function(elem, i2) {
                posStack[i2] += lookahead.splits - 1;
              });
            } else if (lookahead.op == ">") {
              headPos = posStack.shift();
            }
            ops = ops.slice(1);
          }
        }
      };
      module.exports.Masonry = Masonry;
    }
  });

  // src/Layout.js
  var require_Layout = __commonJS({
    "src/Layout.js"(exports, module) {
      "use strict";
      var Masonry = require_Masonry().Masonry;
      var Layout = class {
        /**
         * Returns a grid of x,y values
         * @param {number} xrows - number of points in x
         * @param {number} yrows - number of points in y
         * @param {number} width - total width
         * @param {number} height - total height
         * @return {array} list of xy values {x:val, y:val}
         */
        static grid(xrows, yrows, width, height) {
          let points = [];
          let xspan = width / xrows;
          let yspan = height / yrows;
          for (let ypoints = 1; ypoints < yrows; ypoints++)
            for (let xpoints = 1; xpoints < xrows; xpoints++)
              points.push(createVector(xpoints * xspan, ypoints * yspan));
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
        static spiral(maxPoints, centerX, centerY, radius, coils, chord) {
          let points = [];
          let rotation = 2 * Math.PI;
          let thetaMax = coils * 2 * Math.PI;
          let awayStep = radius / thetaMax;
          let theta = chord / awayStep;
          for (let i = 0; i < maxPoints; i++) {
            if (theta > thetaMax)
              break;
            let away = awayStep * theta;
            let around = theta + rotation;
            let x = centerX + Math.cos(around) * away;
            let y = centerY + Math.sin(around) * away;
            theta += chord / away;
            let p = createVector(x, y);
            p.r = theta;
            points.push(p);
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
        static rof3(x0, y0, width, height) {
          let rulePoints = [];
          let thirdWidth = width / 3;
          let thirdHeight = height / 3;
          rulePoints.push(createVector(thirdWidth + x0, thirdHeight + y0));
          rulePoints.push(createVector(thirdWidth * 2 + x0, thirdHeight + y0));
          rulePoints.push(createVector(thirdWidth * 2 + x0, thirdHeight * 2 + y0));
          rulePoints.push(createVector(thirdWidth + x0, thirdHeight * 2 + y0));
          return rulePoints;
        }
        /**
         * Returns a list of points along x-axis
         * @param {object} origin      - xy coords to start from
         * @param {number} interColumn - space between columns
         * @param {number} width       - max width
         * @return {object} a list of xy points
         */
        static cols(origin, interColumn, width) {
          let points = [];
          for (let i = origin.x; i < width; i += interColumn) {
            points.push(createVector(i, origin.y));
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
        static rows(origin = { x: 0, y: 0 }, interRow = 10, height = 100) {
          let points = [];
          for (let i = origin.y; i < height; i += interRow) {
            points.push(createVector(origin.x, i));
          }
          return points;
        }
        /**
         * Returns a list of objects as masonry blocks
         * @param {number} width     - width of the masonry
         * @param {number} height    - height of the masonry
         * @param {string} configStr - ops string with the masonry layout
         * @param {number} margin    - margin betwween blocks
         * @return {object} a list of bricks with the x,y starting point, width and height of the brick, respectively
         */
        static masonry(width, height, configStr, margin) {
          return new Masonry(width, height, configStr, margin);
        }
      };
      module.exports = Layout;
    }
  });

  // src/Points.js
  var require_Points = __commonJS({
    "src/Points.js"(exports, module) {
      "use strict";
      var Points = class {
        static subd(points, level = 1) {
          let result = [];
          for (let i = 1; i < points.length; i++) {
            result.push(
              points[i - 1],
              { x: (points[i - 1].x + points[i].x) / 2, y: (points[i - 1].y + points[i].y) / 2 }
            );
          }
          result.push(points[points.length - 1]);
          return result;
        }
        static rects(points, height) {
          for (let i = 0; i < points.length; i++) {
            let length = Math.sqrt(points[i].x * points[i].x + points[i].y * points[i].y);
          }
        }
        static rslice(points, minSize, maxSize) {
          let distance = maxSize - minSize;
          let start = Math.round(random() * points.length) - distance;
          let end = start + Math.round(distance * random());
          console.log(end - start);
          return points.slice(start, end);
        }
        static noise(points, val) {
          let f = function(p) {
            return { x: p.x + random() * val, y: p.y + random() * val };
          };
          return points.map(f);
        }
        static closest(point, listPoints) {
          let closest = void 0;
          let distance = 1e10;
          let diffPoints = listPoints.filter((p) => p.x !== point.x && p.y !== point.y);
          diffPoints.forEach((p) => {
            let d = Math.sqrt(Math.pow(point.x - p.x, 2) + Math.pow(point.y - p.y, 2));
            if (d < distance) {
              distance = d;
              closest = p;
            }
          });
          return closest;
        }
        static rotatePoint(p, deg, around) {
          let radians = deg * Math.PI / 180, cos = Math.cos(radians), sin = Math.sin(radians);
          let dx = p.x - around.x, dy = p.y - around.y;
          let newx = cos * dx - sin * dy + around.x;
          let newy = sin * dx + cos * dy + around.y;
          return { x: newx, y: newy };
        }
      };
      module.exports = Points;
    }
  });

  // src/Path.js
  var require_Path = __commonJS({
    "src/Path.js"(exports, module) {
      "use strict";
      var Points = require_Points();
      var Path = class _Path {
        constructor(scene, style = {}) {
          this.style = style;
          this.instrs = [];
          this.parent = scene;
          this.ctx = scene.ctx;
          this.clippedBy = void 0;
        }
        // Clone an object.
        // "hide" style parameter is not propagated
        clone(style = {}) {
          let newStyle = JSON.parse(JSON.stringify(this.style));
          Object.keys(style).forEach((k) => newStyle[k] = style[k]);
          let newPath = new _Path(this.parent, newStyle);
          delete newPath.style.hide;
          newPath.instrs = JSON.parse(JSON.stringify(this.instrs));
          return newPath;
        }
        m(x, y) {
          let point = typeof x === "object" ? { x: x.x, y: x.y } : { x, y };
          this.instrs.push({ instr: "m", p: point });
          return this;
        }
        // Returns the endpoint of the last instruction, i.e. the path's current pen position.
        _lastPoint() {
          if (!this.instrs.length) return { x: 0, y: 0 };
          let last = this.instrs[this.instrs.length - 1];
          switch (last.instr) {
            case "m":
            case "l":
            case "q":
              return last.p;
            case "b":
            case "a":
              return last.p2;
            case "arc":
              return { x: last.p.x + last.r * Math.cos(last.ea), y: last.p.y + last.r * Math.sin(last.ea) };
            default:
              return { x: 0, y: 0 };
          }
        }
        // A straight line, expressed as a cubic bezier whose control points sit on
        // the line itself (at 1/3 and 2/3), so it renders identically to lineTo().
        l(x, y) {
          let point = typeof x === "object" ? { x: x.x, y: x.y } : { x, y };
          let from = this._lastPoint();
          let dx = point.x - from.x, dy = point.y - from.y;
          this.instrs.push({
            instr: "b",
            c1: { x: from.x + dx / 3, y: from.y + dy / 3 },
            c2: { x: from.x + dx * 2 / 3, y: from.y + dy * 2 / 3 },
            p2: point
          });
          return this;
        }
        bezier(c1, c2, p2) {
          this.instrs.push({
            instr: "b",
            c1: { x: c1.x, y: c1.y, z: c1.z },
            c2: { x: c2.x, y: c2.y, z: c2.z },
            p2: { x: p2.x, y: p2.y, z: p2.z }
          });
          return this;
        }
        bc(p) {
          let previous = this.instrs[this.instrs.length - 1];
          if (previous.instr !== "b")
            throw "Previous instruction to bc() must be bezier()";
          this.bezier(Object.assign({}, previous.c1), Object.assign({}, previous.c2), p);
          return this;
        }
        arc(p1, p2, r) {
          this.instrs.push({
            instr: "a",
            p1: { x: p1.x, y: p1.y, z: p1.z },
            p2: { x: p2.x, y: p2.y, z: p2.z },
            r
          });
          return this;
        }
        quad(c, p) {
          this.instrs.push({ instr: "q", c: { x: c.x, y: c.y, z: c.z }, p: { x: p.x, y: p.y, z: p.z } });
          return this;
        }
        center() {
          let pts = 0;
          let centerPt = createVector(0, 0);
          this.instrs.forEach((i) => {
            Object.keys(i).filter((k) => k !== "instr").forEach((k) => {
              centerPt.add(i[k].x, i[k].y);
            });
            pts += Object.keys(i).length - 1;
          });
          if (pts)
            centerPt.div(pts);
          return centerPt;
        }
        shadow(blur = 0, color = "black", alpha = 1, x = 5, y = 5) {
          this.ctx.shadowBlur = blur;
          this.ctx.shadowColor = color;
          this.ctx.shadowOffsetX = x;
          this.ctx.shadowOffsetY = y;
          this.ctx.shadowAlpha = alpha;
          return this;
        }
        // Shifts every point in the path by a relative (dx,dy) offset.
        translate(dx, dy) {
          let delta = typeof dx === "object" ? { x: dx.x, y: dx.y } : { x: dx, y: dy };
          this.instrs.forEach((i) => {
            Object.keys(i).forEach((k) => {
              if (k !== "instr") {
                i[k].x += delta.x;
                i[k].y += delta.y;
              }
            });
          });
          return this;
        }
        // Moves the path so its center lands on the given absolute point.
        moveTo(p0, y) {
          let p = typeof p0 === "object" ? p0 : { x: p0, y };
          let center = this.center();
          return this.translate(p.x - center.x, p.y - center.y);
        }
        rotate(deg, pt) {
          pt = pt || this.center();
          this.instrs.forEach((instr) => {
            Object.keys(instr).forEach((k) => {
              if (k !== "instr")
                instr[k] = Points.rotatePoint(instr[k], deg, pt);
            });
          });
          return this;
        }
        draw(scale = 1) {
          this.ctx.save();
          if (this.clippedBy) {
            let region = new Path2D();
            region.rect(this.clippedBy.x, this.clippedBy.y, this.clippedBy.w, this.clippedBy.h);
            this.ctx.clip(region);
          }
          if (this.style.filter) {
            this.ctx.filter = this.style.filter;
          }
          this.ctx.beginPath();
          this.instrs.forEach((instr) => {
            switch (instr.instr) {
              case "m":
                this.ctx.moveTo(instr.p.x * scale, instr.p.y * scale);
                break;
              case "l":
                this.ctx.lineTo(instr.p.x * scale, instr.p.y * scale);
                break;
              case "b":
                this.ctx.bezierCurveTo(
                  instr.c1.x * scale,
                  instr.c1.y * scale,
                  instr.c2.x * scale,
                  instr.c2.y * scale,
                  instr.p2.x * scale,
                  instr.p2.y * scale
                );
                break;
              case "a":
                this.ctx.arcTo(instr.p1.x * scale, instr.p1.y * scale, instr.p2.x * scale, instr.p2.y * scale, instr.r);
                break;
              case "q":
                this.ctx.quadraticCurveTo(instr.c.x * scale, instr.c.y * scale, instr.p.x * scale, instr.p.y * scale);
                break;
              case "arc":
                this.ctx.arc(instr.p.x * scale, instr.p.y * scale, instr.r, instr.sa, instr.ea, instr.cw);
                break;
            }
          });
          this._applyStyle();
          return this;
        }
        _applyStyle() {
          if (this.style.fill) {
            this.ctx.globalAlpha = "alpha" in this.style ? this.style.alpha : 1;
            this.ctx.fillStyle = this.style.fill;
            this.ctx.fill();
          } else {
            this.ctx.noFill;
          }
          this.ctx.globalAlpha = this.style.strokeAlpha || this.style.alpha || 1;
          if (this.style.strokeWidth || this.style.stroke) {
            this.ctx.strokeStyle = this.style.stroke || "black";
            this.ctx.lineWidth = this.style.strokeWidth || 1;
            this.ctx.stroke();
          }
          if (this.style.shadow) {
            this.ctx.shadowColor = this.style.shadow;
            this.ctx.shadowOffsetX = 10;
            this.ctx.shadowOffsetY = 10;
          }
          this.ctx.lineCap = this.style.lineCap || "butt";
          this.ctx.restore();
          this.ctx.setTransform(1, 0, 0, 1, 0, 0);
        }
        fromPoints(m, n, height = 10, padding = 0) {
          let vector = { x: n.x - m.x, y: n.y - m.y };
          let length = Math.sqrt(vector.x * vector.x + vector.y * vector.y);
          let p0 = { x: m.x - padding, y: m.y - height / 2 };
          let p1 = { x: m.x + length + padding, y: m.y - height / 2 };
          let p2 = { x: m.x + length + padding, y: m.y + height / 2 };
          let p3 = { x: m.x - padding, y: m.y + height / 2 };
          this.m(p0).l(p1).l(p2).l(p3).l(p0);
          let xdiff = n.x - m.x;
          let ydiff = n.y - m.y;
          let deg = Math.atan2(ydiff, xdiff) * (180 / Math.PI);
          this.rotate(deg, m);
          return this;
        }
        // Approximates the arc from sa to ea with cubic bezier segments (<=90deg
        // each, the standard bezier-circle technique), instead of ctx.arc().
        // Direction always sweeps from sa to ea in increasing-angle order; `cw`
        // is accepted for signature compatibility but does not reverse the sweep.
        circle(p, r = 10, sa = 0, ea = Math.PI * 2, cw = true) {
          let span = ea - sa;
          let segments = Math.max(1, Math.ceil(Math.abs(span) / (Math.PI / 2)));
          let step = span / segments;
          let kappa = 4 / 3 * Math.tan(step / 4);
          let start = { x: p.x + r * Math.cos(sa), y: p.y + r * Math.sin(sa) };
          this.instrs.push({ instr: "m", p: start });
          for (let i = 0; i < segments; i++) {
            let a0 = sa + i * step;
            let a1 = sa + (i + 1) * step;
            let p0 = { x: p.x + r * Math.cos(a0), y: p.y + r * Math.sin(a0) };
            let p1 = { x: p.x + r * Math.cos(a1), y: p.y + r * Math.sin(a1) };
            this.instrs.push({
              instr: "b",
              c1: { x: p0.x - kappa * r * Math.sin(a0), y: p0.y + kappa * r * Math.cos(a0) },
              c2: { x: p1.x + kappa * r * Math.sin(a1), y: p1.y - kappa * r * Math.cos(a1) },
              p2: p1
            });
          }
          return this;
        }
        rect(p0, w, h) {
          return this.fromPoints({ x: p0.x, y: p0.y + h / 2 }, { x: p0.x + w, y: p0.y + h / 2 }, h);
        }
        line(p0, p1) {
          this.m(p0).l(p1);
          return this;
        }
        clip(x, y, w, h) {
          this.clippedBy = { x, y, w, h };
          return this;
        }
      };
      module.exports = Path;
    }
  });

  // node_modules/voronoi/rhill-voronoi-core.js
  var require_rhill_voronoi_core = __commonJS({
    "node_modules/voronoi/rhill-voronoi-core.js"(exports, module) {
      function Voronoi() {
        this.vertices = null;
        this.edges = null;
        this.cells = null;
        this.toRecycle = null;
        this.beachsectionJunkyard = [];
        this.circleEventJunkyard = [];
        this.vertexJunkyard = [];
        this.edgeJunkyard = [];
        this.cellJunkyard = [];
      }
      Voronoi.prototype.reset = function() {
        if (!this.beachline) {
          this.beachline = new this.RBTree();
        }
        if (this.beachline.root) {
          var beachsection = this.beachline.getFirst(this.beachline.root);
          while (beachsection) {
            this.beachsectionJunkyard.push(beachsection);
            beachsection = beachsection.rbNext;
          }
        }
        this.beachline.root = null;
        if (!this.circleEvents) {
          this.circleEvents = new this.RBTree();
        }
        this.circleEvents.root = this.firstCircleEvent = null;
        this.vertices = [];
        this.edges = [];
        this.cells = [];
      };
      Voronoi.prototype.sqrt = Math.sqrt;
      Voronoi.prototype.abs = Math.abs;
      Voronoi.prototype.\u03B5 = Voronoi.\u03B5 = 1e-9;
      Voronoi.prototype.inv\u03B5 = Voronoi.inv\u03B5 = 1 / Voronoi.\u03B5;
      Voronoi.prototype.equalWithEpsilon = function(a, b) {
        return this.abs(a - b) < 1e-9;
      };
      Voronoi.prototype.greaterThanWithEpsilon = function(a, b) {
        return a - b > 1e-9;
      };
      Voronoi.prototype.greaterThanOrEqualWithEpsilon = function(a, b) {
        return b - a < 1e-9;
      };
      Voronoi.prototype.lessThanWithEpsilon = function(a, b) {
        return b - a > 1e-9;
      };
      Voronoi.prototype.lessThanOrEqualWithEpsilon = function(a, b) {
        return a - b < 1e-9;
      };
      Voronoi.prototype.RBTree = function() {
        this.root = null;
      };
      Voronoi.prototype.RBTree.prototype.rbInsertSuccessor = function(node, successor) {
        var parent;
        if (node) {
          successor.rbPrevious = node;
          successor.rbNext = node.rbNext;
          if (node.rbNext) {
            node.rbNext.rbPrevious = successor;
          }
          node.rbNext = successor;
          if (node.rbRight) {
            node = node.rbRight;
            while (node.rbLeft) {
              node = node.rbLeft;
            }
            node.rbLeft = successor;
          } else {
            node.rbRight = successor;
          }
          parent = node;
        } else if (this.root) {
          node = this.getFirst(this.root);
          successor.rbPrevious = null;
          successor.rbNext = node;
          node.rbPrevious = successor;
          node.rbLeft = successor;
          parent = node;
        } else {
          successor.rbPrevious = successor.rbNext = null;
          this.root = successor;
          parent = null;
        }
        successor.rbLeft = successor.rbRight = null;
        successor.rbParent = parent;
        successor.rbRed = true;
        var grandpa, uncle;
        node = successor;
        while (parent && parent.rbRed) {
          grandpa = parent.rbParent;
          if (parent === grandpa.rbLeft) {
            uncle = grandpa.rbRight;
            if (uncle && uncle.rbRed) {
              parent.rbRed = uncle.rbRed = false;
              grandpa.rbRed = true;
              node = grandpa;
            } else {
              if (node === parent.rbRight) {
                this.rbRotateLeft(parent);
                node = parent;
                parent = node.rbParent;
              }
              parent.rbRed = false;
              grandpa.rbRed = true;
              this.rbRotateRight(grandpa);
            }
          } else {
            uncle = grandpa.rbLeft;
            if (uncle && uncle.rbRed) {
              parent.rbRed = uncle.rbRed = false;
              grandpa.rbRed = true;
              node = grandpa;
            } else {
              if (node === parent.rbLeft) {
                this.rbRotateRight(parent);
                node = parent;
                parent = node.rbParent;
              }
              parent.rbRed = false;
              grandpa.rbRed = true;
              this.rbRotateLeft(grandpa);
            }
          }
          parent = node.rbParent;
        }
        this.root.rbRed = false;
      };
      Voronoi.prototype.RBTree.prototype.rbRemoveNode = function(node) {
        if (node.rbNext) {
          node.rbNext.rbPrevious = node.rbPrevious;
        }
        if (node.rbPrevious) {
          node.rbPrevious.rbNext = node.rbNext;
        }
        node.rbNext = node.rbPrevious = null;
        var parent = node.rbParent, left = node.rbLeft, right = node.rbRight, next;
        if (!left) {
          next = right;
        } else if (!right) {
          next = left;
        } else {
          next = this.getFirst(right);
        }
        if (parent) {
          if (parent.rbLeft === node) {
            parent.rbLeft = next;
          } else {
            parent.rbRight = next;
          }
        } else {
          this.root = next;
        }
        var isRed;
        if (left && right) {
          isRed = next.rbRed;
          next.rbRed = node.rbRed;
          next.rbLeft = left;
          left.rbParent = next;
          if (next !== right) {
            parent = next.rbParent;
            next.rbParent = node.rbParent;
            node = next.rbRight;
            parent.rbLeft = node;
            next.rbRight = right;
            right.rbParent = next;
          } else {
            next.rbParent = parent;
            parent = next;
            node = next.rbRight;
          }
        } else {
          isRed = node.rbRed;
          node = next;
        }
        if (node) {
          node.rbParent = parent;
        }
        if (isRed) {
          return;
        }
        if (node && node.rbRed) {
          node.rbRed = false;
          return;
        }
        var sibling;
        do {
          if (node === this.root) {
            break;
          }
          if (node === parent.rbLeft) {
            sibling = parent.rbRight;
            if (sibling.rbRed) {
              sibling.rbRed = false;
              parent.rbRed = true;
              this.rbRotateLeft(parent);
              sibling = parent.rbRight;
            }
            if (sibling.rbLeft && sibling.rbLeft.rbRed || sibling.rbRight && sibling.rbRight.rbRed) {
              if (!sibling.rbRight || !sibling.rbRight.rbRed) {
                sibling.rbLeft.rbRed = false;
                sibling.rbRed = true;
                this.rbRotateRight(sibling);
                sibling = parent.rbRight;
              }
              sibling.rbRed = parent.rbRed;
              parent.rbRed = sibling.rbRight.rbRed = false;
              this.rbRotateLeft(parent);
              node = this.root;
              break;
            }
          } else {
            sibling = parent.rbLeft;
            if (sibling.rbRed) {
              sibling.rbRed = false;
              parent.rbRed = true;
              this.rbRotateRight(parent);
              sibling = parent.rbLeft;
            }
            if (sibling.rbLeft && sibling.rbLeft.rbRed || sibling.rbRight && sibling.rbRight.rbRed) {
              if (!sibling.rbLeft || !sibling.rbLeft.rbRed) {
                sibling.rbRight.rbRed = false;
                sibling.rbRed = true;
                this.rbRotateLeft(sibling);
                sibling = parent.rbLeft;
              }
              sibling.rbRed = parent.rbRed;
              parent.rbRed = sibling.rbLeft.rbRed = false;
              this.rbRotateRight(parent);
              node = this.root;
              break;
            }
          }
          sibling.rbRed = true;
          node = parent;
          parent = parent.rbParent;
        } while (!node.rbRed);
        if (node) {
          node.rbRed = false;
        }
      };
      Voronoi.prototype.RBTree.prototype.rbRotateLeft = function(node) {
        var p = node, q = node.rbRight, parent = p.rbParent;
        if (parent) {
          if (parent.rbLeft === p) {
            parent.rbLeft = q;
          } else {
            parent.rbRight = q;
          }
        } else {
          this.root = q;
        }
        q.rbParent = parent;
        p.rbParent = q;
        p.rbRight = q.rbLeft;
        if (p.rbRight) {
          p.rbRight.rbParent = p;
        }
        q.rbLeft = p;
      };
      Voronoi.prototype.RBTree.prototype.rbRotateRight = function(node) {
        var p = node, q = node.rbLeft, parent = p.rbParent;
        if (parent) {
          if (parent.rbLeft === p) {
            parent.rbLeft = q;
          } else {
            parent.rbRight = q;
          }
        } else {
          this.root = q;
        }
        q.rbParent = parent;
        p.rbParent = q;
        p.rbLeft = q.rbRight;
        if (p.rbLeft) {
          p.rbLeft.rbParent = p;
        }
        q.rbRight = p;
      };
      Voronoi.prototype.RBTree.prototype.getFirst = function(node) {
        while (node.rbLeft) {
          node = node.rbLeft;
        }
        return node;
      };
      Voronoi.prototype.RBTree.prototype.getLast = function(node) {
        while (node.rbRight) {
          node = node.rbRight;
        }
        return node;
      };
      Voronoi.prototype.Diagram = function(site) {
        this.site = site;
      };
      Voronoi.prototype.Cell = function(site) {
        this.site = site;
        this.halfedges = [];
        this.closeMe = false;
      };
      Voronoi.prototype.Cell.prototype.init = function(site) {
        this.site = site;
        this.halfedges = [];
        this.closeMe = false;
        return this;
      };
      Voronoi.prototype.createCell = function(site) {
        var cell = this.cellJunkyard.pop();
        if (cell) {
          return cell.init(site);
        }
        return new this.Cell(site);
      };
      Voronoi.prototype.Cell.prototype.prepareHalfedges = function() {
        var halfedges = this.halfedges, iHalfedge = halfedges.length, edge;
        while (iHalfedge--) {
          edge = halfedges[iHalfedge].edge;
          if (!edge.vb || !edge.va) {
            halfedges.splice(iHalfedge, 1);
          }
        }
        halfedges.sort(function(a, b) {
          return b.angle - a.angle;
        });
        return halfedges.length;
      };
      Voronoi.prototype.Cell.prototype.getNeighborIds = function() {
        var neighbors = [], iHalfedge = this.halfedges.length, edge;
        while (iHalfedge--) {
          edge = this.halfedges[iHalfedge].edge;
          if (edge.lSite !== null && edge.lSite.voronoiId != this.site.voronoiId) {
            neighbors.push(edge.lSite.voronoiId);
          } else if (edge.rSite !== null && edge.rSite.voronoiId != this.site.voronoiId) {
            neighbors.push(edge.rSite.voronoiId);
          }
        }
        return neighbors;
      };
      Voronoi.prototype.Cell.prototype.getBbox = function() {
        var halfedges = this.halfedges, iHalfedge = halfedges.length, xmin = Infinity, ymin = Infinity, xmax = -Infinity, ymax = -Infinity, v, vx, vy;
        while (iHalfedge--) {
          v = halfedges[iHalfedge].getStartpoint();
          vx = v.x;
          vy = v.y;
          if (vx < xmin) {
            xmin = vx;
          }
          if (vy < ymin) {
            ymin = vy;
          }
          if (vx > xmax) {
            xmax = vx;
          }
          if (vy > ymax) {
            ymax = vy;
          }
        }
        return {
          x: xmin,
          y: ymin,
          width: xmax - xmin,
          height: ymax - ymin
        };
      };
      Voronoi.prototype.Cell.prototype.pointIntersection = function(x, y) {
        var halfedges = this.halfedges, iHalfedge = halfedges.length, halfedge, p0, p1, r;
        while (iHalfedge--) {
          halfedge = halfedges[iHalfedge];
          p0 = halfedge.getStartpoint();
          p1 = halfedge.getEndpoint();
          r = (y - p0.y) * (p1.x - p0.x) - (x - p0.x) * (p1.y - p0.y);
          if (!r) {
            return 0;
          }
          if (r > 0) {
            return -1;
          }
        }
        return 1;
      };
      Voronoi.prototype.Vertex = function(x, y) {
        this.x = x;
        this.y = y;
      };
      Voronoi.prototype.Edge = function(lSite, rSite) {
        this.lSite = lSite;
        this.rSite = rSite;
        this.va = this.vb = null;
      };
      Voronoi.prototype.Halfedge = function(edge, lSite, rSite) {
        this.site = lSite;
        this.edge = edge;
        if (rSite) {
          this.angle = Math.atan2(rSite.y - lSite.y, rSite.x - lSite.x);
        } else {
          var va = edge.va, vb = edge.vb;
          this.angle = edge.lSite === lSite ? Math.atan2(vb.x - va.x, va.y - vb.y) : Math.atan2(va.x - vb.x, vb.y - va.y);
        }
      };
      Voronoi.prototype.createHalfedge = function(edge, lSite, rSite) {
        return new this.Halfedge(edge, lSite, rSite);
      };
      Voronoi.prototype.Halfedge.prototype.getStartpoint = function() {
        return this.edge.lSite === this.site ? this.edge.va : this.edge.vb;
      };
      Voronoi.prototype.Halfedge.prototype.getEndpoint = function() {
        return this.edge.lSite === this.site ? this.edge.vb : this.edge.va;
      };
      Voronoi.prototype.createVertex = function(x, y) {
        var v = this.vertexJunkyard.pop();
        if (!v) {
          v = new this.Vertex(x, y);
        } else {
          v.x = x;
          v.y = y;
        }
        this.vertices.push(v);
        return v;
      };
      Voronoi.prototype.createEdge = function(lSite, rSite, va, vb) {
        var edge = this.edgeJunkyard.pop();
        if (!edge) {
          edge = new this.Edge(lSite, rSite);
        } else {
          edge.lSite = lSite;
          edge.rSite = rSite;
          edge.va = edge.vb = null;
        }
        this.edges.push(edge);
        if (va) {
          this.setEdgeStartpoint(edge, lSite, rSite, va);
        }
        if (vb) {
          this.setEdgeEndpoint(edge, lSite, rSite, vb);
        }
        this.cells[lSite.voronoiId].halfedges.push(this.createHalfedge(edge, lSite, rSite));
        this.cells[rSite.voronoiId].halfedges.push(this.createHalfedge(edge, rSite, lSite));
        return edge;
      };
      Voronoi.prototype.createBorderEdge = function(lSite, va, vb) {
        var edge = this.edgeJunkyard.pop();
        if (!edge) {
          edge = new this.Edge(lSite, null);
        } else {
          edge.lSite = lSite;
          edge.rSite = null;
        }
        edge.va = va;
        edge.vb = vb;
        this.edges.push(edge);
        return edge;
      };
      Voronoi.prototype.setEdgeStartpoint = function(edge, lSite, rSite, vertex) {
        if (!edge.va && !edge.vb) {
          edge.va = vertex;
          edge.lSite = lSite;
          edge.rSite = rSite;
        } else if (edge.lSite === rSite) {
          edge.vb = vertex;
        } else {
          edge.va = vertex;
        }
      };
      Voronoi.prototype.setEdgeEndpoint = function(edge, lSite, rSite, vertex) {
        this.setEdgeStartpoint(edge, rSite, lSite, vertex);
      };
      Voronoi.prototype.Beachsection = function() {
      };
      Voronoi.prototype.createBeachsection = function(site) {
        var beachsection = this.beachsectionJunkyard.pop();
        if (!beachsection) {
          beachsection = new this.Beachsection();
        }
        beachsection.site = site;
        return beachsection;
      };
      Voronoi.prototype.leftBreakPoint = function(arc, directrix) {
        var site = arc.site, rfocx = site.x, rfocy = site.y, pby2 = rfocy - directrix;
        if (!pby2) {
          return rfocx;
        }
        var lArc = arc.rbPrevious;
        if (!lArc) {
          return -Infinity;
        }
        site = lArc.site;
        var lfocx = site.x, lfocy = site.y, plby2 = lfocy - directrix;
        if (!plby2) {
          return lfocx;
        }
        var hl = lfocx - rfocx, aby2 = 1 / pby2 - 1 / plby2, b = hl / plby2;
        if (aby2) {
          return (-b + this.sqrt(b * b - 2 * aby2 * (hl * hl / (-2 * plby2) - lfocy + plby2 / 2 + rfocy - pby2 / 2))) / aby2 + rfocx;
        }
        return (rfocx + lfocx) / 2;
      };
      Voronoi.prototype.rightBreakPoint = function(arc, directrix) {
        var rArc = arc.rbNext;
        if (rArc) {
          return this.leftBreakPoint(rArc, directrix);
        }
        var site = arc.site;
        return site.y === directrix ? site.x : Infinity;
      };
      Voronoi.prototype.detachBeachsection = function(beachsection) {
        this.detachCircleEvent(beachsection);
        this.beachline.rbRemoveNode(beachsection);
        this.beachsectionJunkyard.push(beachsection);
      };
      Voronoi.prototype.removeBeachsection = function(beachsection) {
        var circle = beachsection.circleEvent, x = circle.x, y = circle.ycenter, vertex = this.createVertex(x, y), previous = beachsection.rbPrevious, next = beachsection.rbNext, disappearingTransitions = [beachsection], abs_fn = Math.abs;
        this.detachBeachsection(beachsection);
        var lArc = previous;
        while (lArc.circleEvent && abs_fn(x - lArc.circleEvent.x) < 1e-9 && abs_fn(y - lArc.circleEvent.ycenter) < 1e-9) {
          previous = lArc.rbPrevious;
          disappearingTransitions.unshift(lArc);
          this.detachBeachsection(lArc);
          lArc = previous;
        }
        disappearingTransitions.unshift(lArc);
        this.detachCircleEvent(lArc);
        var rArc = next;
        while (rArc.circleEvent && abs_fn(x - rArc.circleEvent.x) < 1e-9 && abs_fn(y - rArc.circleEvent.ycenter) < 1e-9) {
          next = rArc.rbNext;
          disappearingTransitions.push(rArc);
          this.detachBeachsection(rArc);
          rArc = next;
        }
        disappearingTransitions.push(rArc);
        this.detachCircleEvent(rArc);
        var nArcs = disappearingTransitions.length, iArc;
        for (iArc = 1; iArc < nArcs; iArc++) {
          rArc = disappearingTransitions[iArc];
          lArc = disappearingTransitions[iArc - 1];
          this.setEdgeStartpoint(rArc.edge, lArc.site, rArc.site, vertex);
        }
        lArc = disappearingTransitions[0];
        rArc = disappearingTransitions[nArcs - 1];
        rArc.edge = this.createEdge(lArc.site, rArc.site, void 0, vertex);
        this.attachCircleEvent(lArc);
        this.attachCircleEvent(rArc);
      };
      Voronoi.prototype.addBeachsection = function(site) {
        var x = site.x, directrix = site.y;
        var lArc, rArc, dxl, dxr, node = this.beachline.root;
        while (node) {
          dxl = this.leftBreakPoint(node, directrix) - x;
          if (dxl > 1e-9) {
            node = node.rbLeft;
          } else {
            dxr = x - this.rightBreakPoint(node, directrix);
            if (dxr > 1e-9) {
              if (!node.rbRight) {
                lArc = node;
                break;
              }
              node = node.rbRight;
            } else {
              if (dxl > -1e-9) {
                lArc = node.rbPrevious;
                rArc = node;
              } else if (dxr > -1e-9) {
                lArc = node;
                rArc = node.rbNext;
              } else {
                lArc = rArc = node;
              }
              break;
            }
          }
        }
        var newArc = this.createBeachsection(site);
        this.beachline.rbInsertSuccessor(lArc, newArc);
        if (!lArc && !rArc) {
          return;
        }
        if (lArc === rArc) {
          this.detachCircleEvent(lArc);
          rArc = this.createBeachsection(lArc.site);
          this.beachline.rbInsertSuccessor(newArc, rArc);
          newArc.edge = rArc.edge = this.createEdge(lArc.site, newArc.site);
          this.attachCircleEvent(lArc);
          this.attachCircleEvent(rArc);
          return;
        }
        if (lArc && !rArc) {
          newArc.edge = this.createEdge(lArc.site, newArc.site);
          return;
        }
        if (lArc !== rArc) {
          this.detachCircleEvent(lArc);
          this.detachCircleEvent(rArc);
          var lSite = lArc.site, ax = lSite.x, ay = lSite.y, bx = site.x - ax, by = site.y - ay, rSite = rArc.site, cx = rSite.x - ax, cy = rSite.y - ay, d = 2 * (bx * cy - by * cx), hb = bx * bx + by * by, hc = cx * cx + cy * cy, vertex = this.createVertex((cy * hb - by * hc) / d + ax, (bx * hc - cx * hb) / d + ay);
          this.setEdgeStartpoint(rArc.edge, lSite, rSite, vertex);
          newArc.edge = this.createEdge(lSite, site, void 0, vertex);
          rArc.edge = this.createEdge(site, rSite, void 0, vertex);
          this.attachCircleEvent(lArc);
          this.attachCircleEvent(rArc);
          return;
        }
      };
      Voronoi.prototype.CircleEvent = function() {
        this.arc = null;
        this.rbLeft = null;
        this.rbNext = null;
        this.rbParent = null;
        this.rbPrevious = null;
        this.rbRed = false;
        this.rbRight = null;
        this.site = null;
        this.x = this.y = this.ycenter = 0;
      };
      Voronoi.prototype.attachCircleEvent = function(arc) {
        var lArc = arc.rbPrevious, rArc = arc.rbNext;
        if (!lArc || !rArc) {
          return;
        }
        var lSite = lArc.site, cSite = arc.site, rSite = rArc.site;
        if (lSite === rSite) {
          return;
        }
        var bx = cSite.x, by = cSite.y, ax = lSite.x - bx, ay = lSite.y - by, cx = rSite.x - bx, cy = rSite.y - by;
        var d = 2 * (ax * cy - ay * cx);
        if (d >= -2e-12) {
          return;
        }
        var ha = ax * ax + ay * ay, hc = cx * cx + cy * cy, x = (cy * ha - ay * hc) / d, y = (ax * hc - cx * ha) / d, ycenter = y + by;
        var circleEvent = this.circleEventJunkyard.pop();
        if (!circleEvent) {
          circleEvent = new this.CircleEvent();
        }
        circleEvent.arc = arc;
        circleEvent.site = cSite;
        circleEvent.x = x + bx;
        circleEvent.y = ycenter + this.sqrt(x * x + y * y);
        circleEvent.ycenter = ycenter;
        arc.circleEvent = circleEvent;
        var predecessor = null, node = this.circleEvents.root;
        while (node) {
          if (circleEvent.y < node.y || circleEvent.y === node.y && circleEvent.x <= node.x) {
            if (node.rbLeft) {
              node = node.rbLeft;
            } else {
              predecessor = node.rbPrevious;
              break;
            }
          } else {
            if (node.rbRight) {
              node = node.rbRight;
            } else {
              predecessor = node;
              break;
            }
          }
        }
        this.circleEvents.rbInsertSuccessor(predecessor, circleEvent);
        if (!predecessor) {
          this.firstCircleEvent = circleEvent;
        }
      };
      Voronoi.prototype.detachCircleEvent = function(arc) {
        var circleEvent = arc.circleEvent;
        if (circleEvent) {
          if (!circleEvent.rbPrevious) {
            this.firstCircleEvent = circleEvent.rbNext;
          }
          this.circleEvents.rbRemoveNode(circleEvent);
          this.circleEventJunkyard.push(circleEvent);
          arc.circleEvent = null;
        }
      };
      Voronoi.prototype.connectEdge = function(edge, bbox) {
        var vb = edge.vb;
        if (!!vb) {
          return true;
        }
        var va = edge.va, xl = bbox.xl, xr = bbox.xr, yt = bbox.yt, yb = bbox.yb, lSite = edge.lSite, rSite = edge.rSite, lx = lSite.x, ly = lSite.y, rx = rSite.x, ry = rSite.y, fx = (lx + rx) / 2, fy = (ly + ry) / 2, fm, fb;
        this.cells[lSite.voronoiId].closeMe = true;
        this.cells[rSite.voronoiId].closeMe = true;
        if (ry !== ly) {
          fm = (lx - rx) / (ry - ly);
          fb = fy - fm * fx;
        }
        if (fm === void 0) {
          if (fx < xl || fx >= xr) {
            return false;
          }
          if (lx > rx) {
            if (!va || va.y < yt) {
              va = this.createVertex(fx, yt);
            } else if (va.y >= yb) {
              return false;
            }
            vb = this.createVertex(fx, yb);
          } else {
            if (!va || va.y > yb) {
              va = this.createVertex(fx, yb);
            } else if (va.y < yt) {
              return false;
            }
            vb = this.createVertex(fx, yt);
          }
        } else if (fm < -1 || fm > 1) {
          if (lx > rx) {
            if (!va || va.y < yt) {
              va = this.createVertex((yt - fb) / fm, yt);
            } else if (va.y >= yb) {
              return false;
            }
            vb = this.createVertex((yb - fb) / fm, yb);
          } else {
            if (!va || va.y > yb) {
              va = this.createVertex((yb - fb) / fm, yb);
            } else if (va.y < yt) {
              return false;
            }
            vb = this.createVertex((yt - fb) / fm, yt);
          }
        } else {
          if (ly < ry) {
            if (!va || va.x < xl) {
              va = this.createVertex(xl, fm * xl + fb);
            } else if (va.x >= xr) {
              return false;
            }
            vb = this.createVertex(xr, fm * xr + fb);
          } else {
            if (!va || va.x > xr) {
              va = this.createVertex(xr, fm * xr + fb);
            } else if (va.x < xl) {
              return false;
            }
            vb = this.createVertex(xl, fm * xl + fb);
          }
        }
        edge.va = va;
        edge.vb = vb;
        return true;
      };
      Voronoi.prototype.clipEdge = function(edge, bbox) {
        var ax = edge.va.x, ay = edge.va.y, bx = edge.vb.x, by = edge.vb.y, t0 = 0, t1 = 1, dx = bx - ax, dy = by - ay;
        var q = ax - bbox.xl;
        if (dx === 0 && q < 0) {
          return false;
        }
        var r = -q / dx;
        if (dx < 0) {
          if (r < t0) {
            return false;
          }
          if (r < t1) {
            t1 = r;
          }
        } else if (dx > 0) {
          if (r > t1) {
            return false;
          }
          if (r > t0) {
            t0 = r;
          }
        }
        q = bbox.xr - ax;
        if (dx === 0 && q < 0) {
          return false;
        }
        r = q / dx;
        if (dx < 0) {
          if (r > t1) {
            return false;
          }
          if (r > t0) {
            t0 = r;
          }
        } else if (dx > 0) {
          if (r < t0) {
            return false;
          }
          if (r < t1) {
            t1 = r;
          }
        }
        q = ay - bbox.yt;
        if (dy === 0 && q < 0) {
          return false;
        }
        r = -q / dy;
        if (dy < 0) {
          if (r < t0) {
            return false;
          }
          if (r < t1) {
            t1 = r;
          }
        } else if (dy > 0) {
          if (r > t1) {
            return false;
          }
          if (r > t0) {
            t0 = r;
          }
        }
        q = bbox.yb - ay;
        if (dy === 0 && q < 0) {
          return false;
        }
        r = q / dy;
        if (dy < 0) {
          if (r > t1) {
            return false;
          }
          if (r > t0) {
            t0 = r;
          }
        } else if (dy > 0) {
          if (r < t0) {
            return false;
          }
          if (r < t1) {
            t1 = r;
          }
        }
        if (t0 > 0) {
          edge.va = this.createVertex(ax + t0 * dx, ay + t0 * dy);
        }
        if (t1 < 1) {
          edge.vb = this.createVertex(ax + t1 * dx, ay + t1 * dy);
        }
        if (t0 > 0 || t1 < 1) {
          this.cells[edge.lSite.voronoiId].closeMe = true;
          this.cells[edge.rSite.voronoiId].closeMe = true;
        }
        return true;
      };
      Voronoi.prototype.clipEdges = function(bbox) {
        var edges = this.edges, iEdge = edges.length, edge, abs_fn = Math.abs;
        while (iEdge--) {
          edge = edges[iEdge];
          if (!this.connectEdge(edge, bbox) || !this.clipEdge(edge, bbox) || abs_fn(edge.va.x - edge.vb.x) < 1e-9 && abs_fn(edge.va.y - edge.vb.y) < 1e-9) {
            edge.va = edge.vb = null;
            edges.splice(iEdge, 1);
          }
        }
      };
      Voronoi.prototype.closeCells = function(bbox) {
        var xl = bbox.xl, xr = bbox.xr, yt = bbox.yt, yb = bbox.yb, cells = this.cells, iCell = cells.length, cell, iLeft, halfedges, nHalfedges, edge, va, vb, vz, lastBorderSegment, abs_fn = Math.abs;
        while (iCell--) {
          cell = cells[iCell];
          if (!cell.prepareHalfedges()) {
            continue;
          }
          if (!cell.closeMe) {
            continue;
          }
          halfedges = cell.halfedges;
          nHalfedges = halfedges.length;
          iLeft = 0;
          while (iLeft < nHalfedges) {
            va = halfedges[iLeft].getEndpoint();
            vz = halfedges[(iLeft + 1) % nHalfedges].getStartpoint();
            if (abs_fn(va.x - vz.x) >= 1e-9 || abs_fn(va.y - vz.y) >= 1e-9) {
              switch (true) {
                // walk downward along left side
                case (this.equalWithEpsilon(va.x, xl) && this.lessThanWithEpsilon(va.y, yb)):
                  lastBorderSegment = this.equalWithEpsilon(vz.x, xl);
                  vb = this.createVertex(xl, lastBorderSegment ? vz.y : yb);
                  edge = this.createBorderEdge(cell.site, va, vb);
                  iLeft++;
                  halfedges.splice(iLeft, 0, this.createHalfedge(edge, cell.site, null));
                  nHalfedges++;
                  if (lastBorderSegment) {
                    break;
                  }
                  va = vb;
                // fall through
                // walk rightward along bottom side
                case (this.equalWithEpsilon(va.y, yb) && this.lessThanWithEpsilon(va.x, xr)):
                  lastBorderSegment = this.equalWithEpsilon(vz.y, yb);
                  vb = this.createVertex(lastBorderSegment ? vz.x : xr, yb);
                  edge = this.createBorderEdge(cell.site, va, vb);
                  iLeft++;
                  halfedges.splice(iLeft, 0, this.createHalfedge(edge, cell.site, null));
                  nHalfedges++;
                  if (lastBorderSegment) {
                    break;
                  }
                  va = vb;
                // fall through
                // walk upward along right side
                case (this.equalWithEpsilon(va.x, xr) && this.greaterThanWithEpsilon(va.y, yt)):
                  lastBorderSegment = this.equalWithEpsilon(vz.x, xr);
                  vb = this.createVertex(xr, lastBorderSegment ? vz.y : yt);
                  edge = this.createBorderEdge(cell.site, va, vb);
                  iLeft++;
                  halfedges.splice(iLeft, 0, this.createHalfedge(edge, cell.site, null));
                  nHalfedges++;
                  if (lastBorderSegment) {
                    break;
                  }
                  va = vb;
                // fall through
                // walk leftward along top side
                case (this.equalWithEpsilon(va.y, yt) && this.greaterThanWithEpsilon(va.x, xl)):
                  lastBorderSegment = this.equalWithEpsilon(vz.y, yt);
                  vb = this.createVertex(lastBorderSegment ? vz.x : xl, yt);
                  edge = this.createBorderEdge(cell.site, va, vb);
                  iLeft++;
                  halfedges.splice(iLeft, 0, this.createHalfedge(edge, cell.site, null));
                  nHalfedges++;
                  if (lastBorderSegment) {
                    break;
                  }
                  va = vb;
                  lastBorderSegment = this.equalWithEpsilon(vz.x, xl);
                  vb = this.createVertex(xl, lastBorderSegment ? vz.y : yb);
                  edge = this.createBorderEdge(cell.site, va, vb);
                  iLeft++;
                  halfedges.splice(iLeft, 0, this.createHalfedge(edge, cell.site, null));
                  nHalfedges++;
                  if (lastBorderSegment) {
                    break;
                  }
                  va = vb;
                  lastBorderSegment = this.equalWithEpsilon(vz.y, yb);
                  vb = this.createVertex(lastBorderSegment ? vz.x : xr, yb);
                  edge = this.createBorderEdge(cell.site, va, vb);
                  iLeft++;
                  halfedges.splice(iLeft, 0, this.createHalfedge(edge, cell.site, null));
                  nHalfedges++;
                  if (lastBorderSegment) {
                    break;
                  }
                  va = vb;
                  lastBorderSegment = this.equalWithEpsilon(vz.x, xr);
                  vb = this.createVertex(xr, lastBorderSegment ? vz.y : yt);
                  edge = this.createBorderEdge(cell.site, va, vb);
                  iLeft++;
                  halfedges.splice(iLeft, 0, this.createHalfedge(edge, cell.site, null));
                  nHalfedges++;
                  if (lastBorderSegment) {
                    break;
                  }
                // fall through
                default:
                  throw "Voronoi.closeCells() > this makes no sense!";
              }
            }
            iLeft++;
          }
          cell.closeMe = false;
        }
      };
      Voronoi.prototype.quantizeSites = function(sites) {
        var \u03B5 = this.\u03B5, n = sites.length, site;
        while (n--) {
          site = sites[n];
          site.x = Math.floor(site.x / \u03B5) * \u03B5;
          site.y = Math.floor(site.y / \u03B5) * \u03B5;
        }
      };
      Voronoi.prototype.recycle = function(diagram) {
        if (diagram) {
          if (diagram instanceof this.Diagram) {
            this.toRecycle = diagram;
          } else {
            throw "Voronoi.recycleDiagram() > Need a Diagram object.";
          }
        }
      };
      Voronoi.prototype.compute = function(sites, bbox) {
        var startTime = /* @__PURE__ */ new Date();
        this.reset();
        if (this.toRecycle) {
          this.vertexJunkyard = this.vertexJunkyard.concat(this.toRecycle.vertices);
          this.edgeJunkyard = this.edgeJunkyard.concat(this.toRecycle.edges);
          this.cellJunkyard = this.cellJunkyard.concat(this.toRecycle.cells);
          this.toRecycle = null;
        }
        var siteEvents = sites.slice(0);
        siteEvents.sort(function(a, b) {
          var r = b.y - a.y;
          if (r) {
            return r;
          }
          return b.x - a.x;
        });
        var site = siteEvents.pop(), siteid = 0, xsitex, xsitey, cells = this.cells, circle;
        for (; ; ) {
          circle = this.firstCircleEvent;
          if (site && (!circle || site.y < circle.y || site.y === circle.y && site.x < circle.x)) {
            if (site.x !== xsitex || site.y !== xsitey) {
              cells[siteid] = this.createCell(site);
              site.voronoiId = siteid++;
              this.addBeachsection(site);
              xsitey = site.y;
              xsitex = site.x;
            }
            site = siteEvents.pop();
          } else if (circle) {
            this.removeBeachsection(circle.arc);
          } else {
            break;
          }
        }
        this.clipEdges(bbox);
        this.closeCells(bbox);
        var stopTime = /* @__PURE__ */ new Date();
        var diagram = new this.Diagram();
        diagram.cells = this.cells;
        diagram.edges = this.edges;
        diagram.vertices = this.vertices;
        diagram.execTime = stopTime.getTime() - startTime.getTime();
        this.reset();
        return diagram;
      };
      if (typeof module !== "undefined") module.exports = Voronoi;
    }
  });

  // src/Parametrics.js
  var require_Parametrics = __commonJS({
    "src/Parametrics.js"(exports, module) {
      "use strict";
      var voronoi = require_rhill_voronoi_core();
      var Parametrics = class {
        /**
         * Returns the voronoi data (check https://github.com/gorhill/Javascript-Voronoi#usage) for details
         * @param {object} origin - {x,y} point representing the top right corner of the  
         * @param {number} w width of the voronoi area
         * @param {number} h height of the voronoi area
         * @param {number} sites list of {x,y} points representing the initial cell centers
         */
        static voronoi(origin, w, h, sites) {
          let bbox = { xl: origin.x, xr: origin.x + w, yt: origin.y, yb: origin.y + h };
          return new voronoi().compute(sites, bbox);
        }
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
          for (let t = 0; t < upperLimit; t += stepSize) {
            let e = Math.exp(Math.cos(t)) - 2 * Math.cos(lambda * t) - Math.pow(Math.sin(t / 12), 5);
            let x = Math.sin(t) * e;
            let y = Math.cos(t) * e;
            points.push(createVector(x * scale + origin.x, y * scale + origin.y));
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
          for (let th = 0; th < upperLimit; th += stepSize) {
            let x = (R - r) * Math.cos(th) + r * Math.cos((R - r) / r * th);
            let y = (R - r) * Math.sin(th) - r * Math.sin((R - r) / r * th);
            points.push(createVector(x * scale + origin.x, y * scale + origin.y));
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
          for (let th = 0; th < upperLimit; th += stepSize) {
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
          function rosslerPoint(x2, y2, z2, a2, b2, c2) {
            let dx = -(y2 + z2);
            let dy = x2 + a2 * y2;
            let dz = b2 + z2 * (x2 - c2);
            return {
              x: dx,
              y: dy,
              z: dz
            };
          }
          ;
          let center = {
            x: origin.x,
            y: origin.y
          };
          let x = 0.1, y = 0.1, z = 0.1;
          let tmpx = 0, tmpy = 0, tmpz = 0;
          let points = [];
          for (let i = 0; i < loops; i++) {
            let dt = rosslerPoint(x, y, z, a, b, c);
            tmpx = x + h * dt.x;
            tmpy = y + h * dt.y;
            tmpz = z + h * dt.z;
            let point = createVector(tmpx * scale + center.x, tmpy * scale + center.y, tmpz);
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
          function lorentzPoint(x2, y2, z2, a2, b2, c2) {
            let dx = a2 * (y2 - x2);
            let dy = x2 * (b2 - z2) - y2;
            let dz = x2 * y2 - c2 * z2;
            return {
              x: dx,
              y: dy,
              z: dz
            };
          }
          ;
          let tmpx = 0, tmpy = 0, tmpz = 0;
          let points = [];
          for (let i = 0; i < loops; i++) {
            let dt = lorentzPoint(x, y, z, a, b, c);
            tmpx = x + h * dt.x;
            tmpy = y + h * dt.y;
            tmpz = z + h * dt.z;
            points.push(createVector(tmpx * scale + origin.x, tmpy * scale + origin.y, tmpz));
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
          let a = [];
          let points = [];
          let x = 0.1, y = 0.1;
          let r = 360 % entryString.length;
          for (let i = 0; i < entryString.length; i++) {
            a[i] = (entryString.charCodeAt(i) - 65 - 12) / 10;
          }
          points.push({
            x: origin.x + 50 * Math.cos(r),
            y: origin.y + 58 * Math.sin(r),
            r: 0
          });
          for (let i = 0; i < loops; i++) {
            let nx = a[0] + a[1] * x + a[2] * x * x + a[3] * x * y + a[4] * y + a[5] * y * y;
            let ny = a[6] + a[7] * x + a[8] * x * x + a[9] * x * y + a[10] * y + a[11] * y * y;
            let xvalue = origin.x * nx + origin.x;
            let yvalue = origin.y * ny + origin.y;
            points.push(createVector(Math.abs(xvalue), Math.abs(yvalue)));
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
          let points = [];
          let xt = 1, yt = 1;
          for (let i = 0; i < loops; i++) {
            let nextx = Math.sin(a * yt) - Math.cos(b * xt);
            let nexty = Math.sin(c * xt) - Math.cos(d * yt);
            points.push(createVector(scale * xt + origin.x + scale, scale * yt + origin.y - scale));
            xt = nextx;
            yt = nexty;
          }
          return points;
        }
      };
      module.exports = Parametrics;
    }
  });

  // src/Grammar.js
  var require_Grammar = __commonJS({
    "src/Grammar.js"(exports, module) {
      "use strict";
      var Grammar = class {
        constructor() {
          this.branches = {};
          this.fns = [];
        }
        add(weight, branchFun) {
          this.branches[branchFun.name] = { p: weight, fun: branchFun };
          return this;
        }
        run(startFun, setupFun, it = 10, debug = false) {
          this.stop = it;
          this.it = 0;
          this.debug = debug;
          if (setupFun)
            setupFun();
          let runStart = void 0;
          if (startFun instanceof Function) {
            runStart = startFun;
          } else {
            runStart = this.branches[startFun];
            if (!runStart)
              throw "Grammar error: " + runStart + " method not found. Did you add() it to the grammar?";
            runStart = runStart.fun;
          }
          if (this.debug)
            console.log("Starting grammar with " + runStart.name);
          this.fns.push(runStart);
          while (this.fns.length > 0) {
            let next = this.fns.shift();
            next();
          }
        }
        take(...functionNames) {
          if (this.it < this.stop) {
            let funName = random(functionNames);
            if (typeof funName === "function") {
              this.it++;
              this.fns.push(funName);
            } else {
              if (funName in this.branches) {
                if (this.debug)
                  console.log("Branching to " + this.branches[funName].fun.name);
                this.it++;
                this.fns.push(this.branches[funName].fun);
              } else
                throw "Grammar error: " + funName + " method not found. Did you add() it to the grammar?";
            }
          } else
            console.log("Stopped after " + this.stop + " iterations");
        }
      };
      module.exports = Grammar;
    }
  });

  // src/particles/Point.js
  var require_Point = __commonJS({
    "src/particles/Point.js"(exports, module) {
      "use strict";
      var Point = class _Point {
        // Instantiates a new Point given x and y
        constructor(x, y) {
          this.x = x || 0;
          this.y = y || 0;
        }
        // Returns the magnitude of a point considering it a vector starting from (0,0)
        getMagnitude() {
          return Math.sqrt(this.x * this.x + this.y * this.y);
        }
        unit() {
          var mag = this.getMagnitude();
          return new _Point(this.x / mag, this.y / mag);
        }
        pow() {
          return Math.pow(this.x, 2) + Math.pow(this.y, 2);
        }
        // Multiplies the point
        multiply(scaleFactor) {
          if (typeof scaleFactor === "object") {
            this.x *= scaleFactor.x;
            this.y *= scaleFactor.y;
          } else {
            this.x *= scaleFactor;
            this.y *= scaleFactor;
          }
          return this;
        }
        // Translates the point
        add(increased) {
          if (typeof increased === "object") {
            this.x += increased.x;
            this.y += increased.y;
          } else {
            this.x += increased;
            this.y += increased;
          }
          return this;
        }
        limit(max) {
          if (this.getMagnitude() > max) {
            var unit = this.unit();
            return new _Point(unit.x * max, unit.y * max);
          }
          return this.copy();
        }
        dec(decrease) {
          if (typeof decrease === "object") {
            this.x -= decrease.x;
            this.y -= decrease.y;
          } else {
            this.x -= decrease;
            this.y -= decrease;
          }
          return this;
        }
        div(factor) {
          return new _Point(this.x / factor, this.y / factor);
        }
        // Returns a new Point
        vectorTo(vector) {
          return new _Point(vector.x - this.x, vector.y - this.y);
        }
        // Given a point, checks if it's within the bounds of this vector
        withinBounds(point, size) {
          var radius = ~~(size / 2) + 1;
          return this.x >= point.x - radius && this.x <= point.x + radius && this.y >= point.y - radius && this.y <= point.y + radius;
        }
        // Calculates the angle of this point relative to (0,0)
        getAngle() {
          var ratio = 0;
          var offset = 0;
          if (this.x > 0) {
            if (this.y > 0) {
              offset = 0;
              ratio = this.y / this.x;
            } else {
              offset = 3 * Math.PI / 2;
              ratio = this.x / this.y;
            }
          } else {
            if (this.y > 0) {
              offset = Math.PI / 2;
              ratio = this.x / this.y;
            } else {
              offset = Math.PI;
              ratio = this.y / this.x;
            }
          }
          var angle = Math.atan(Math.abs(ratio)) + offset;
          return angle;
        }
        // Returns the angle degrees of this point relative to (0,0)
        getAngleDegrees() {
          return this.getAngle() * 180 / Math.PI;
        }
        // Returns a jittered point around the current one
        jitter(jitterAmount, Rnd) {
          randFunc = Rnd ? Rnd.random : Math.random;
          return new _Point(
            this.x + this.x * jitterAmount * randFunc(),
            this.y + this.y * jitterAmount * randFunc()
          );
        }
        // Copies a Point
        copy() {
          return new _Point(this.x, this.y);
        }
        static euc2d(source, target) {
          let xdist = Math.pow(source.x - target.x);
          let ydist = Math.pow(source.y - target.y);
          return Math.sqrt(xdist + ydist);
        }
        // Returns a new point given the angle from (0,0) and a certain magnitude
        static fromAngle(angle, magnitude) {
          var p = new _Point(magnitude * Math.cos(angle), magnitude * Math.sin(angle));
          return p;
        }
      };
      module.exports.Point = Point;
    }
  });

  // src/particles/Field.js
  var require_Field = __commonJS({
    "src/particles/Field.js"(exports, module) {
      "use strict";
      var Point = require_Point().Point;
      var Field = class {
        // Creates a new Field given a point and a mass. Use a negative mass for attractors and positive for repulsive behaviour.
        constructor(point, mass, decay) {
          this.position = point || new Point(0, 0);
          this.mass = mass || 100;
          this.decayVal = decay || 0;
        }
        decay() {
          this.mass = this.mass - this.decayVal;
        }
      };
      module.exports.Field = Field;
    }
  });

  // src/particles/Particle.js
  var require_Particle = __commonJS({
    "src/particles/Particle.js"(exports, module) {
      "use strict";
      var Point = require_Point().Point;
      var Particle = class {
        // Creates a new Particle given a x,y point and a velocity
        constructor(point, velocity) {
          this.position = point || new Point(0, 0);
          this.velocity = velocity || new Point(0, 0);
          this.initialVelocity = this.velocity.copy();
          this.acceleration = new Point(0, 0);
          this.ttl = -1;
          this.lived = 0;
          this.traceRecord = [];
          this.traceRecord.push(this.position.copy());
        }
        // Updates the acceleration of this particle taking into account the fields surrounding the particle
        submitToFields(fields) {
          var that = this;
          var totalAccelerationX = 0;
          var totalAccelerationY = 0;
          fields.forEach(function(field) {
            var vectorX = field.position.x - that.position.x;
            var vectorY = field.position.y - that.position.y;
            var distance = Math.pow(vectorX * vectorX + vectorY * vectorY, 0.5);
            var force = field.mass / Math.pow(distance, 2);
            totalAccelerationX += vectorX * force;
            totalAccelerationY += vectorY * force;
          });
          this.acceleration = new Point(totalAccelerationX, totalAccelerationY);
        }
        // Moves this particle according to its position, its velocity and its acceleration
        move() {
          this.velocity.x += this.acceleration.x;
          this.velocity.y += this.acceleration.y;
          this.position.x += this.velocity.x;
          this.position.y += this.velocity.y;
          this.traceRecord.push(this.position.copy());
        }
        // Returns the position of this particle
        getPos() {
          return this.position;
        }
        // Returns the trace history of the particle
        getTrace() {
          return this.traceRecord;
        }
      };
      module.exports.Particle = Particle;
    }
  });

  // src/particles/Random.js
  var require_Random = __commonJS({
    "src/particles/Random.js"(exports, module) {
      "use strict";
      var E = Math.E;
      var PI = Math.PI;
      var PI_2 = PI / 2;
      var Random = class {
        constructor(seed) {
          if (typeof seed === "string") {
            var i = seed.length;
            this.seed = 0;
            while (i--) {
              this.seed += seed.charCodeAt(i);
            }
          } else
            this.seed = seed !== void 0 ? seed : Math.random();
        }
        setSeed(seed) {
          if (seed)
            this.seed = seed;
        }
        random(lower, upper) {
          var x = Math.sin(this.seed++) * 1e4;
          if (upper === void 0) {
            if (lower === void 0) {
              return x - Math.floor(x);
            } else {
              return (x - Math.floor(x)) * lower;
            }
          } else {
            return lower + (x - Math.floor(x)) * (upper - lower);
          }
        }
        rint(lower, upper) {
          return Math.round(this.random(lower, upper));
        }
        arcsine(min, max) {
          var q = Math.sin(PI_2 * this.uniform(0, 1));
          return min + (max - min) * q * q;
        }
        beta(v, w, min, max) {
          if (v < w) {
            return max - (max - min) * this.beta(w, v, 0, 1);
          }
          var y1 = this.gamma(0, 1, v), y2 = this.gamma(0, 1, w);
          return min + (max - min) * y1 / (y1 + y2);
        }
        cauchy(a, b) {
          return a + b * Math.tan(PI * this.uniform(-0.5, 0.5));
        }
        chiSquare(df) {
          return this.gamma(0, 2, 0.5 * df);
        }
        cosine(min, max) {
          var a = 0.5 * (min + max), b = (max - min) / PI;
          return a + b * Math.asin(this.uniform(-1, 1));
        }
        doubleLog(min, max) {
          var a = 0.5 * (min + max), b = 0.5 * (max - min);
          if (this.bernoulli(0.5) === 0) {
            b = -b;
          }
          return a + b * this.uniform(0, 1) * this.uniform(0, 1);
        }
        erlang(b, c) {
          var prod = 1;
          var i = 1;
          for (i = 1; i < c; i++) {
            prod *= this.uniform(0, 1);
          }
          return -b * Math.log(prod);
        }
        exponential(a, b) {
          return a - b * Math.log(this.uniform(0, 1));
        }
        extremeValue(a, b) {
          return a + b * Math.log(-Math.log(this.uniform(0, 1)));
        }
        fRatio(v, w) {
          return this.chiSquare(v) / v / (this.chiSquare(w) / w);
        }
        gamma(a, b, c) {
          var A = 1 / Math.sqrt(2 * c - 1), B = c - Math.log(4), Q = c + 1 / A, T = 4.5, D = 1 + Math.log(T), C = 1 + c / E;
          if (c < 1) {
            while (true) {
              var p = C * this.uniform(0, 1);
              if (p > 1) {
                var y = -Math.log((C - p) / c);
                if (this.uniform(0, 1) <= Math.pow(y, c - 1)) {
                  return a + b * y;
                }
              } else {
                var y = Math.pow(p, 1 / c);
                if (this.uniform(0, 1) <= Math.exp(-y)) {
                  return a + b * y;
                }
              }
            }
          } else if (c == 1) {
            return this.exponential(a, b);
          } else {
            while (true) {
              var p1 = this.uniform(0, 1), p2 = this.uniform(0, 1), v = A * Math.log(p1 / (1 - p1)), y = c * Math.exp(v), z = p1 * p1 * p2, w = B + Q * v - y;
              if (w + D - T * z > 0 || w >= Math.log(z)) {
                return a + b * y;
              }
            }
          }
        }
        laplace(a, b) {
          if (this.bernoulli(0.5) == 1) {
            return a + b * Math.log(this.uniform(0, 1));
          } else {
            return a - b * Math.log(this.uniform(0, 1));
          }
        }
        logarithmic(min, max) {
          var a = min, b = max - min;
          return a + b * this.uniform(0, 1) * this.uniform(0, 1);
        }
        logistic(a, b) {
          return a - b * Math.log(1 / this.uniform(0, 1) - 1);
        }
        lognormal(a, mu, sigma) {
          return a + Math.exp(this.normal(mu, sigma));
        }
        normal(mu, sigma) {
          var p, p1, p2;
          do {
            p1 = this.uniform(-1, 1);
            p2 = this.uniform(-1, 1);
            p = p1 * p1 + p2 * p2;
          } while (p >= 1);
          return mu + sigma * p1 * Math.sqrt(-2 * Math.log(p) / p);
        }
        parabolic(min, max) {
          var parabola = function(x, min2, max2) {
            if (x < min2 || x > max2) {
              return 0;
            }
            var a2 = 0.5 * (min2 + max2), b = 0.5 * (max2 - min2), yMax2 = 3 / (4 * b);
            return yMax2 * (1 - (x - a2) * (x - a2) / (b * b));
          };
          var a = 0.5 * (min + max), yMax = parabola(a, min + max);
          return this.userSpecified(parabola, min, max, 0, yMax);
        }
        pareto(c) {
          return Math.pow(this.uniform(0, 1), -1 / c);
        }
        pearson5(b, c) {
          return 1 / this.gamma(0, 1 / b, c);
        }
        pearson6(b, v, w) {
          return this.gamma(0, b, v) / this.gamma(0, b, w);
        }
        power(c) {
          return Math.pow(this.uniform(0, 1), 1 / c);
        }
        rayleigh(a, b) {
          return a + b * Math.sqrt(-Math.log(this.uniform(0, 1)));
        }
        studentT(df) {
          return this.normal(0, 1) / Math.sqrt(this.chiSquare(df) / df);
        }
        triangular(min, max, c) {
          var p = this.uniform(0, 1), q = 1 - p;
          if (p <= (c - min) / (max - min)) {
            return min + Math.sqrt((max - min) * (c - min) * p);
          } else {
            return max - Math.sqrt((max - min) * (max - c) * q);
          }
        }
        uniform(min, max) {
          var init = this.seed !== void 0 ? this.random() : Math.random();
          return min + (max - min) * init;
        }
        userSpecified(usf, xMin, xMax, yMin, yMax) {
          var x, y, areaMax = (xMax - xMin) * (yMax - yMin);
          do {
            x = this.uniform(0, areaMax) / (yMax - yMin) + xMin;
            y = this.uniform(yMin, yMax);
          } while (y > usf(x, xMin, xMax));
          return x;
        }
        weibull(a, b, c) {
          return a + b * Math.pow(-Math.log(this.uniform(0, 1)), 1 / c);
        }
        bernoulli(p) {
          return this.uniform(0, 1) < p ? 0 : 1;
        }
        binomial(n, p) {
          var sum = 0;
          for (var i = 0; i < n; i++) {
            sum += this.bernoulli(p);
          }
          return sum;
        }
        geometric(p) {
          return Math.floor(Math.log(this.uniform(0, 1)) / Math.log(1 - p));
        }
        hypergeometric(n, N, K) {
          var count = 0;
          for (var i = 0; i < n; i++, N--) {
            var p = K / N;
            if (this.bernoulli(p)) {
              count++;
              K--;
            }
          }
          return count;
        }
        negativeBinomial(s, p) {
          var sum = 0;
          for (var i = 0; i < s; i++) {
            sum += this.geometric(p);
          }
          return sum;
        }
        pascal(s, p) {
          return this.negativeBinomial(s, p) + s;
        }
        poisson(mu) {
          var b = 1;
          for (var i = 0; b >= Math.exp(-mu); i++) {
            b *= this.uniform(0, 1);
          }
          return i - 1;
        }
        uniformDiscrete(i, j) {
          return i + Math.floor((j - i + 1) * this.uniform(0, 1));
        }
      };
      module.exports.Random = Random;
    }
  });

  // src/particles/Emitter.js
  var require_Emitter = __commonJS({
    "src/particles/Emitter.js"(exports, module) {
      "use strict";
      var Point = require_Point().Point;
      var Particle = require_Particle().Particle;
      var Random = require_Random().Random;
      var Emitter = class {
        // Creates a new Emitter given a point in space and emission velocity
        constructor(point, velocity, xsize, ysize, particleLife, spread, emissionRate) {
          this.position = point;
          this.velocity = velocity;
          this.xsize = xsize;
          this.ysize = ysize;
          this.particleLife = particleLife || -1;
          this.spread = spread === void 0 ? Math.PI / 32 : spread;
          this.emissionRate = emissionRate || 1;
          this.jitter = 0.05;
          this.rand = new Random();
        }
        setPos(xy) {
          this.position = xy;
          return this;
        }
        setSpeed(sp) {
          this.velocity = sp;
          return this;
        }
        setSize(xy) {
          this.xsize = xy.x;
          this.ysize = xy.y;
          return this;
        }
        setJitter(x) {
          this.jitter = x;
          return this;
        }
        setSpread(x) {
          this.spread = x;
          return this;
        }
        setLifetime(x) {
          this.particleLife = x;
          return this;
        }
        // Sets the distribution function
        seed(val) {
          if (val !== void 0) {
            this.rand.setSeed(val);
          }
          return this;
        }
        // Adds a new particle using the Emitter position and velocity as starting point.
        addParticle() {
          var pPosition = this.position.copy();
          pPosition.x += this.rand.random() * this.xsize;
          pPosition.y += this.rand.random() * this.ysize;
          var particle = new Particle(
            pPosition,
            Point.fromAngle(
              this.velocity.getAngle() - this.spread * this.rand.random() - 0 * this.spread * 2,
              this.velocity.getMagnitude()
            )
          );
          particle.ttl = this.particleLife;
          return particle;
        }
      };
      module.exports.Emitter = Emitter;
    }
  });

  // src/particles/ParticleSystem.js
  var require_ParticleSystem = __commonJS({
    "src/particles/ParticleSystem.js"(exports, module) {
      "use strict";
      var Point = require_Point().Point;
      var Field = require_Field().Field;
      var Emitter = require_Emitter().Emitter;
      var Particle = require_Particle().Particle;
      var Random = require_Random().Random;
      var ParticleSystem = class {
        // Creates a new ParticleSystem
        constructor(points) {
          this.maxParticles = 2e3;
          this.particles = [];
          this.emitters = [];
          this.fields = [];
          this.elapsed = 0;
          this.gen = false;
          this.baseOrigin = new Point(0, 0);
          this.rand = new Random();
          var that = this;
          if (points !== void 0) {
            points.forEach(function(point) {
              that.particles.push(new Particle(point));
            });
          }
          return this;
        }
        // Sets the origin of the Particle System
        setOrigin(point) {
          this.baseOrigin = point;
          return this;
        }
        // Sets the distribution function
        seed(val) {
          if (val !== void 0) {
            this.rand.setSeed(val);
          }
          return this;
        }
        // Adds a new Emitter, given a point in space and a velocity
        addEmitter(point, velocity, xsize, ysize, particleLife, spread, emissionRate) {
          this.emitters.push(new Emitter(point, velocity, xsize, ysize, particleLife, spread, emissionRate).seed(this.rand.random()));
          return this;
        }
        // Adds a new Field, given a point in space and its mass
        addField(point, mass, decay) {
          this.fields.push(new Field(point, mass, decay));
          return this;
        }
        // Sets the maximum number of particles in the system
        setMaxParticles(max) {
          this.maxParticles = max;
          return this;
        }
        bounded(width, height) {
          this.maxHeight = height;
          this.maxWidth = width;
          return this;
        }
        // Cleans the traces that are out of the boundaries
        clean() {
          if (this.maxHeight === void 0 || this.maxWidth == void 0)
            return this;
          var that = this;
          this.particles.forEach(function(part, i2) {
            var newTraces = [];
            part.getTrace().forEach(function(pos, i3) {
              if (pos.x <= that.baseOrigin.x + that.maxWidth && pos.y <= that.maxHeight + that.baseOrigin.y) {
                newTraces.push(pos);
              }
            });
            part.traceRecord = newTraces;
          });
          var i = this.particles.length;
          while (i--) {
            if (!this.particles[i].getTrace().length)
              this.particles.splice(i, 1);
          }
          return this;
        }
        // Checks all the registered emitters, getting new particles from them.
        // This method shouldn't be called directly, use evolve instead()
        addNewParticles() {
          var that = this;
          var emitParticles = function(emitter) {
            for (var i = 0; i < emitter.emissionRate; i++)
              that.particles.push(emitter.addParticle());
          };
          this.emitters.forEach(emitParticles);
          return this;
        }
        // Returns the particles in the system
        getParticles() {
          return this.particles;
        }
        // Returns the total particles count
        getParticleCount() {
          return this.particles.length;
        }
        // Returns the Emitters count
        getEmitterCount() {
          return this.emitters.length;
        }
        // Returns the Fields count
        getFieldCount() {
          return this.fields.length;
        }
        // This method triggers a particle generation on each registered Emitter and then updates
        // the particles position according to the registered Fields.
        evolve(steps) {
          var fields = this.fields;
          for (var step = 0; step < steps; step++) {
            if (this.particles.length < this.maxParticles)
              this.addNewParticles();
            this.particles.forEach(function(part) {
              part.submitToFields(fields);
              part.move();
            });
            fields.forEach((f) => f.decay());
          }
          ;
          return this.clean();
        }
      };
      module.exports.ParticleSystem = ParticleSystem;
      module.exports.Point = Point;
      module.exports.Field = Field;
      module.exports.Emitter = Emitter;
      module.exports.Particle = Particle;
    }
  });

  // node_modules/chroma-js/chroma.js
  var require_chroma = __commonJS({
    "node_modules/chroma-js/chroma.js"(exports, module) {
      (function() {
        var Color, DEG2RAD, LAB_CONSTANTS, PI, PITHIRD, RAD2DEG, TWOPI, _average_lrgb, _guess_formats, _guess_formats_sorted, _input, _interpolators, abs, atan2, bezier, blend, blend_f, brewer, burn, chroma, clip_rgb, cmyk2rgb, colors, cos, css2rgb, darken, dodge, each, floor, hcg2rgb, hex2rgb, hsi2rgb, hsl2css, hsl2rgb, hsv2rgb, interpolate, interpolate_hsx, interpolate_lab, interpolate_lrgb, interpolate_num, interpolate_rgb, lab2lch, lab2rgb, lab_xyz, lch2lab, lch2rgb, lighten, limit, log, luminance_x, m, max, multiply, normal, num2rgb, overlay, pow, rgb2cmyk, rgb2css, rgb2hcg, rgb2hex, rgb2hsi, rgb2hsl, rgb2hsv, rgb2lab, rgb2lch, rgb2luminance, rgb2num, rgb2temperature, rgb2xyz, rgb_xyz, rnd, root, round, screen, sin, sqrt, temperature2rgb, type, unpack, w3cx11, xyz_lab, xyz_rgb, slice = [].slice;
        type = (function() {
          var classToType, len, name, o, ref;
          classToType = {};
          ref = "Boolean Number String Function Array Date RegExp Undefined Null".split(" ");
          for (o = 0, len = ref.length; o < len; o++) {
            name = ref[o];
            classToType["[object " + name + "]"] = name.toLowerCase();
          }
          return function(obj) {
            var strType;
            strType = Object.prototype.toString.call(obj);
            return classToType[strType] || "object";
          };
        })();
        limit = function(x, min, max2) {
          if (min == null) {
            min = 0;
          }
          if (max2 == null) {
            max2 = 1;
          }
          if (x < min) {
            x = min;
          }
          if (x > max2) {
            x = max2;
          }
          return x;
        };
        unpack = function(args) {
          if (args.length >= 3) {
            return Array.prototype.slice.call(args);
          } else {
            return args[0];
          }
        };
        clip_rgb = function(rgb) {
          var i, o;
          rgb._clipped = false;
          rgb._unclipped = rgb.slice(0);
          for (i = o = 0; o < 3; i = ++o) {
            if (i < 3) {
              if (rgb[i] < 0 || rgb[i] > 255) {
                rgb._clipped = true;
              }
              if (rgb[i] < 0) {
                rgb[i] = 0;
              }
              if (rgb[i] > 255) {
                rgb[i] = 255;
              }
            } else if (i === 3) {
              if (rgb[i] < 0) {
                rgb[i] = 0;
              }
              if (rgb[i] > 1) {
                rgb[i] = 1;
              }
            }
          }
          if (!rgb._clipped) {
            delete rgb._unclipped;
          }
          return rgb;
        };
        PI = Math.PI, round = Math.round, cos = Math.cos, floor = Math.floor, pow = Math.pow, log = Math.log, sin = Math.sin, sqrt = Math.sqrt, atan2 = Math.atan2, max = Math.max, abs = Math.abs;
        TWOPI = PI * 2;
        PITHIRD = PI / 3;
        DEG2RAD = PI / 180;
        RAD2DEG = 180 / PI;
        chroma = function() {
          if (arguments[0] instanceof Color) {
            return arguments[0];
          }
          return (function(func, args, ctor) {
            ctor.prototype = func.prototype;
            var child = new ctor(), result = func.apply(child, args);
            return Object(result) === result ? result : child;
          })(Color, arguments, function() {
          });
        };
        chroma["default"] = chroma;
        _interpolators = [];
        if (typeof module !== "undefined" && module !== null && module.exports != null) {
          module.exports = chroma;
        }
        if (typeof define === "function" && define.amd) {
          define([], function() {
            return chroma;
          });
        } else {
          root = typeof exports !== "undefined" && exports !== null ? exports : this;
          root.chroma = chroma;
        }
        chroma.version = "1.4.1";
        _input = {};
        _guess_formats = [];
        _guess_formats_sorted = false;
        Color = (function() {
          function Color2() {
            var arg, args, chk, len, len1, me, mode, o, w;
            me = this;
            args = [];
            for (o = 0, len = arguments.length; o < len; o++) {
              arg = arguments[o];
              if (arg != null) {
                args.push(arg);
              }
            }
            if (args.length > 1) {
              mode = args[args.length - 1];
            }
            if (_input[mode] != null) {
              me._rgb = clip_rgb(_input[mode](unpack(args.slice(0, -1))));
            } else {
              if (!_guess_formats_sorted) {
                _guess_formats = _guess_formats.sort(function(a, b) {
                  return b.p - a.p;
                });
                _guess_formats_sorted = true;
              }
              for (w = 0, len1 = _guess_formats.length; w < len1; w++) {
                chk = _guess_formats[w];
                mode = chk.test.apply(chk, args);
                if (mode) {
                  break;
                }
              }
              if (mode) {
                me._rgb = clip_rgb(_input[mode].apply(_input, args));
              }
            }
            if (me._rgb == null) {
              console.warn("unknown format: " + args);
            }
            if (me._rgb == null) {
              me._rgb = [0, 0, 0];
            }
            if (me._rgb.length === 3) {
              me._rgb.push(1);
            }
          }
          Color2.prototype.toString = function() {
            return this.hex();
          };
          return Color2;
        })();
        chroma._input = _input;
        chroma.brewer = brewer = {
          OrRd: ["#fff7ec", "#fee8c8", "#fdd49e", "#fdbb84", "#fc8d59", "#ef6548", "#d7301f", "#b30000", "#7f0000"],
          PuBu: ["#fff7fb", "#ece7f2", "#d0d1e6", "#a6bddb", "#74a9cf", "#3690c0", "#0570b0", "#045a8d", "#023858"],
          BuPu: ["#f7fcfd", "#e0ecf4", "#bfd3e6", "#9ebcda", "#8c96c6", "#8c6bb1", "#88419d", "#810f7c", "#4d004b"],
          Oranges: ["#fff5eb", "#fee6ce", "#fdd0a2", "#fdae6b", "#fd8d3c", "#f16913", "#d94801", "#a63603", "#7f2704"],
          BuGn: ["#f7fcfd", "#e5f5f9", "#ccece6", "#99d8c9", "#66c2a4", "#41ae76", "#238b45", "#006d2c", "#00441b"],
          YlOrBr: ["#ffffe5", "#fff7bc", "#fee391", "#fec44f", "#fe9929", "#ec7014", "#cc4c02", "#993404", "#662506"],
          YlGn: ["#ffffe5", "#f7fcb9", "#d9f0a3", "#addd8e", "#78c679", "#41ab5d", "#238443", "#006837", "#004529"],
          Reds: ["#fff5f0", "#fee0d2", "#fcbba1", "#fc9272", "#fb6a4a", "#ef3b2c", "#cb181d", "#a50f15", "#67000d"],
          RdPu: ["#fff7f3", "#fde0dd", "#fcc5c0", "#fa9fb5", "#f768a1", "#dd3497", "#ae017e", "#7a0177", "#49006a"],
          Greens: ["#f7fcf5", "#e5f5e0", "#c7e9c0", "#a1d99b", "#74c476", "#41ab5d", "#238b45", "#006d2c", "#00441b"],
          YlGnBu: ["#ffffd9", "#edf8b1", "#c7e9b4", "#7fcdbb", "#41b6c4", "#1d91c0", "#225ea8", "#253494", "#081d58"],
          Purples: ["#fcfbfd", "#efedf5", "#dadaeb", "#bcbddc", "#9e9ac8", "#807dba", "#6a51a3", "#54278f", "#3f007d"],
          GnBu: ["#f7fcf0", "#e0f3db", "#ccebc5", "#a8ddb5", "#7bccc4", "#4eb3d3", "#2b8cbe", "#0868ac", "#084081"],
          Greys: ["#ffffff", "#f0f0f0", "#d9d9d9", "#bdbdbd", "#969696", "#737373", "#525252", "#252525", "#000000"],
          YlOrRd: ["#ffffcc", "#ffeda0", "#fed976", "#feb24c", "#fd8d3c", "#fc4e2a", "#e31a1c", "#bd0026", "#800026"],
          PuRd: ["#f7f4f9", "#e7e1ef", "#d4b9da", "#c994c7", "#df65b0", "#e7298a", "#ce1256", "#980043", "#67001f"],
          Blues: ["#f7fbff", "#deebf7", "#c6dbef", "#9ecae1", "#6baed6", "#4292c6", "#2171b5", "#08519c", "#08306b"],
          PuBuGn: ["#fff7fb", "#ece2f0", "#d0d1e6", "#a6bddb", "#67a9cf", "#3690c0", "#02818a", "#016c59", "#014636"],
          Viridis: ["#440154", "#482777", "#3f4a8a", "#31678e", "#26838f", "#1f9d8a", "#6cce5a", "#b6de2b", "#fee825"],
          Spectral: ["#9e0142", "#d53e4f", "#f46d43", "#fdae61", "#fee08b", "#ffffbf", "#e6f598", "#abdda4", "#66c2a5", "#3288bd", "#5e4fa2"],
          RdYlGn: ["#a50026", "#d73027", "#f46d43", "#fdae61", "#fee08b", "#ffffbf", "#d9ef8b", "#a6d96a", "#66bd63", "#1a9850", "#006837"],
          RdBu: ["#67001f", "#b2182b", "#d6604d", "#f4a582", "#fddbc7", "#f7f7f7", "#d1e5f0", "#92c5de", "#4393c3", "#2166ac", "#053061"],
          PiYG: ["#8e0152", "#c51b7d", "#de77ae", "#f1b6da", "#fde0ef", "#f7f7f7", "#e6f5d0", "#b8e186", "#7fbc41", "#4d9221", "#276419"],
          PRGn: ["#40004b", "#762a83", "#9970ab", "#c2a5cf", "#e7d4e8", "#f7f7f7", "#d9f0d3", "#a6dba0", "#5aae61", "#1b7837", "#00441b"],
          RdYlBu: ["#a50026", "#d73027", "#f46d43", "#fdae61", "#fee090", "#ffffbf", "#e0f3f8", "#abd9e9", "#74add1", "#4575b4", "#313695"],
          BrBG: ["#543005", "#8c510a", "#bf812d", "#dfc27d", "#f6e8c3", "#f5f5f5", "#c7eae5", "#80cdc1", "#35978f", "#01665e", "#003c30"],
          RdGy: ["#67001f", "#b2182b", "#d6604d", "#f4a582", "#fddbc7", "#ffffff", "#e0e0e0", "#bababa", "#878787", "#4d4d4d", "#1a1a1a"],
          PuOr: ["#7f3b08", "#b35806", "#e08214", "#fdb863", "#fee0b6", "#f7f7f7", "#d8daeb", "#b2abd2", "#8073ac", "#542788", "#2d004b"],
          Set2: ["#66c2a5", "#fc8d62", "#8da0cb", "#e78ac3", "#a6d854", "#ffd92f", "#e5c494", "#b3b3b3"],
          Accent: ["#7fc97f", "#beaed4", "#fdc086", "#ffff99", "#386cb0", "#f0027f", "#bf5b17", "#666666"],
          Set1: ["#e41a1c", "#377eb8", "#4daf4a", "#984ea3", "#ff7f00", "#ffff33", "#a65628", "#f781bf", "#999999"],
          Set3: ["#8dd3c7", "#ffffb3", "#bebada", "#fb8072", "#80b1d3", "#fdb462", "#b3de69", "#fccde5", "#d9d9d9", "#bc80bd", "#ccebc5", "#ffed6f"],
          Dark2: ["#1b9e77", "#d95f02", "#7570b3", "#e7298a", "#66a61e", "#e6ab02", "#a6761d", "#666666"],
          Paired: ["#a6cee3", "#1f78b4", "#b2df8a", "#33a02c", "#fb9a99", "#e31a1c", "#fdbf6f", "#ff7f00", "#cab2d6", "#6a3d9a", "#ffff99", "#b15928"],
          Pastel2: ["#b3e2cd", "#fdcdac", "#cbd5e8", "#f4cae4", "#e6f5c9", "#fff2ae", "#f1e2cc", "#cccccc"],
          Pastel1: ["#fbb4ae", "#b3cde3", "#ccebc5", "#decbe4", "#fed9a6", "#ffffcc", "#e5d8bd", "#fddaec", "#f2f2f2"]
        };
        (function() {
          var key, results;
          results = [];
          for (key in brewer) {
            results.push(brewer[key.toLowerCase()] = brewer[key]);
          }
          return results;
        })();
        w3cx11 = {
          aliceblue: "#f0f8ff",
          antiquewhite: "#faebd7",
          aqua: "#00ffff",
          aquamarine: "#7fffd4",
          azure: "#f0ffff",
          beige: "#f5f5dc",
          bisque: "#ffe4c4",
          black: "#000000",
          blanchedalmond: "#ffebcd",
          blue: "#0000ff",
          blueviolet: "#8a2be2",
          brown: "#a52a2a",
          burlywood: "#deb887",
          cadetblue: "#5f9ea0",
          chartreuse: "#7fff00",
          chocolate: "#d2691e",
          coral: "#ff7f50",
          cornflower: "#6495ed",
          cornflowerblue: "#6495ed",
          cornsilk: "#fff8dc",
          crimson: "#dc143c",
          cyan: "#00ffff",
          darkblue: "#00008b",
          darkcyan: "#008b8b",
          darkgoldenrod: "#b8860b",
          darkgray: "#a9a9a9",
          darkgreen: "#006400",
          darkgrey: "#a9a9a9",
          darkkhaki: "#bdb76b",
          darkmagenta: "#8b008b",
          darkolivegreen: "#556b2f",
          darkorange: "#ff8c00",
          darkorchid: "#9932cc",
          darkred: "#8b0000",
          darksalmon: "#e9967a",
          darkseagreen: "#8fbc8f",
          darkslateblue: "#483d8b",
          darkslategray: "#2f4f4f",
          darkslategrey: "#2f4f4f",
          darkturquoise: "#00ced1",
          darkviolet: "#9400d3",
          deeppink: "#ff1493",
          deepskyblue: "#00bfff",
          dimgray: "#696969",
          dimgrey: "#696969",
          dodgerblue: "#1e90ff",
          firebrick: "#b22222",
          floralwhite: "#fffaf0",
          forestgreen: "#228b22",
          fuchsia: "#ff00ff",
          gainsboro: "#dcdcdc",
          ghostwhite: "#f8f8ff",
          gold: "#ffd700",
          goldenrod: "#daa520",
          gray: "#808080",
          green: "#008000",
          greenyellow: "#adff2f",
          grey: "#808080",
          honeydew: "#f0fff0",
          hotpink: "#ff69b4",
          indianred: "#cd5c5c",
          indigo: "#4b0082",
          ivory: "#fffff0",
          khaki: "#f0e68c",
          laserlemon: "#ffff54",
          lavender: "#e6e6fa",
          lavenderblush: "#fff0f5",
          lawngreen: "#7cfc00",
          lemonchiffon: "#fffacd",
          lightblue: "#add8e6",
          lightcoral: "#f08080",
          lightcyan: "#e0ffff",
          lightgoldenrod: "#fafad2",
          lightgoldenrodyellow: "#fafad2",
          lightgray: "#d3d3d3",
          lightgreen: "#90ee90",
          lightgrey: "#d3d3d3",
          lightpink: "#ffb6c1",
          lightsalmon: "#ffa07a",
          lightseagreen: "#20b2aa",
          lightskyblue: "#87cefa",
          lightslategray: "#778899",
          lightslategrey: "#778899",
          lightsteelblue: "#b0c4de",
          lightyellow: "#ffffe0",
          lime: "#00ff00",
          limegreen: "#32cd32",
          linen: "#faf0e6",
          magenta: "#ff00ff",
          maroon: "#800000",
          maroon2: "#7f0000",
          maroon3: "#b03060",
          mediumaquamarine: "#66cdaa",
          mediumblue: "#0000cd",
          mediumorchid: "#ba55d3",
          mediumpurple: "#9370db",
          mediumseagreen: "#3cb371",
          mediumslateblue: "#7b68ee",
          mediumspringgreen: "#00fa9a",
          mediumturquoise: "#48d1cc",
          mediumvioletred: "#c71585",
          midnightblue: "#191970",
          mintcream: "#f5fffa",
          mistyrose: "#ffe4e1",
          moccasin: "#ffe4b5",
          navajowhite: "#ffdead",
          navy: "#000080",
          oldlace: "#fdf5e6",
          olive: "#808000",
          olivedrab: "#6b8e23",
          orange: "#ffa500",
          orangered: "#ff4500",
          orchid: "#da70d6",
          palegoldenrod: "#eee8aa",
          palegreen: "#98fb98",
          paleturquoise: "#afeeee",
          palevioletred: "#db7093",
          papayawhip: "#ffefd5",
          peachpuff: "#ffdab9",
          peru: "#cd853f",
          pink: "#ffc0cb",
          plum: "#dda0dd",
          powderblue: "#b0e0e6",
          purple: "#800080",
          purple2: "#7f007f",
          purple3: "#a020f0",
          rebeccapurple: "#663399",
          red: "#ff0000",
          rosybrown: "#bc8f8f",
          royalblue: "#4169e1",
          saddlebrown: "#8b4513",
          salmon: "#fa8072",
          sandybrown: "#f4a460",
          seagreen: "#2e8b57",
          seashell: "#fff5ee",
          sienna: "#a0522d",
          silver: "#c0c0c0",
          skyblue: "#87ceeb",
          slateblue: "#6a5acd",
          slategray: "#708090",
          slategrey: "#708090",
          snow: "#fffafa",
          springgreen: "#00ff7f",
          steelblue: "#4682b4",
          tan: "#d2b48c",
          teal: "#008080",
          thistle: "#d8bfd8",
          tomato: "#ff6347",
          turquoise: "#40e0d0",
          violet: "#ee82ee",
          wheat: "#f5deb3",
          white: "#ffffff",
          whitesmoke: "#f5f5f5",
          yellow: "#ffff00",
          yellowgreen: "#9acd32"
        };
        chroma.colors = colors = w3cx11;
        lab2rgb = function() {
          var a, args, b, g, l, r, x, y, z;
          args = unpack(arguments);
          l = args[0], a = args[1], b = args[2];
          y = (l + 16) / 116;
          x = isNaN(a) ? y : y + a / 500;
          z = isNaN(b) ? y : y - b / 200;
          y = LAB_CONSTANTS.Yn * lab_xyz(y);
          x = LAB_CONSTANTS.Xn * lab_xyz(x);
          z = LAB_CONSTANTS.Zn * lab_xyz(z);
          r = xyz_rgb(3.2404542 * x - 1.5371385 * y - 0.4985314 * z);
          g = xyz_rgb(-0.969266 * x + 1.8760108 * y + 0.041556 * z);
          b = xyz_rgb(0.0556434 * x - 0.2040259 * y + 1.0572252 * z);
          return [r, g, b, args.length > 3 ? args[3] : 1];
        };
        xyz_rgb = function(r) {
          return 255 * (r <= 304e-5 ? 12.92 * r : 1.055 * pow(r, 1 / 2.4) - 0.055);
        };
        lab_xyz = function(t) {
          if (t > LAB_CONSTANTS.t1) {
            return t * t * t;
          } else {
            return LAB_CONSTANTS.t2 * (t - LAB_CONSTANTS.t0);
          }
        };
        LAB_CONSTANTS = {
          Kn: 18,
          Xn: 0.95047,
          Yn: 1,
          Zn: 1.08883,
          t0: 0.137931034,
          t1: 0.206896552,
          t2: 0.12841855,
          t3: 8856452e-9
        };
        rgb2lab = function() {
          var b, g, r, ref, ref1, x, y, z;
          ref = unpack(arguments), r = ref[0], g = ref[1], b = ref[2];
          ref1 = rgb2xyz(r, g, b), x = ref1[0], y = ref1[1], z = ref1[2];
          return [116 * y - 16, 500 * (x - y), 200 * (y - z)];
        };
        rgb_xyz = function(r) {
          if ((r /= 255) <= 0.04045) {
            return r / 12.92;
          } else {
            return pow((r + 0.055) / 1.055, 2.4);
          }
        };
        xyz_lab = function(t) {
          if (t > LAB_CONSTANTS.t3) {
            return pow(t, 1 / 3);
          } else {
            return t / LAB_CONSTANTS.t2 + LAB_CONSTANTS.t0;
          }
        };
        rgb2xyz = function() {
          var b, g, r, ref, x, y, z;
          ref = unpack(arguments), r = ref[0], g = ref[1], b = ref[2];
          r = rgb_xyz(r);
          g = rgb_xyz(g);
          b = rgb_xyz(b);
          x = xyz_lab((0.4124564 * r + 0.3575761 * g + 0.1804375 * b) / LAB_CONSTANTS.Xn);
          y = xyz_lab((0.2126729 * r + 0.7151522 * g + 0.072175 * b) / LAB_CONSTANTS.Yn);
          z = xyz_lab((0.0193339 * r + 0.119192 * g + 0.9503041 * b) / LAB_CONSTANTS.Zn);
          return [x, y, z];
        };
        chroma.lab = function() {
          return (function(func, args, ctor) {
            ctor.prototype = func.prototype;
            var child = new ctor(), result = func.apply(child, args);
            return Object(result) === result ? result : child;
          })(Color, slice.call(arguments).concat(["lab"]), function() {
          });
        };
        _input.lab = lab2rgb;
        Color.prototype.lab = function() {
          return rgb2lab(this._rgb);
        };
        bezier = function(colors2) {
          var I, I0, I1, c, lab0, lab1, lab2, lab3, ref, ref1, ref2;
          colors2 = (function() {
            var len, o, results;
            results = [];
            for (o = 0, len = colors2.length; o < len; o++) {
              c = colors2[o];
              results.push(chroma(c));
            }
            return results;
          })();
          if (colors2.length === 2) {
            ref = (function() {
              var len, o, results;
              results = [];
              for (o = 0, len = colors2.length; o < len; o++) {
                c = colors2[o];
                results.push(c.lab());
              }
              return results;
            })(), lab0 = ref[0], lab1 = ref[1];
            I = function(t) {
              var i, lab;
              lab = (function() {
                var o, results;
                results = [];
                for (i = o = 0; o <= 2; i = ++o) {
                  results.push(lab0[i] + t * (lab1[i] - lab0[i]));
                }
                return results;
              })();
              return chroma.lab.apply(chroma, lab);
            };
          } else if (colors2.length === 3) {
            ref1 = (function() {
              var len, o, results;
              results = [];
              for (o = 0, len = colors2.length; o < len; o++) {
                c = colors2[o];
                results.push(c.lab());
              }
              return results;
            })(), lab0 = ref1[0], lab1 = ref1[1], lab2 = ref1[2];
            I = function(t) {
              var i, lab;
              lab = (function() {
                var o, results;
                results = [];
                for (i = o = 0; o <= 2; i = ++o) {
                  results.push((1 - t) * (1 - t) * lab0[i] + 2 * (1 - t) * t * lab1[i] + t * t * lab2[i]);
                }
                return results;
              })();
              return chroma.lab.apply(chroma, lab);
            };
          } else if (colors2.length === 4) {
            ref2 = (function() {
              var len, o, results;
              results = [];
              for (o = 0, len = colors2.length; o < len; o++) {
                c = colors2[o];
                results.push(c.lab());
              }
              return results;
            })(), lab0 = ref2[0], lab1 = ref2[1], lab2 = ref2[2], lab3 = ref2[3];
            I = function(t) {
              var i, lab;
              lab = (function() {
                var o, results;
                results = [];
                for (i = o = 0; o <= 2; i = ++o) {
                  results.push((1 - t) * (1 - t) * (1 - t) * lab0[i] + 3 * (1 - t) * (1 - t) * t * lab1[i] + 3 * (1 - t) * t * t * lab2[i] + t * t * t * lab3[i]);
                }
                return results;
              })();
              return chroma.lab.apply(chroma, lab);
            };
          } else if (colors2.length === 5) {
            I0 = bezier(colors2.slice(0, 3));
            I1 = bezier(colors2.slice(2, 5));
            I = function(t) {
              if (t < 0.5) {
                return I0(t * 2);
              } else {
                return I1((t - 0.5) * 2);
              }
            };
          }
          return I;
        };
        chroma.bezier = function(colors2) {
          var f;
          f = bezier(colors2);
          f.scale = function() {
            return chroma.scale(f);
          };
          return f;
        };
        chroma.cubehelix = function(start, rotations, hue, gamma, lightness) {
          var dh, dl, f;
          if (start == null) {
            start = 300;
          }
          if (rotations == null) {
            rotations = -1.5;
          }
          if (hue == null) {
            hue = 1;
          }
          if (gamma == null) {
            gamma = 1;
          }
          if (lightness == null) {
            lightness = [0, 1];
          }
          dh = 0;
          if (type(lightness) === "array") {
            dl = lightness[1] - lightness[0];
          } else {
            dl = 0;
            lightness = [lightness, lightness];
          }
          f = function(fract) {
            var a, amp, b, cos_a, g, h, l, r, sin_a;
            a = TWOPI * ((start + 120) / 360 + rotations * fract);
            l = pow(lightness[0] + dl * fract, gamma);
            h = dh !== 0 ? hue[0] + fract * dh : hue;
            amp = h * l * (1 - l) / 2;
            cos_a = cos(a);
            sin_a = sin(a);
            r = l + amp * (-0.14861 * cos_a + 1.78277 * sin_a);
            g = l + amp * (-0.29227 * cos_a - 0.90649 * sin_a);
            b = l + amp * (1.97294 * cos_a);
            return chroma(clip_rgb([r * 255, g * 255, b * 255, 1]));
          };
          f.start = function(s) {
            if (s == null) {
              return start;
            }
            start = s;
            return f;
          };
          f.rotations = function(r) {
            if (r == null) {
              return rotations;
            }
            rotations = r;
            return f;
          };
          f.gamma = function(g) {
            if (g == null) {
              return gamma;
            }
            gamma = g;
            return f;
          };
          f.hue = function(h) {
            if (h == null) {
              return hue;
            }
            hue = h;
            if (type(hue) === "array") {
              dh = hue[1] - hue[0];
              if (dh === 0) {
                hue = hue[1];
              }
            } else {
              dh = 0;
            }
            return f;
          };
          f.lightness = function(h) {
            if (h == null) {
              return lightness;
            }
            if (type(h) === "array") {
              lightness = h;
              dl = h[1] - h[0];
            } else {
              lightness = [h, h];
              dl = 0;
            }
            return f;
          };
          f.scale = function() {
            return chroma.scale(f);
          };
          f.hue(hue);
          return f;
        };
        chroma.random = function() {
          var code, digits, i, o;
          digits = "0123456789abcdef";
          code = "#";
          for (i = o = 0; o < 6; i = ++o) {
            code += digits.charAt(floor(Math.random() * 16));
          }
          return new Color(code);
        };
        _interpolators = [];
        interpolate = function(col1, col2, f, m2) {
          var interpol, len, o, res;
          if (f == null) {
            f = 0.5;
          }
          if (m2 == null) {
            m2 = "rgb";
          }
          if (type(col1) !== "object") {
            col1 = chroma(col1);
          }
          if (type(col2) !== "object") {
            col2 = chroma(col2);
          }
          for (o = 0, len = _interpolators.length; o < len; o++) {
            interpol = _interpolators[o];
            if (m2 === interpol[0]) {
              res = interpol[1](col1, col2, f, m2);
              break;
            }
          }
          if (res == null) {
            throw "color mode " + m2 + " is not supported";
          }
          return res.alpha(col1.alpha() + f * (col2.alpha() - col1.alpha()));
        };
        chroma.interpolate = interpolate;
        Color.prototype.interpolate = function(col2, f, m2) {
          return interpolate(this, col2, f, m2);
        };
        chroma.mix = interpolate;
        Color.prototype.mix = Color.prototype.interpolate;
        _input.rgb = function() {
          var k, ref, results, v;
          ref = unpack(arguments);
          results = [];
          for (k in ref) {
            v = ref[k];
            results.push(v);
          }
          return results;
        };
        chroma.rgb = function() {
          return (function(func, args, ctor) {
            ctor.prototype = func.prototype;
            var child = new ctor(), result = func.apply(child, args);
            return Object(result) === result ? result : child;
          })(Color, slice.call(arguments).concat(["rgb"]), function() {
          });
        };
        Color.prototype.rgb = function(round2) {
          if (round2 == null) {
            round2 = true;
          }
          if (round2) {
            return this._rgb.map(Math.round).slice(0, 3);
          } else {
            return this._rgb.slice(0, 3);
          }
        };
        Color.prototype.rgba = function(round2) {
          if (round2 == null) {
            round2 = true;
          }
          if (!round2) {
            return this._rgb.slice(0);
          }
          return [Math.round(this._rgb[0]), Math.round(this._rgb[1]), Math.round(this._rgb[2]), this._rgb[3]];
        };
        _guess_formats.push({
          p: 3,
          test: function(n) {
            var a;
            a = unpack(arguments);
            if (type(a) === "array" && a.length === 3) {
              return "rgb";
            }
            if (a.length === 4 && type(a[3]) === "number" && a[3] >= 0 && a[3] <= 1) {
              return "rgb";
            }
          }
        });
        _input.lrgb = _input.rgb;
        interpolate_lrgb = function(col1, col2, f, m2) {
          var xyz0, xyz1;
          xyz0 = col1._rgb;
          xyz1 = col2._rgb;
          return new Color(sqrt(pow(xyz0[0], 2) * (1 - f) + pow(xyz1[0], 2) * f), sqrt(pow(xyz0[1], 2) * (1 - f) + pow(xyz1[1], 2) * f), sqrt(pow(xyz0[2], 2) * (1 - f) + pow(xyz1[2], 2) * f), m2);
        };
        _average_lrgb = function(colors2) {
          var col, f, len, o, rgb, xyz;
          f = 1 / colors2.length;
          xyz = [0, 0, 0, 0];
          for (o = 0, len = colors2.length; o < len; o++) {
            col = colors2[o];
            rgb = col._rgb;
            xyz[0] += pow(rgb[0], 2) * f;
            xyz[1] += pow(rgb[1], 2) * f;
            xyz[2] += pow(rgb[2], 2) * f;
            xyz[3] += rgb[3] * f;
          }
          xyz[0] = sqrt(xyz[0]);
          xyz[1] = sqrt(xyz[1]);
          xyz[2] = sqrt(xyz[2]);
          if (xyz[3] > 1) {
            xyz[3] = 1;
          }
          return new Color(clip_rgb(xyz));
        };
        _interpolators.push(["lrgb", interpolate_lrgb]);
        chroma.average = function(colors2, mode) {
          var A, alpha, c, cnt, dx, dy, first, i, l, len, o, xyz, xyz2;
          if (mode == null) {
            mode = "rgb";
          }
          l = colors2.length;
          colors2 = colors2.map(function(c2) {
            return chroma(c2);
          });
          first = colors2.splice(0, 1)[0];
          if (mode === "lrgb") {
            return _average_lrgb(colors2);
          }
          xyz = first.get(mode);
          cnt = [];
          dx = 0;
          dy = 0;
          for (i in xyz) {
            xyz[i] = xyz[i] || 0;
            cnt.push(isNaN(xyz[i]) ? 0 : 1);
            if (mode.charAt(i) === "h" && !isNaN(xyz[i])) {
              A = xyz[i] / 180 * PI;
              dx += cos(A);
              dy += sin(A);
            }
          }
          alpha = first.alpha();
          for (o = 0, len = colors2.length; o < len; o++) {
            c = colors2[o];
            xyz2 = c.get(mode);
            alpha += c.alpha();
            for (i in xyz) {
              if (!isNaN(xyz2[i])) {
                cnt[i] += 1;
                if (mode.charAt(i) === "h") {
                  A = xyz2[i] / 180 * PI;
                  dx += cos(A);
                  dy += sin(A);
                } else {
                  xyz[i] += xyz2[i];
                }
              }
            }
          }
          for (i in xyz) {
            if (mode.charAt(i) === "h") {
              A = atan2(dy / cnt[i], dx / cnt[i]) / PI * 180;
              while (A < 0) {
                A += 360;
              }
              while (A >= 360) {
                A -= 360;
              }
              xyz[i] = A;
            } else {
              xyz[i] = xyz[i] / cnt[i];
            }
          }
          return chroma(xyz, mode).alpha(alpha / l);
        };
        hex2rgb = function(hex) {
          var a, b, g, r, rgb, u;
          if (hex.match(/^#?([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/)) {
            if (hex.length === 4 || hex.length === 7) {
              hex = hex.substr(1);
            }
            if (hex.length === 3) {
              hex = hex.split("");
              hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
            }
            u = parseInt(hex, 16);
            r = u >> 16;
            g = u >> 8 & 255;
            b = u & 255;
            return [r, g, b, 1];
          }
          if (hex.match(/^#?([A-Fa-f0-9]{8})$/)) {
            if (hex.length === 9) {
              hex = hex.substr(1);
            }
            u = parseInt(hex, 16);
            r = u >> 24 & 255;
            g = u >> 16 & 255;
            b = u >> 8 & 255;
            a = round((u & 255) / 255 * 100) / 100;
            return [r, g, b, a];
          }
          if (_input.css != null && (rgb = _input.css(hex))) {
            return rgb;
          }
          throw "unknown color: " + hex;
        };
        rgb2hex = function(channels, mode) {
          var a, b, g, hxa, r, str, u;
          if (mode == null) {
            mode = "auto";
          }
          r = channels[0], g = channels[1], b = channels[2], a = channels[3];
          if (mode === "auto") {
            mode = a < 1 ? "rgba" : "rgb";
          }
          r = Math.round(r);
          g = Math.round(g);
          b = Math.round(b);
          u = r << 16 | g << 8 | b;
          str = "000000" + u.toString(16);
          str = str.substr(str.length - 6);
          hxa = "0" + round(a * 255).toString(16);
          hxa = hxa.substr(hxa.length - 2);
          return "#" + (function() {
            switch (mode.toLowerCase()) {
              case "rgba":
                return str + hxa;
              case "argb":
                return hxa + str;
              default:
                return str;
            }
          })();
        };
        _input.hex = function(h) {
          return hex2rgb(h);
        };
        chroma.hex = function() {
          return (function(func, args, ctor) {
            ctor.prototype = func.prototype;
            var child = new ctor(), result = func.apply(child, args);
            return Object(result) === result ? result : child;
          })(Color, slice.call(arguments).concat(["hex"]), function() {
          });
        };
        Color.prototype.hex = function(mode) {
          if (mode == null) {
            mode = "auto";
          }
          return rgb2hex(this._rgb, mode);
        };
        _guess_formats.push({
          p: 4,
          test: function(n) {
            if (arguments.length === 1 && type(n) === "string") {
              return "hex";
            }
          }
        });
        hsl2rgb = function() {
          var args, b, c, g, h, i, l, o, r, ref, s, t1, t2, t3;
          args = unpack(arguments);
          h = args[0], s = args[1], l = args[2];
          if (s === 0) {
            r = g = b = l * 255;
          } else {
            t3 = [0, 0, 0];
            c = [0, 0, 0];
            t2 = l < 0.5 ? l * (1 + s) : l + s - l * s;
            t1 = 2 * l - t2;
            h /= 360;
            t3[0] = h + 1 / 3;
            t3[1] = h;
            t3[2] = h - 1 / 3;
            for (i = o = 0; o <= 2; i = ++o) {
              if (t3[i] < 0) {
                t3[i] += 1;
              }
              if (t3[i] > 1) {
                t3[i] -= 1;
              }
              if (6 * t3[i] < 1) {
                c[i] = t1 + (t2 - t1) * 6 * t3[i];
              } else if (2 * t3[i] < 1) {
                c[i] = t2;
              } else if (3 * t3[i] < 2) {
                c[i] = t1 + (t2 - t1) * (2 / 3 - t3[i]) * 6;
              } else {
                c[i] = t1;
              }
            }
            ref = [round(c[0] * 255), round(c[1] * 255), round(c[2] * 255)], r = ref[0], g = ref[1], b = ref[2];
          }
          if (args.length > 3) {
            return [r, g, b, args[3]];
          } else {
            return [r, g, b];
          }
        };
        rgb2hsl = function(r, g, b) {
          var h, l, min, ref, s;
          if (r !== void 0 && r.length >= 3) {
            ref = r, r = ref[0], g = ref[1], b = ref[2];
          }
          r /= 255;
          g /= 255;
          b /= 255;
          min = Math.min(r, g, b);
          max = Math.max(r, g, b);
          l = (max + min) / 2;
          if (max === min) {
            s = 0;
            h = Number.NaN;
          } else {
            s = l < 0.5 ? (max - min) / (max + min) : (max - min) / (2 - max - min);
          }
          if (r === max) {
            h = (g - b) / (max - min);
          } else if (g === max) {
            h = 2 + (b - r) / (max - min);
          } else if (b === max) {
            h = 4 + (r - g) / (max - min);
          }
          h *= 60;
          if (h < 0) {
            h += 360;
          }
          return [h, s, l];
        };
        chroma.hsl = function() {
          return (function(func, args, ctor) {
            ctor.prototype = func.prototype;
            var child = new ctor(), result = func.apply(child, args);
            return Object(result) === result ? result : child;
          })(Color, slice.call(arguments).concat(["hsl"]), function() {
          });
        };
        _input.hsl = hsl2rgb;
        Color.prototype.hsl = function() {
          return rgb2hsl(this._rgb);
        };
        hsv2rgb = function() {
          var args, b, f, g, h, i, p, q, r, ref, ref1, ref2, ref3, ref4, ref5, s, t, v;
          args = unpack(arguments);
          h = args[0], s = args[1], v = args[2];
          v *= 255;
          if (s === 0) {
            r = g = b = v;
          } else {
            if (h === 360) {
              h = 0;
            }
            if (h > 360) {
              h -= 360;
            }
            if (h < 0) {
              h += 360;
            }
            h /= 60;
            i = floor(h);
            f = h - i;
            p = v * (1 - s);
            q = v * (1 - s * f);
            t = v * (1 - s * (1 - f));
            switch (i) {
              case 0:
                ref = [v, t, p], r = ref[0], g = ref[1], b = ref[2];
                break;
              case 1:
                ref1 = [q, v, p], r = ref1[0], g = ref1[1], b = ref1[2];
                break;
              case 2:
                ref2 = [p, v, t], r = ref2[0], g = ref2[1], b = ref2[2];
                break;
              case 3:
                ref3 = [p, q, v], r = ref3[0], g = ref3[1], b = ref3[2];
                break;
              case 4:
                ref4 = [t, p, v], r = ref4[0], g = ref4[1], b = ref4[2];
                break;
              case 5:
                ref5 = [v, p, q], r = ref5[0], g = ref5[1], b = ref5[2];
            }
          }
          return [r, g, b, args.length > 3 ? args[3] : 1];
        };
        rgb2hsv = function() {
          var b, delta, g, h, min, r, ref, s, v;
          ref = unpack(arguments), r = ref[0], g = ref[1], b = ref[2];
          min = Math.min(r, g, b);
          max = Math.max(r, g, b);
          delta = max - min;
          v = max / 255;
          if (max === 0) {
            h = Number.NaN;
            s = 0;
          } else {
            s = delta / max;
            if (r === max) {
              h = (g - b) / delta;
            }
            if (g === max) {
              h = 2 + (b - r) / delta;
            }
            if (b === max) {
              h = 4 + (r - g) / delta;
            }
            h *= 60;
            if (h < 0) {
              h += 360;
            }
          }
          return [h, s, v];
        };
        chroma.hsv = function() {
          return (function(func, args, ctor) {
            ctor.prototype = func.prototype;
            var child = new ctor(), result = func.apply(child, args);
            return Object(result) === result ? result : child;
          })(Color, slice.call(arguments).concat(["hsv"]), function() {
          });
        };
        _input.hsv = hsv2rgb;
        Color.prototype.hsv = function() {
          return rgb2hsv(this._rgb);
        };
        num2rgb = function(num) {
          var b, g, r;
          if (type(num) === "number" && num >= 0 && num <= 16777215) {
            r = num >> 16;
            g = num >> 8 & 255;
            b = num & 255;
            return [r, g, b, 1];
          }
          console.warn("unknown num color: " + num);
          return [0, 0, 0, 1];
        };
        rgb2num = function() {
          var b, g, r, ref;
          ref = unpack(arguments), r = ref[0], g = ref[1], b = ref[2];
          return (r << 16) + (g << 8) + b;
        };
        chroma.num = function(num) {
          return new Color(num, "num");
        };
        Color.prototype.num = function(mode) {
          if (mode == null) {
            mode = "rgb";
          }
          return rgb2num(this._rgb, mode);
        };
        _input.num = num2rgb;
        _guess_formats.push({
          p: 1,
          test: function(n) {
            if (arguments.length === 1 && type(n) === "number" && n >= 0 && n <= 16777215) {
              return "num";
            }
          }
        });
        hcg2rgb = function() {
          var _c, _g, args, b, c, f, g, h, i, p, q, r, ref, ref1, ref2, ref3, ref4, ref5, t, v;
          args = unpack(arguments);
          h = args[0], c = args[1], _g = args[2];
          c = c / 100;
          g = g / 100 * 255;
          _c = c * 255;
          if (c === 0) {
            r = g = b = _g;
          } else {
            if (h === 360) {
              h = 0;
            }
            if (h > 360) {
              h -= 360;
            }
            if (h < 0) {
              h += 360;
            }
            h /= 60;
            i = floor(h);
            f = h - i;
            p = _g * (1 - c);
            q = p + _c * (1 - f);
            t = p + _c * f;
            v = p + _c;
            switch (i) {
              case 0:
                ref = [v, t, p], r = ref[0], g = ref[1], b = ref[2];
                break;
              case 1:
                ref1 = [q, v, p], r = ref1[0], g = ref1[1], b = ref1[2];
                break;
              case 2:
                ref2 = [p, v, t], r = ref2[0], g = ref2[1], b = ref2[2];
                break;
              case 3:
                ref3 = [p, q, v], r = ref3[0], g = ref3[1], b = ref3[2];
                break;
              case 4:
                ref4 = [t, p, v], r = ref4[0], g = ref4[1], b = ref4[2];
                break;
              case 5:
                ref5 = [v, p, q], r = ref5[0], g = ref5[1], b = ref5[2];
            }
          }
          return [r, g, b, args.length > 3 ? args[3] : 1];
        };
        rgb2hcg = function() {
          var _g, b, c, delta, g, h, min, r, ref;
          ref = unpack(arguments), r = ref[0], g = ref[1], b = ref[2];
          min = Math.min(r, g, b);
          max = Math.max(r, g, b);
          delta = max - min;
          c = delta * 100 / 255;
          _g = min / (255 - delta) * 100;
          if (delta === 0) {
            h = Number.NaN;
          } else {
            if (r === max) {
              h = (g - b) / delta;
            }
            if (g === max) {
              h = 2 + (b - r) / delta;
            }
            if (b === max) {
              h = 4 + (r - g) / delta;
            }
            h *= 60;
            if (h < 0) {
              h += 360;
            }
          }
          return [h, c, _g];
        };
        chroma.hcg = function() {
          return (function(func, args, ctor) {
            ctor.prototype = func.prototype;
            var child = new ctor(), result = func.apply(child, args);
            return Object(result) === result ? result : child;
          })(Color, slice.call(arguments).concat(["hcg"]), function() {
          });
        };
        _input.hcg = hcg2rgb;
        Color.prototype.hcg = function() {
          return rgb2hcg(this._rgb);
        };
        css2rgb = function(css) {
          var aa, ab, hsl, i, m2, o, rgb, w;
          css = css.toLowerCase();
          if (chroma.colors != null && chroma.colors[css]) {
            return hex2rgb(chroma.colors[css]);
          }
          if (m2 = css.match(/rgb\(\s*(\-?\d+),\s*(\-?\d+)\s*,\s*(\-?\d+)\s*\)/)) {
            rgb = m2.slice(1, 4);
            for (i = o = 0; o <= 2; i = ++o) {
              rgb[i] = +rgb[i];
            }
            rgb[3] = 1;
          } else if (m2 = css.match(/rgba\(\s*(\-?\d+),\s*(\-?\d+)\s*,\s*(\-?\d+)\s*,\s*([01]|[01]?\.\d+)\)/)) {
            rgb = m2.slice(1, 5);
            for (i = w = 0; w <= 3; i = ++w) {
              rgb[i] = +rgb[i];
            }
          } else if (m2 = css.match(/rgb\(\s*(\-?\d+(?:\.\d+)?)%,\s*(\-?\d+(?:\.\d+)?)%\s*,\s*(\-?\d+(?:\.\d+)?)%\s*\)/)) {
            rgb = m2.slice(1, 4);
            for (i = aa = 0; aa <= 2; i = ++aa) {
              rgb[i] = round(rgb[i] * 2.55);
            }
            rgb[3] = 1;
          } else if (m2 = css.match(/rgba\(\s*(\-?\d+(?:\.\d+)?)%,\s*(\-?\d+(?:\.\d+)?)%\s*,\s*(\-?\d+(?:\.\d+)?)%\s*,\s*([01]|[01]?\.\d+)\)/)) {
            rgb = m2.slice(1, 5);
            for (i = ab = 0; ab <= 2; i = ++ab) {
              rgb[i] = round(rgb[i] * 2.55);
            }
            rgb[3] = +rgb[3];
          } else if (m2 = css.match(/hsl\(\s*(\-?\d+(?:\.\d+)?),\s*(\-?\d+(?:\.\d+)?)%\s*,\s*(\-?\d+(?:\.\d+)?)%\s*\)/)) {
            hsl = m2.slice(1, 4);
            hsl[1] *= 0.01;
            hsl[2] *= 0.01;
            rgb = hsl2rgb(hsl);
            rgb[3] = 1;
          } else if (m2 = css.match(/hsla\(\s*(\-?\d+(?:\.\d+)?),\s*(\-?\d+(?:\.\d+)?)%\s*,\s*(\-?\d+(?:\.\d+)?)%\s*,\s*([01]|[01]?\.\d+)\)/)) {
            hsl = m2.slice(1, 4);
            hsl[1] *= 0.01;
            hsl[2] *= 0.01;
            rgb = hsl2rgb(hsl);
            rgb[3] = +m2[4];
          }
          return rgb;
        };
        rgb2css = function(rgba) {
          var mode;
          mode = rgba[3] < 1 ? "rgba" : "rgb";
          if (mode === "rgb") {
            return mode + "(" + rgba.slice(0, 3).map(round).join(",") + ")";
          } else if (mode === "rgba") {
            return mode + "(" + rgba.slice(0, 3).map(round).join(",") + "," + rgba[3] + ")";
          } else {
          }
        };
        rnd = function(a) {
          return round(a * 100) / 100;
        };
        hsl2css = function(hsl, alpha) {
          var mode;
          mode = alpha < 1 ? "hsla" : "hsl";
          hsl[0] = rnd(hsl[0] || 0);
          hsl[1] = rnd(hsl[1] * 100) + "%";
          hsl[2] = rnd(hsl[2] * 100) + "%";
          if (mode === "hsla") {
            hsl[3] = alpha;
          }
          return mode + "(" + hsl.join(",") + ")";
        };
        _input.css = function(h) {
          return css2rgb(h);
        };
        chroma.css = function() {
          return (function(func, args, ctor) {
            ctor.prototype = func.prototype;
            var child = new ctor(), result = func.apply(child, args);
            return Object(result) === result ? result : child;
          })(Color, slice.call(arguments).concat(["css"]), function() {
          });
        };
        Color.prototype.css = function(mode) {
          if (mode == null) {
            mode = "rgb";
          }
          if (mode.slice(0, 3) === "rgb") {
            return rgb2css(this._rgb);
          } else if (mode.slice(0, 3) === "hsl") {
            return hsl2css(this.hsl(), this.alpha());
          }
        };
        _input.named = function(name) {
          return hex2rgb(w3cx11[name]);
        };
        _guess_formats.push({
          p: 5,
          test: function(n) {
            if (arguments.length === 1 && w3cx11[n] != null) {
              return "named";
            }
          }
        });
        Color.prototype.name = function(n) {
          var h, k;
          if (arguments.length) {
            if (w3cx11[n]) {
              this._rgb = hex2rgb(w3cx11[n]);
            }
            this._rgb[3] = 1;
            this;
          }
          h = this.hex("rgb");
          for (k in w3cx11) {
            if (h === w3cx11[k]) {
              return k;
            }
          }
          return h;
        };
        lch2lab = function() {
          var c, h, l, ref;
          ref = unpack(arguments), l = ref[0], c = ref[1], h = ref[2];
          h = h * DEG2RAD;
          return [l, cos(h) * c, sin(h) * c];
        };
        lch2rgb = function() {
          var L, a, args, b, c, g, h, l, r, ref, ref1;
          args = unpack(arguments);
          l = args[0], c = args[1], h = args[2];
          ref = lch2lab(l, c, h), L = ref[0], a = ref[1], b = ref[2];
          ref1 = lab2rgb(L, a, b), r = ref1[0], g = ref1[1], b = ref1[2];
          return [r, g, b, args.length > 3 ? args[3] : 1];
        };
        lab2lch = function() {
          var a, b, c, h, l, ref;
          ref = unpack(arguments), l = ref[0], a = ref[1], b = ref[2];
          c = sqrt(a * a + b * b);
          h = (atan2(b, a) * RAD2DEG + 360) % 360;
          if (round(c * 1e4) === 0) {
            h = Number.NaN;
          }
          return [l, c, h];
        };
        rgb2lch = function() {
          var a, b, g, l, r, ref, ref1;
          ref = unpack(arguments), r = ref[0], g = ref[1], b = ref[2];
          ref1 = rgb2lab(r, g, b), l = ref1[0], a = ref1[1], b = ref1[2];
          return lab2lch(l, a, b);
        };
        chroma.lch = function() {
          var args;
          args = unpack(arguments);
          return new Color(args, "lch");
        };
        chroma.hcl = function() {
          var args;
          args = unpack(arguments);
          return new Color(args, "hcl");
        };
        _input.lch = lch2rgb;
        _input.hcl = function() {
          var c, h, l, ref;
          ref = unpack(arguments), h = ref[0], c = ref[1], l = ref[2];
          return lch2rgb([l, c, h]);
        };
        Color.prototype.lch = function() {
          return rgb2lch(this._rgb);
        };
        Color.prototype.hcl = function() {
          return rgb2lch(this._rgb).reverse();
        };
        rgb2cmyk = function(mode) {
          var b, c, f, g, k, m2, r, ref, y;
          if (mode == null) {
            mode = "rgb";
          }
          ref = unpack(arguments), r = ref[0], g = ref[1], b = ref[2];
          r = r / 255;
          g = g / 255;
          b = b / 255;
          k = 1 - Math.max(r, Math.max(g, b));
          f = k < 1 ? 1 / (1 - k) : 0;
          c = (1 - r - k) * f;
          m2 = (1 - g - k) * f;
          y = (1 - b - k) * f;
          return [c, m2, y, k];
        };
        cmyk2rgb = function() {
          var alpha, args, b, c, g, k, m2, r, y;
          args = unpack(arguments);
          c = args[0], m2 = args[1], y = args[2], k = args[3];
          alpha = args.length > 4 ? args[4] : 1;
          if (k === 1) {
            return [0, 0, 0, alpha];
          }
          r = c >= 1 ? 0 : 255 * (1 - c) * (1 - k);
          g = m2 >= 1 ? 0 : 255 * (1 - m2) * (1 - k);
          b = y >= 1 ? 0 : 255 * (1 - y) * (1 - k);
          return [r, g, b, alpha];
        };
        _input.cmyk = function() {
          return cmyk2rgb(unpack(arguments));
        };
        chroma.cmyk = function() {
          return (function(func, args, ctor) {
            ctor.prototype = func.prototype;
            var child = new ctor(), result = func.apply(child, args);
            return Object(result) === result ? result : child;
          })(Color, slice.call(arguments).concat(["cmyk"]), function() {
          });
        };
        Color.prototype.cmyk = function() {
          return rgb2cmyk(this._rgb);
        };
        _input.gl = function() {
          var i, k, o, rgb, v;
          rgb = (function() {
            var ref, results;
            ref = unpack(arguments);
            results = [];
            for (k in ref) {
              v = ref[k];
              results.push(v);
            }
            return results;
          }).apply(this, arguments);
          for (i = o = 0; o <= 2; i = ++o) {
            rgb[i] *= 255;
          }
          return rgb;
        };
        chroma.gl = function() {
          return (function(func, args, ctor) {
            ctor.prototype = func.prototype;
            var child = new ctor(), result = func.apply(child, args);
            return Object(result) === result ? result : child;
          })(Color, slice.call(arguments).concat(["gl"]), function() {
          });
        };
        Color.prototype.gl = function() {
          var rgb;
          rgb = this._rgb;
          return [rgb[0] / 255, rgb[1] / 255, rgb[2] / 255, rgb[3]];
        };
        rgb2luminance = function(r, g, b) {
          var ref;
          ref = unpack(arguments), r = ref[0], g = ref[1], b = ref[2];
          r = luminance_x(r);
          g = luminance_x(g);
          b = luminance_x(b);
          return 0.2126 * r + 0.7152 * g + 0.0722 * b;
        };
        luminance_x = function(x) {
          x /= 255;
          if (x <= 0.03928) {
            return x / 12.92;
          } else {
            return pow((x + 0.055) / 1.055, 2.4);
          }
        };
        interpolate_rgb = function(col1, col2, f, m2) {
          var xyz0, xyz1;
          xyz0 = col1._rgb;
          xyz1 = col2._rgb;
          return new Color(xyz0[0] + f * (xyz1[0] - xyz0[0]), xyz0[1] + f * (xyz1[1] - xyz0[1]), xyz0[2] + f * (xyz1[2] - xyz0[2]), m2);
        };
        _interpolators.push(["rgb", interpolate_rgb]);
        Color.prototype.luminance = function(lum, mode) {
          var cur_lum, eps, max_iter, rgba, test;
          if (mode == null) {
            mode = "rgb";
          }
          if (!arguments.length) {
            return rgb2luminance(this._rgb);
          }
          rgba = this._rgb;
          if (lum === 0) {
            rgba = [0, 0, 0, this._rgb[3]];
          } else if (lum === 1) {
            rgba = [255, 255, 255, this[3]];
          } else {
            cur_lum = rgb2luminance(this._rgb);
            eps = 1e-7;
            max_iter = 20;
            test = function(l, h) {
              var lm, m2;
              m2 = l.interpolate(h, 0.5, mode);
              lm = m2.luminance();
              if (Math.abs(lum - lm) < eps || !max_iter--) {
                return m2;
              }
              if (lm > lum) {
                return test(l, m2);
              }
              return test(m2, h);
            };
            if (cur_lum > lum) {
              rgba = test(chroma("black"), this).rgba();
            } else {
              rgba = test(this, chroma("white")).rgba();
            }
          }
          return chroma(rgba).alpha(this.alpha());
        };
        temperature2rgb = function(kelvin) {
          var b, g, r, temp;
          temp = kelvin / 100;
          if (temp < 66) {
            r = 255;
            g = -155.25485562709179 - 0.44596950469579133 * (g = temp - 2) + 104.49216199393888 * log(g);
            b = temp < 20 ? 0 : -254.76935184120902 + 0.8274096064007395 * (b = temp - 10) + 115.67994401066147 * log(b);
          } else {
            r = 351.97690566805693 + 0.114206453784165 * (r = temp - 55) - 40.25366309332127 * log(r);
            g = 325.4494125711974 + 0.07943456536662342 * (g = temp - 50) - 28.0852963507957 * log(g);
            b = 255;
          }
          return [r, g, b];
        };
        rgb2temperature = function() {
          var b, eps, g, maxTemp, minTemp, r, ref, rgb, temp;
          ref = unpack(arguments), r = ref[0], g = ref[1], b = ref[2];
          minTemp = 1e3;
          maxTemp = 4e4;
          eps = 0.4;
          while (maxTemp - minTemp > eps) {
            temp = (maxTemp + minTemp) * 0.5;
            rgb = temperature2rgb(temp);
            if (rgb[2] / rgb[0] >= b / r) {
              maxTemp = temp;
            } else {
              minTemp = temp;
            }
          }
          return round(temp);
        };
        chroma.temperature = chroma.kelvin = function() {
          return (function(func, args, ctor) {
            ctor.prototype = func.prototype;
            var child = new ctor(), result = func.apply(child, args);
            return Object(result) === result ? result : child;
          })(Color, slice.call(arguments).concat(["temperature"]), function() {
          });
        };
        _input.temperature = _input.kelvin = _input.K = temperature2rgb;
        Color.prototype.temperature = function() {
          return rgb2temperature(this._rgb);
        };
        Color.prototype.kelvin = Color.prototype.temperature;
        chroma.contrast = function(a, b) {
          var l1, l2, ref, ref1;
          if ((ref = type(a)) === "string" || ref === "number") {
            a = new Color(a);
          }
          if ((ref1 = type(b)) === "string" || ref1 === "number") {
            b = new Color(b);
          }
          l1 = a.luminance();
          l2 = b.luminance();
          if (l1 > l2) {
            return (l1 + 0.05) / (l2 + 0.05);
          } else {
            return (l2 + 0.05) / (l1 + 0.05);
          }
        };
        chroma.distance = function(a, b, mode) {
          var d, i, l1, l2, ref, ref1, sum_sq;
          if (mode == null) {
            mode = "lab";
          }
          if ((ref = type(a)) === "string" || ref === "number") {
            a = new Color(a);
          }
          if ((ref1 = type(b)) === "string" || ref1 === "number") {
            b = new Color(b);
          }
          l1 = a.get(mode);
          l2 = b.get(mode);
          sum_sq = 0;
          for (i in l1) {
            d = (l1[i] || 0) - (l2[i] || 0);
            sum_sq += d * d;
          }
          return Math.sqrt(sum_sq);
        };
        chroma.deltaE = function(a, b, L, C) {
          var L1, L2, a1, a2, b1, b2, c1, c2, c4, dH2, delA, delB, delC, delL, f, h1, ref, ref1, ref2, ref3, sc, sh, sl, t, v1, v2, v3;
          if (L == null) {
            L = 1;
          }
          if (C == null) {
            C = 1;
          }
          if ((ref = type(a)) === "string" || ref === "number") {
            a = new Color(a);
          }
          if ((ref1 = type(b)) === "string" || ref1 === "number") {
            b = new Color(b);
          }
          ref2 = a.lab(), L1 = ref2[0], a1 = ref2[1], b1 = ref2[2];
          ref3 = b.lab(), L2 = ref3[0], a2 = ref3[1], b2 = ref3[2];
          c1 = sqrt(a1 * a1 + b1 * b1);
          c2 = sqrt(a2 * a2 + b2 * b2);
          sl = L1 < 16 ? 0.511 : 0.040975 * L1 / (1 + 0.01765 * L1);
          sc = 0.0638 * c1 / (1 + 0.0131 * c1) + 0.638;
          h1 = c1 < 1e-6 ? 0 : atan2(b1, a1) * 180 / PI;
          while (h1 < 0) {
            h1 += 360;
          }
          while (h1 >= 360) {
            h1 -= 360;
          }
          t = h1 >= 164 && h1 <= 345 ? 0.56 + abs(0.2 * cos(PI * (h1 + 168) / 180)) : 0.36 + abs(0.4 * cos(PI * (h1 + 35) / 180));
          c4 = c1 * c1 * c1 * c1;
          f = sqrt(c4 / (c4 + 1900));
          sh = sc * (f * t + 1 - f);
          delL = L1 - L2;
          delC = c1 - c2;
          delA = a1 - a2;
          delB = b1 - b2;
          dH2 = delA * delA + delB * delB - delC * delC;
          v1 = delL / (L * sl);
          v2 = delC / (C * sc);
          v3 = sh;
          return sqrt(v1 * v1 + v2 * v2 + dH2 / (v3 * v3));
        };
        Color.prototype.get = function(modechan) {
          var channel, i, me, mode, ref, src;
          me = this;
          ref = modechan.split("."), mode = ref[0], channel = ref[1];
          src = me[mode]();
          if (channel) {
            i = mode.indexOf(channel);
            if (i > -1) {
              return src[i];
            } else {
              return console.warn("unknown channel " + channel + " in mode " + mode);
            }
          } else {
            return src;
          }
        };
        Color.prototype.set = function(modechan, value) {
          var channel, i, me, mode, ref, src;
          me = this;
          ref = modechan.split("."), mode = ref[0], channel = ref[1];
          if (channel) {
            src = me[mode]();
            i = mode.indexOf(channel);
            if (i > -1) {
              if (type(value) === "string") {
                switch (value.charAt(0)) {
                  case "+":
                    src[i] += +value;
                    break;
                  case "-":
                    src[i] += +value;
                    break;
                  case "*":
                    src[i] *= +value.substr(1);
                    break;
                  case "/":
                    src[i] /= +value.substr(1);
                    break;
                  default:
                    src[i] = +value;
                }
              } else {
                src[i] = value;
              }
            } else {
              console.warn("unknown channel " + channel + " in mode " + mode);
            }
          } else {
            src = value;
          }
          return chroma(src, mode).alpha(me.alpha());
        };
        Color.prototype.clipped = function() {
          return this._rgb._clipped || false;
        };
        Color.prototype.alpha = function(a) {
          if (arguments.length) {
            return chroma.rgb([this._rgb[0], this._rgb[1], this._rgb[2], a]);
          }
          return this._rgb[3];
        };
        Color.prototype.darken = function(amount) {
          var lab, me;
          if (amount == null) {
            amount = 1;
          }
          me = this;
          lab = me.lab();
          lab[0] -= LAB_CONSTANTS.Kn * amount;
          return chroma.lab(lab).alpha(me.alpha());
        };
        Color.prototype.brighten = function(amount) {
          if (amount == null) {
            amount = 1;
          }
          return this.darken(-amount);
        };
        Color.prototype.darker = Color.prototype.darken;
        Color.prototype.brighter = Color.prototype.brighten;
        Color.prototype.saturate = function(amount) {
          var lch, me;
          if (amount == null) {
            amount = 1;
          }
          me = this;
          lch = me.lch();
          lch[1] += amount * LAB_CONSTANTS.Kn;
          if (lch[1] < 0) {
            lch[1] = 0;
          }
          return chroma.lch(lch).alpha(me.alpha());
        };
        Color.prototype.desaturate = function(amount) {
          if (amount == null) {
            amount = 1;
          }
          return this.saturate(-amount);
        };
        Color.prototype.premultiply = function() {
          var a, rgb;
          rgb = this.rgb();
          a = this.alpha();
          return chroma(rgb[0] * a, rgb[1] * a, rgb[2] * a, a);
        };
        blend = function(bottom, top, mode) {
          if (!blend[mode]) {
            throw "unknown blend mode " + mode;
          }
          return blend[mode](bottom, top);
        };
        blend_f = function(f) {
          return function(bottom, top) {
            var c0, c1;
            c0 = chroma(top).rgb();
            c1 = chroma(bottom).rgb();
            return chroma(f(c0, c1), "rgb");
          };
        };
        each = function(f) {
          return function(c0, c1) {
            var i, o, out;
            out = [];
            for (i = o = 0; o <= 3; i = ++o) {
              out[i] = f(c0[i], c1[i]);
            }
            return out;
          };
        };
        normal = function(a, b) {
          return a;
        };
        multiply = function(a, b) {
          return a * b / 255;
        };
        darken = function(a, b) {
          if (a > b) {
            return b;
          } else {
            return a;
          }
        };
        lighten = function(a, b) {
          if (a > b) {
            return a;
          } else {
            return b;
          }
        };
        screen = function(a, b) {
          return 255 * (1 - (1 - a / 255) * (1 - b / 255));
        };
        overlay = function(a, b) {
          if (b < 128) {
            return 2 * a * b / 255;
          } else {
            return 255 * (1 - 2 * (1 - a / 255) * (1 - b / 255));
          }
        };
        burn = function(a, b) {
          return 255 * (1 - (1 - b / 255) / (a / 255));
        };
        dodge = function(a, b) {
          if (a === 255) {
            return 255;
          }
          a = 255 * (b / 255) / (1 - a / 255);
          if (a > 255) {
            return 255;
          } else {
            return a;
          }
        };
        blend.normal = blend_f(each(normal));
        blend.multiply = blend_f(each(multiply));
        blend.screen = blend_f(each(screen));
        blend.overlay = blend_f(each(overlay));
        blend.darken = blend_f(each(darken));
        blend.lighten = blend_f(each(lighten));
        blend.dodge = blend_f(each(dodge));
        blend.burn = blend_f(each(burn));
        chroma.blend = blend;
        chroma.analyze = function(data) {
          var len, o, r, val;
          r = {
            min: Number.MAX_VALUE,
            max: Number.MAX_VALUE * -1,
            sum: 0,
            values: [],
            count: 0
          };
          for (o = 0, len = data.length; o < len; o++) {
            val = data[o];
            if (val != null && !isNaN(val)) {
              r.values.push(val);
              r.sum += val;
              if (val < r.min) {
                r.min = val;
              }
              if (val > r.max) {
                r.max = val;
              }
              r.count += 1;
            }
          }
          r.domain = [r.min, r.max];
          r.limits = function(mode, num) {
            return chroma.limits(r, mode, num);
          };
          return r;
        };
        chroma.scale = function(colors2, positions) {
          var _classes, _colorCache, _colors, _correctLightness, _domain, _fixed, _gamma, _max, _min, _mode, _nacol, _out, _padding, _pos, _spread, _useCache, classifyValue, f, getClass, getColor, resetCache, setColors, tmap;
          _mode = "rgb";
          _nacol = chroma("#ccc");
          _spread = 0;
          _fixed = false;
          _domain = [0, 1];
          _pos = [];
          _padding = [0, 0];
          _classes = false;
          _colors = [];
          _out = false;
          _min = 0;
          _max = 1;
          _correctLightness = false;
          _colorCache = {};
          _useCache = true;
          _gamma = 1;
          setColors = function(colors3) {
            var c, col, o, ref, ref1, w;
            if (colors3 == null) {
              colors3 = ["#fff", "#000"];
            }
            if (colors3 != null && type(colors3) === "string" && chroma.brewer != null) {
              colors3 = chroma.brewer[colors3] || chroma.brewer[colors3.toLowerCase()] || colors3;
            }
            if (type(colors3) === "array") {
              if (colors3.length === 1) {
                colors3 = [colors3[0], colors3[0]];
              }
              colors3 = colors3.slice(0);
              for (c = o = 0, ref = colors3.length - 1; 0 <= ref ? o <= ref : o >= ref; c = 0 <= ref ? ++o : --o) {
                col = colors3[c];
                if (type(col) === "string") {
                  colors3[c] = chroma(col);
                }
              }
              _pos.length = 0;
              for (c = w = 0, ref1 = colors3.length - 1; 0 <= ref1 ? w <= ref1 : w >= ref1; c = 0 <= ref1 ? ++w : --w) {
                _pos.push(c / (colors3.length - 1));
              }
            }
            resetCache();
            return _colors = colors3;
          };
          getClass = function(value) {
            var i, n;
            if (_classes != null) {
              n = _classes.length - 1;
              i = 0;
              while (i < n && value >= _classes[i]) {
                i++;
              }
              return i - 1;
            }
            return 0;
          };
          tmap = function(t) {
            return t;
          };
          classifyValue = function(value) {
            var i, maxc, minc, n, val;
            val = value;
            if (_classes.length > 2) {
              n = _classes.length - 1;
              i = getClass(value);
              minc = _classes[0] + (_classes[1] - _classes[0]) * (0 + _spread * 0.5);
              maxc = _classes[n - 1] + (_classes[n] - _classes[n - 1]) * (1 - _spread * 0.5);
              val = _min + (_classes[i] + (_classes[i + 1] - _classes[i]) * 0.5 - minc) / (maxc - minc) * (_max - _min);
            }
            return val;
          };
          getColor = function(val, bypassMap) {
            var c, col, i, k, o, p, ref, t;
            if (bypassMap == null) {
              bypassMap = false;
            }
            if (isNaN(val) || val === null) {
              return _nacol;
            }
            if (!bypassMap) {
              if (_classes && _classes.length > 2) {
                c = getClass(val);
                t = c / (_classes.length - 2);
              } else if (_max !== _min) {
                t = (val - _min) / (_max - _min);
              } else {
                t = 1;
              }
            } else {
              t = val;
            }
            if (!bypassMap) {
              t = tmap(t);
            }
            if (_gamma !== 1) {
              t = pow(t, _gamma);
            }
            t = _padding[0] + t * (1 - _padding[0] - _padding[1]);
            t = Math.min(1, Math.max(0, t));
            k = Math.floor(t * 1e4);
            if (_useCache && _colorCache[k]) {
              col = _colorCache[k];
            } else {
              if (type(_colors) === "array") {
                for (i = o = 0, ref = _pos.length - 1; 0 <= ref ? o <= ref : o >= ref; i = 0 <= ref ? ++o : --o) {
                  p = _pos[i];
                  if (t <= p) {
                    col = _colors[i];
                    break;
                  }
                  if (t >= p && i === _pos.length - 1) {
                    col = _colors[i];
                    break;
                  }
                  if (t > p && t < _pos[i + 1]) {
                    t = (t - p) / (_pos[i + 1] - p);
                    col = chroma.interpolate(_colors[i], _colors[i + 1], t, _mode);
                    break;
                  }
                }
              } else if (type(_colors) === "function") {
                col = _colors(t);
              }
              if (_useCache) {
                _colorCache[k] = col;
              }
            }
            return col;
          };
          resetCache = function() {
            return _colorCache = {};
          };
          setColors(colors2);
          f = function(v) {
            var c;
            c = chroma(getColor(v));
            if (_out && c[_out]) {
              return c[_out]();
            } else {
              return c;
            }
          };
          f.classes = function(classes) {
            var d;
            if (classes != null) {
              if (type(classes) === "array") {
                _classes = classes;
                _domain = [classes[0], classes[classes.length - 1]];
              } else {
                d = chroma.analyze(_domain);
                if (classes === 0) {
                  _classes = [d.min, d.max];
                } else {
                  _classes = chroma.limits(d, "e", classes);
                }
              }
              return f;
            }
            return _classes;
          };
          f.domain = function(domain) {
            var c, d, k, len, o, ref, w;
            if (!arguments.length) {
              return _domain;
            }
            _min = domain[0];
            _max = domain[domain.length - 1];
            _pos = [];
            k = _colors.length;
            if (domain.length === k && _min !== _max) {
              for (o = 0, len = domain.length; o < len; o++) {
                d = domain[o];
                _pos.push((d - _min) / (_max - _min));
              }
            } else {
              for (c = w = 0, ref = k - 1; 0 <= ref ? w <= ref : w >= ref; c = 0 <= ref ? ++w : --w) {
                _pos.push(c / (k - 1));
              }
            }
            _domain = [_min, _max];
            return f;
          };
          f.mode = function(_m) {
            if (!arguments.length) {
              return _mode;
            }
            _mode = _m;
            resetCache();
            return f;
          };
          f.range = function(colors3, _pos2) {
            setColors(colors3, _pos2);
            return f;
          };
          f.out = function(_o) {
            _out = _o;
            return f;
          };
          f.spread = function(val) {
            if (!arguments.length) {
              return _spread;
            }
            _spread = val;
            return f;
          };
          f.correctLightness = function(v) {
            if (v == null) {
              v = true;
            }
            _correctLightness = v;
            resetCache();
            if (_correctLightness) {
              tmap = function(t) {
                var L0, L1, L_actual, L_diff, L_ideal, max_iter, pol, t0, t1;
                L0 = getColor(0, true).lab()[0];
                L1 = getColor(1, true).lab()[0];
                pol = L0 > L1;
                L_actual = getColor(t, true).lab()[0];
                L_ideal = L0 + (L1 - L0) * t;
                L_diff = L_actual - L_ideal;
                t0 = 0;
                t1 = 1;
                max_iter = 20;
                while (Math.abs(L_diff) > 0.01 && max_iter-- > 0) {
                  (function() {
                    if (pol) {
                      L_diff *= -1;
                    }
                    if (L_diff < 0) {
                      t0 = t;
                      t += (t1 - t) * 0.5;
                    } else {
                      t1 = t;
                      t += (t0 - t) * 0.5;
                    }
                    L_actual = getColor(t, true).lab()[0];
                    return L_diff = L_actual - L_ideal;
                  })();
                }
                return t;
              };
            } else {
              tmap = function(t) {
                return t;
              };
            }
            return f;
          };
          f.padding = function(p) {
            if (p != null) {
              if (type(p) === "number") {
                p = [p, p];
              }
              _padding = p;
              return f;
            } else {
              return _padding;
            }
          };
          f.colors = function(numColors, out) {
            var dd, dm, i, o, ref, result, results, samples, w;
            if (arguments.length < 2) {
              out = "hex";
            }
            result = [];
            if (arguments.length === 0) {
              result = _colors.slice(0);
            } else if (numColors === 1) {
              result = [f(0.5)];
            } else if (numColors > 1) {
              dm = _domain[0];
              dd = _domain[1] - dm;
              result = (function() {
                results = [];
                for (var o2 = 0; 0 <= numColors ? o2 < numColors : o2 > numColors; 0 <= numColors ? o2++ : o2--) {
                  results.push(o2);
                }
                return results;
              }).apply(this).map(function(i2) {
                return f(dm + i2 / (numColors - 1) * dd);
              });
            } else {
              colors2 = [];
              samples = [];
              if (_classes && _classes.length > 2) {
                for (i = w = 1, ref = _classes.length; 1 <= ref ? w < ref : w > ref; i = 1 <= ref ? ++w : --w) {
                  samples.push((_classes[i - 1] + _classes[i]) * 0.5);
                }
              } else {
                samples = _domain;
              }
              result = samples.map(function(v) {
                return f(v);
              });
            }
            if (chroma[out]) {
              result = result.map(function(c) {
                return c[out]();
              });
            }
            return result;
          };
          f.cache = function(c) {
            if (c != null) {
              _useCache = c;
              return f;
            } else {
              return _useCache;
            }
          };
          f.gamma = function(g) {
            if (g != null) {
              _gamma = g;
              return f;
            } else {
              return _gamma;
            }
          };
          f.nodata = function(d) {
            if (d != null) {
              _nacol = chroma(d);
              return f;
            } else {
              return _nacol;
            }
          };
          return f;
        };
        if (chroma.scales == null) {
          chroma.scales = {};
        }
        chroma.scales.cool = function() {
          return chroma.scale([chroma.hsl(180, 1, 0.9), chroma.hsl(250, 0.7, 0.4)]);
        };
        chroma.scales.hot = function() {
          return chroma.scale(["#000", "#f00", "#ff0", "#fff"], [0, 0.25, 0.75, 1]).mode("rgb");
        };
        chroma.analyze = function(data, key, filter) {
          var add, k, len, o, r, val, visit;
          r = {
            min: Number.MAX_VALUE,
            max: Number.MAX_VALUE * -1,
            sum: 0,
            values: [],
            count: 0
          };
          if (filter == null) {
            filter = function() {
              return true;
            };
          }
          add = function(val2) {
            if (val2 != null && !isNaN(val2)) {
              r.values.push(val2);
              r.sum += val2;
              if (val2 < r.min) {
                r.min = val2;
              }
              if (val2 > r.max) {
                r.max = val2;
              }
              r.count += 1;
            }
          };
          visit = function(val2, k2) {
            if (filter(val2, k2)) {
              if (key != null && type(key) === "function") {
                return add(key(val2));
              } else if (key != null && type(key) === "string" || type(key) === "number") {
                return add(val2[key]);
              } else {
                return add(val2);
              }
            }
          };
          if (type(data) === "array") {
            for (o = 0, len = data.length; o < len; o++) {
              val = data[o];
              visit(val);
            }
          } else {
            for (k in data) {
              val = data[k];
              visit(val, k);
            }
          }
          r.domain = [r.min, r.max];
          r.limits = function(mode, num) {
            return chroma.limits(r, mode, num);
          };
          return r;
        };
        chroma.limits = function(data, mode, num) {
          var aa, ab, ac, ad, ae, af, ag, ah, ai, aj, ak, al, am, assignments, best, centroids, cluster, clusterSizes, dist, i, j, kClusters, limits, max_log, min, min_log, mindist, n, nb_iters, newCentroids, o, p, pb, pr, ref, ref1, ref10, ref11, ref12, ref13, ref14, ref2, ref3, ref4, ref5, ref6, ref7, ref8, ref9, repeat, sum, tmpKMeansBreaks, v, value, values, w;
          if (mode == null) {
            mode = "equal";
          }
          if (num == null) {
            num = 7;
          }
          if (type(data) === "array") {
            data = chroma.analyze(data);
          }
          min = data.min;
          max = data.max;
          sum = data.sum;
          values = data.values.sort(function(a, b) {
            return a - b;
          });
          if (num === 1) {
            return [min, max];
          }
          limits = [];
          if (mode.substr(0, 1) === "c") {
            limits.push(min);
            limits.push(max);
          }
          if (mode.substr(0, 1) === "e") {
            limits.push(min);
            for (i = o = 1, ref = num - 1; 1 <= ref ? o <= ref : o >= ref; i = 1 <= ref ? ++o : --o) {
              limits.push(min + i / num * (max - min));
            }
            limits.push(max);
          } else if (mode.substr(0, 1) === "l") {
            if (min <= 0) {
              throw "Logarithmic scales are only possible for values > 0";
            }
            min_log = Math.LOG10E * log(min);
            max_log = Math.LOG10E * log(max);
            limits.push(min);
            for (i = w = 1, ref1 = num - 1; 1 <= ref1 ? w <= ref1 : w >= ref1; i = 1 <= ref1 ? ++w : --w) {
              limits.push(pow(10, min_log + i / num * (max_log - min_log)));
            }
            limits.push(max);
          } else if (mode.substr(0, 1) === "q") {
            limits.push(min);
            for (i = aa = 1, ref2 = num - 1; 1 <= ref2 ? aa <= ref2 : aa >= ref2; i = 1 <= ref2 ? ++aa : --aa) {
              p = (values.length - 1) * i / num;
              pb = floor(p);
              if (pb === p) {
                limits.push(values[pb]);
              } else {
                pr = p - pb;
                limits.push(values[pb] * (1 - pr) + values[pb + 1] * pr);
              }
            }
            limits.push(max);
          } else if (mode.substr(0, 1) === "k") {
            n = values.length;
            assignments = new Array(n);
            clusterSizes = new Array(num);
            repeat = true;
            nb_iters = 0;
            centroids = null;
            centroids = [];
            centroids.push(min);
            for (i = ab = 1, ref3 = num - 1; 1 <= ref3 ? ab <= ref3 : ab >= ref3; i = 1 <= ref3 ? ++ab : --ab) {
              centroids.push(min + i / num * (max - min));
            }
            centroids.push(max);
            while (repeat) {
              for (j = ac = 0, ref4 = num - 1; 0 <= ref4 ? ac <= ref4 : ac >= ref4; j = 0 <= ref4 ? ++ac : --ac) {
                clusterSizes[j] = 0;
              }
              for (i = ad = 0, ref5 = n - 1; 0 <= ref5 ? ad <= ref5 : ad >= ref5; i = 0 <= ref5 ? ++ad : --ad) {
                value = values[i];
                mindist = Number.MAX_VALUE;
                for (j = ae = 0, ref6 = num - 1; 0 <= ref6 ? ae <= ref6 : ae >= ref6; j = 0 <= ref6 ? ++ae : --ae) {
                  dist = abs(centroids[j] - value);
                  if (dist < mindist) {
                    mindist = dist;
                    best = j;
                  }
                }
                clusterSizes[best]++;
                assignments[i] = best;
              }
              newCentroids = new Array(num);
              for (j = af = 0, ref7 = num - 1; 0 <= ref7 ? af <= ref7 : af >= ref7; j = 0 <= ref7 ? ++af : --af) {
                newCentroids[j] = null;
              }
              for (i = ag = 0, ref8 = n - 1; 0 <= ref8 ? ag <= ref8 : ag >= ref8; i = 0 <= ref8 ? ++ag : --ag) {
                cluster = assignments[i];
                if (newCentroids[cluster] === null) {
                  newCentroids[cluster] = values[i];
                } else {
                  newCentroids[cluster] += values[i];
                }
              }
              for (j = ah = 0, ref9 = num - 1; 0 <= ref9 ? ah <= ref9 : ah >= ref9; j = 0 <= ref9 ? ++ah : --ah) {
                newCentroids[j] *= 1 / clusterSizes[j];
              }
              repeat = false;
              for (j = ai = 0, ref10 = num - 1; 0 <= ref10 ? ai <= ref10 : ai >= ref10; j = 0 <= ref10 ? ++ai : --ai) {
                if (newCentroids[j] !== centroids[i]) {
                  repeat = true;
                  break;
                }
              }
              centroids = newCentroids;
              nb_iters++;
              if (nb_iters > 200) {
                repeat = false;
              }
            }
            kClusters = {};
            for (j = aj = 0, ref11 = num - 1; 0 <= ref11 ? aj <= ref11 : aj >= ref11; j = 0 <= ref11 ? ++aj : --aj) {
              kClusters[j] = [];
            }
            for (i = ak = 0, ref12 = n - 1; 0 <= ref12 ? ak <= ref12 : ak >= ref12; i = 0 <= ref12 ? ++ak : --ak) {
              cluster = assignments[i];
              kClusters[cluster].push(values[i]);
            }
            tmpKMeansBreaks = [];
            for (j = al = 0, ref13 = num - 1; 0 <= ref13 ? al <= ref13 : al >= ref13; j = 0 <= ref13 ? ++al : --al) {
              tmpKMeansBreaks.push(kClusters[j][0]);
              tmpKMeansBreaks.push(kClusters[j][kClusters[j].length - 1]);
            }
            tmpKMeansBreaks = tmpKMeansBreaks.sort(function(a, b) {
              return a - b;
            });
            limits.push(tmpKMeansBreaks[0]);
            for (i = am = 1, ref14 = tmpKMeansBreaks.length - 1; am <= ref14; i = am += 2) {
              v = tmpKMeansBreaks[i];
              if (!isNaN(v) && limits.indexOf(v) === -1) {
                limits.push(v);
              }
            }
          }
          return limits;
        };
        hsi2rgb = function(h, s, i) {
          var args, b, g, r;
          args = unpack(arguments);
          h = args[0], s = args[1], i = args[2];
          if (isNaN(h)) {
            h = 0;
          }
          h /= 360;
          if (h < 1 / 3) {
            b = (1 - s) / 3;
            r = (1 + s * cos(TWOPI * h) / cos(PITHIRD - TWOPI * h)) / 3;
            g = 1 - (b + r);
          } else if (h < 2 / 3) {
            h -= 1 / 3;
            r = (1 - s) / 3;
            g = (1 + s * cos(TWOPI * h) / cos(PITHIRD - TWOPI * h)) / 3;
            b = 1 - (r + g);
          } else {
            h -= 2 / 3;
            g = (1 - s) / 3;
            b = (1 + s * cos(TWOPI * h) / cos(PITHIRD - TWOPI * h)) / 3;
            r = 1 - (g + b);
          }
          r = limit(i * r * 3);
          g = limit(i * g * 3);
          b = limit(i * b * 3);
          return [r * 255, g * 255, b * 255, args.length > 3 ? args[3] : 1];
        };
        rgb2hsi = function() {
          var b, g, h, i, min, r, ref, s;
          ref = unpack(arguments), r = ref[0], g = ref[1], b = ref[2];
          TWOPI = Math.PI * 2;
          r /= 255;
          g /= 255;
          b /= 255;
          min = Math.min(r, g, b);
          i = (r + g + b) / 3;
          s = 1 - min / i;
          if (s === 0) {
            h = 0;
          } else {
            h = (r - g + (r - b)) / 2;
            h /= Math.sqrt((r - g) * (r - g) + (r - b) * (g - b));
            h = Math.acos(h);
            if (b > g) {
              h = TWOPI - h;
            }
            h /= TWOPI;
          }
          return [h * 360, s, i];
        };
        chroma.hsi = function() {
          return (function(func, args, ctor) {
            ctor.prototype = func.prototype;
            var child = new ctor(), result = func.apply(child, args);
            return Object(result) === result ? result : child;
          })(Color, slice.call(arguments).concat(["hsi"]), function() {
          });
        };
        _input.hsi = hsi2rgb;
        Color.prototype.hsi = function() {
          return rgb2hsi(this._rgb);
        };
        interpolate_hsx = function(col1, col2, f, m2) {
          var dh, hue, hue0, hue1, lbv, lbv0, lbv1, res, sat, sat0, sat1, xyz0, xyz1;
          if (m2 === "hsl") {
            xyz0 = col1.hsl();
            xyz1 = col2.hsl();
          } else if (m2 === "hsv") {
            xyz0 = col1.hsv();
            xyz1 = col2.hsv();
          } else if (m2 === "hcg") {
            xyz0 = col1.hcg();
            xyz1 = col2.hcg();
          } else if (m2 === "hsi") {
            xyz0 = col1.hsi();
            xyz1 = col2.hsi();
          } else if (m2 === "lch" || m2 === "hcl") {
            m2 = "hcl";
            xyz0 = col1.hcl();
            xyz1 = col2.hcl();
          }
          if (m2.substr(0, 1) === "h") {
            hue0 = xyz0[0], sat0 = xyz0[1], lbv0 = xyz0[2];
            hue1 = xyz1[0], sat1 = xyz1[1], lbv1 = xyz1[2];
          }
          if (!isNaN(hue0) && !isNaN(hue1)) {
            if (hue1 > hue0 && hue1 - hue0 > 180) {
              dh = hue1 - (hue0 + 360);
            } else if (hue1 < hue0 && hue0 - hue1 > 180) {
              dh = hue1 + 360 - hue0;
            } else {
              dh = hue1 - hue0;
            }
            hue = hue0 + f * dh;
          } else if (!isNaN(hue0)) {
            hue = hue0;
            if ((lbv1 === 1 || lbv1 === 0) && m2 !== "hsv") {
              sat = sat0;
            }
          } else if (!isNaN(hue1)) {
            hue = hue1;
            if ((lbv0 === 1 || lbv0 === 0) && m2 !== "hsv") {
              sat = sat1;
            }
          } else {
            hue = Number.NaN;
          }
          if (sat == null) {
            sat = sat0 + f * (sat1 - sat0);
          }
          lbv = lbv0 + f * (lbv1 - lbv0);
          return res = chroma[m2](hue, sat, lbv);
        };
        _interpolators = _interpolators.concat((function() {
          var len, o, ref, results;
          ref = ["hsv", "hsl", "hsi", "hcl", "lch", "hcg"];
          results = [];
          for (o = 0, len = ref.length; o < len; o++) {
            m = ref[o];
            results.push([m, interpolate_hsx]);
          }
          return results;
        })());
        interpolate_num = function(col1, col2, f, m2) {
          var n1, n2;
          n1 = col1.num();
          n2 = col2.num();
          return chroma.num(n1 + (n2 - n1) * f, "num");
        };
        _interpolators.push(["num", interpolate_num]);
        interpolate_lab = function(col1, col2, f, m2) {
          var res, xyz0, xyz1;
          xyz0 = col1.lab();
          xyz1 = col2.lab();
          return res = new Color(xyz0[0] + f * (xyz1[0] - xyz0[0]), xyz0[1] + f * (xyz1[1] - xyz0[1]), xyz0[2] + f * (xyz1[2] - xyz0[2]), m2);
        };
        _interpolators.push(["lab", interpolate_lab]);
      }).call(exports);
    }
  });

  // src/chalks.js
  var require_chalks = __commonJS({
    "src/chalks.js"(exports, module) {
      var Layout = require_Layout();
      var Path = require_Path();
      var Parametrics = require_Parametrics();
      var Grammar = require_Grammar();
      var Points = require_Points();
      var Particles = require_ParticleSystem();
      var chroma = require_chroma();
      globalThis.chroma = chroma;
      function debug(str) {
        console.log("Chalks:", str);
      }
      var Scene = class {
        constructor(params = {}, style = {}) {
          this.start = Date.now();
          this.scale = params.scale || 1;
          if (params.width && params.height) {
            this.width = params.width * this.scale;
            this.height = params.height * this.scale;
            this.p5canvas = createCanvas(this.width, this.height);
            debug(`creating canvas ${this.width}x${this.height}`);
          } else {
            this.width = params.width * this.scale || p5.instance.canvas.width;
            this.height = params.height * this.scale || p5.instance.canvas.height;
            this.p5canvas = p5.instance.canvas;
            debug(`reusing existing canvas ${this.width}x${this.height}`);
          }
          this.canvas = p5.instance.canvas;
          this.ctx = this.canvas.getContext("2d");
          this.seed = params.seed ? params.seed : (Math.random() * 1e4).toString().substr(5, 8);
          debug("using seed=" + this.seed);
          randomSeed(this.seed);
          this.drawBackground(this.width, this.height, style);
          this._modules();
        }
        /**
         * Modules exported from chalks.js module
         */
        _modules() {
          this.Layout = Layout;
          this.Path = Path;
          this.Parametrics = Parametrics;
          this.Grammar = Grammar;
          this.Points = Points;
          this.Particles = Particles;
        }
        drawBackground(width, height, style) {
          this.ctx.fillStyle = style.fill || "white";
          this.ctx.fillRect(0, 0, width, height);
          this.ctx.fillStyle = "black";
        }
        /**
         * Sets the style of the background object
         * @param {object} style 
         */
        setStyle(style) {
          this.drawBackground(this.width, this.height, style);
        }
        /**
         * Returns a new path with the provided style
         * @param {object} style 
         */
        path(style) {
          return new Path(this, style);
        }
        /**
         * Creates a linear gradient object from p0 to p1 position
         * @param {object} p0 - xy object
         * @param {object} p1 - xy object
         * @param {array} stops - list of stop values [{num, color}]
         * @example ch.lgrad ({x:0,y:0}, {x:100,y:100}, [{num:50, color:"black"}, {num:60, color:"green"}])
         * @see [createLinearGradient](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/createLinearGradient)
         */
        lgrad(p0, p1, stops) {
          let grad = this.ctx.createLinearGradient(p0.x, p0.y, p1.x, p1.y);
          stops.forEach((c) => grad.addColorStop(c[0], c[1]));
          return grad;
        }
        /**
         * Creates a radial gradient
         * @param {object} p0 - xy object
         * @param {object} r0 - xy object
         * @param {object} p1 - xy object
         * @param {object} r1 -  xy object
         * @param {object} colors - list of stop values [{num, color}]
         * @see [createRadialGradient](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/createRadialGradient)
         */
        rgrad(p0, r0, p1, r1, colors) {
          let grad = this.ctx.createRadialGradient(p0.x, p0.y, r0, p1.x, p1.y, r1);
          colors.forEach((c) => grad.addColorStop(c[0], c[1]));
          return grad;
        }
        /**
         * Draw the canvas number of times as provided in loops
         * @param {number} loops 
         * @param {String} targetFile - target PNG file to save the canvas
         */
        draw(targetFile) {
          this.ctx.imageSmoothingQuality = "high";
          this.ctx.save();
          if (this.clipped) {
            this.ctx.clip(this.clipped);
          }
          debug("ended (" + (Date.now() - this.start) / 1e3 + " secs)");
          if (targetFile) {
            saveCanvas(this.p5canvas, targetFile, "png");
          }
          this.ctx.restore();
          noLoop();
        }
        /**
         * Clips the Canvas to the given square regin
         * @param {number} x - x initial position 
         * @param {number} y - y initial position
         * @param {number} w - width of the clipping region
         * @param {number} h - height of the clipping region
         */
        clipTo(x, y, w, h) {
          let region = new Path2D();
          region.rect(x, y, w, h);
          this.clipped = region;
        }
      };
      p5.Vector.prototype.cadd = function(x, y, z) {
        let vx = typeof x === "function" ? x() : x || 0;
        let vy = typeof y === "function" ? y() : y || 0;
        let vz = typeof z === "function" ? z() : z || 0;
        return createVector(this.x, this.y, this.z).add(vx, vy, vz);
      };
      p5.prototype.r = function(x, y, z) {
        return random(x, y, z);
      };
      p5.prototype.vector = function(x, y, z) {
        return createVector(x, y, z);
      };
      module.exports = Scene;
    }
  });
  return require_chalks();
})();
/**
* @license
* Copyright 2019 Ruben Afonso, rubenaf.com
* This source code is licensed under the Apache license (see LICENSE file)
**/
/**
* @license

* Copyright 2019 Ruben Afonso, rubenaf.com
* This source code is licensed under the Apache license (see LICENSE file)
**/
/**
 * @license
 * Copyright 2019 Ruben Afonso, rubenaf.com
 * This source code is licensed under the Apache license (see LICENSE file)
 **/
/*! Bundled license information:

voronoi/rhill-voronoi-core.js:
  (*!
  Copyright (C) 2010-2013 Raymond Hill: https://github.com/gorhill/Javascript-Voronoi
  MIT License: See https://github.com/gorhill/Javascript-Voronoi/LICENSE.md
  *)

chroma-js/chroma.js:
  (**
   * @license
   *
   * chroma.js - JavaScript library for color conversions
   * 
   * Copyright (c) 2011-2017, Gregor Aisch
   * All rights reserved.
   * 
   * Redistribution and use in source and binary forms, with or without
   * modification, are permitted provided that the following conditions are met:
   * 
   * 1. Redistributions of source code must retain the above copyright notice, this
   *    list of conditions and the following disclaimer.
   * 
   * 2. Redistributions in binary form must reproduce the above copyright notice,
   *    this list of conditions and the following disclaimer in the documentation
   *    and/or other materials provided with the distribution.
   * 
   * 3. The name Gregor Aisch may not be used to endorse or promote products
   *    derived from this software without specific prior written permission.
   * 
   * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
   * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
   * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
   * DISCLAIMED. IN NO EVENT SHALL GREGOR AISCH OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT,
   * INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING,
   * BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
   * DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY
   * OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
   * NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
   * EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
   *
   *)
  (**
  	ColorBrewer colors for chroma.js
  
  	Copyright (c) 2002 Cynthia Brewer, Mark Harrower, and The 
  	Pennsylvania State University.
  
  	Licensed under the Apache License, Version 2.0 (the "License"); 
  	you may not use this file except in compliance with the License.
  	You may obtain a copy of the License at	
  	http://www.apache.org/licenses/LICENSE-2.0
  
  	Unless required by applicable law or agreed to in writing, software distributed
  	under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
  	CONDITIONS OF ANY KIND, either express or implied. See the License for the
  	specific language governing permissions and limitations under the License.
  
      @preserve
   *)
*/
