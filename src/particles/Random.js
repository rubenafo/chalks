
"use strict";

const E = Math.E;
const PI = Math.PI;
const PI_2 = PI / 2;

class Random {

    constructor (seed) {
      if (typeof(seed) === "string") {
        var i = seed.length;
        this.seed = 0;
        while (i--) {
          this.seed += seed.charCodeAt(i);
        }
      }
      else
        this.seed = seed !== undefined ? seed : Math.random();
    }

    setSeed (seed) {
      if (seed)
        this.seed = seed;
    }

    random (lower, upper) {
      var x = Math.sin(this.seed++) * 10000;
      if (upper === undefined) {
        if (lower === undefined) { // both undefined, assume (0,1)
          return x - Math.floor(x);
        }
        else { // we only have lower, assume (0,lower)
          return (x - Math.floor(x)) * lower;
        }
      }
      else {
        return lower + ((x - Math.floor(x)) * (upper-lower))
      }
    }

	rint (lower, upper) {
		return Math.round(this.random(lower, upper));
	}

    arcsine (min, max) {
        var q = Math.sin(PI_2 * this.uniform(0, 1));

        return min + (max - min) * q * q;
    };

    beta (v, w, min, max) {
        if (v < w) {
            return max - (max - min) * this.beta(w, v, 0, 1);
        }
        var y1 = this.gamma(0, 1, v),
            y2 = this.gamma(0, 1, w);

        return min + (max - min) * y1 / (y1 + y2);
    };

    cauchy (a, b) {
      return a + b * Math.tan(PI * this.uniform(-0.5, 0.5))
    };

     chiSquare (df) {
        return this.gamma(0, 2, 0.5 * df);
    };

     cosine (min, max) {
        var a = 0.5 * (min + max),
            b = (max - min) / PI;

        return a + b * Math.asin(this.uniform(-1, 1));
    };

     doubleLog (min, max) {
        var a = 0.5 * (min + max),
            b = 0.5 * (max - min);
        if (this.bernoulli(0.5) === 0) {
            b = -b;
        }

        return a + b * this.uniform(0, 1) * this.uniform(0, 1);
    };

     erlang (b, c) {
        var prod = 1.0;
        var i = 1;

        for (i = 1; i < c; i++) {
            prod *= this.uniform(0, 1);
        }

        return -b * Math.log(prod);
    };

     exponential (a, b) {
        return a - b * Math.log(this.uniform(0, 1));
    };

     extremeValue (a, b) {
        return a + b * Math.log(-Math.log(this.uniform(0, 1)));
    };

     fRatio (v, w) {
        return (this.chiSquare(v) / v) / (this.chiSquare(w) / w);
    };

     gamma (a, b, c) {
        var A = 1 / Math.sqrt(2 * c - 1),
            B = c - Math.log(4),
            Q = c + 1 / A,
            T = 4.5,
            D = 1 + Math.log(T),
            C = 1 + c / E;

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
        } else if (c == 1.0) {
            return this.exponential(a, b);
        } else {
            while (true) {
                var p1 = this.uniform(0, 1),
                    p2 = this.uniform(0, 1),
                    v = A * Math.log(p1 / (1 - p1)),
                    y = c * Math.exp(v),
                    z = p1 * p1 * p2,
                    w = B + Q * v - y;
                if (w + D - T * z > 0 || w >= Math.log(z)) {
                    return a + b * y
                }
            }
        }
    };

     laplace (a, b) {
        if (this.bernoulli(0.5) == 1) {
            return a + b * Math.log(this.uniform(0, 1));
        } else {
            return a - b * Math.log(this.uniform(0, 1));
        }
    };

     logarithmic (min, max) {
        var a = min,
            b = max - min;

        return a + b * this.uniform(0, 1) * this.uniform(0, 1);
    };

     logistic (a, b) {
        return a - b * Math.log(1 / this.uniform(0, 1) - 1);
    };

     lognormal (a, mu, sigma) {
        return a + Math.exp(this.normal(mu, sigma));
    };

     normal (mu, sigma) {
        var p , p1, p2;
        do {
            p1 = this.uniform(-1, 1);
            p2 = this.uniform(-1, 1);
            p = p1 * p1 + p2 * p2;
        } while (p >= 1);

        return mu + sigma * p1 * Math.sqrt(-2 * Math.log(p) / p);
    };

     parabolic (min ,max) {
        var parabola = function (x, min, max) {
            if (x < min || x > max) {
                return 0.0;
            }

            var a = 0.5 * (min + max),
                b = 0.5 * (max - min),
                yMax = 3 / (4 * b);

            return yMax * (1 - (x - a) * (x - a) / (b * b));
        };

        var a = 0.5 * (min  + max),
            yMax = parabola(a, min + max);

        return this.userSpecified(parabola, min ,max, 0, yMax);
    };

     pareto (c) {
        return Math.pow(this.uniform(0, 1), -1 / c);
    };

     pearson5 (b, c) {
        return 1 / this.gamma(0, 1 / b, c);
    };

     pearson6 (b, v, w) {
        return this.gamma(0, b, v) / this.gamma(0, b, w);
    };

     power (c) {
        return Math.pow(this.uniform(0, 1), 1 / c);
    };

     rayleigh (a, b) {
        return a + b * Math.sqrt(-Math.log(this.uniform(0, 1)));
    };

     studentT (df) {
        return this.normal(0, 1) / Math.sqrt(this.chiSquare(df) / df);
    };

     triangular (min, max, c) {
        var p = this.uniform(0, 1),
            q = 1 - p;
        if (p <= (c - min) / (max - min)) {
            return min + Math.sqrt((max - min) * (c - min) * p);
        } else {
            return max - Math.sqrt((max - min) * (max - c) * q);
        }
    };

     uniform (min, max) {
        var init = this.seed !== undefined? this.random() : Math.random();
        return min + (max - min) * init;
    };

     userSpecified (usf, xMin, xMax, yMin, yMax) {
        var x,
            y,
            areaMax = (xMax - xMin) * (yMax - yMin);

        do {
            x = this.uniform(0, areaMax) / (yMax - yMin) + xMin;
            y = this.uniform(yMin, yMax);
        } while (y > usf(x, xMin, xMax));
        return x;
    };

     weibull (a, b, c) {
        return a + b * Math.pow(-Math.log(this.uniform(0, 1)), 1 / c);
    };

     bernoulli (p) {
        return this.uniform(0, 1) < p ? 0 : 1;
    };

     binomial (n, p) {
        var sum = 0;
        for (var i = 0; i < n; i++) {
            sum += this.bernoulli(p);
        }

        return sum;
    };

     geometric (p) {
        return Math.floor(Math.log(this.uniform(0, 1)) / Math.log(1 - p));
    };

     hypergeometric (n, N, K) {
        var count = 0;
        for (var i = 0; i < n; i++, N--) {
            var p = K / N;
            if (this.bernoulli(p)) {
                count++;
                K--;
            }
        }

        return count;
    };

     negativeBinomial (s, p) {
        var sum = 0;
        for (var i = 0; i < s; i++) {
            sum += this.geometric(p);
        }

        return sum;
    };

     pascal (s, p) {
        return this.negativeBinomial(s, p) + s;
    };

     poisson (mu) {
        var b = 1;
        for (var i = 0; b >= Math.exp(-mu); i++) {
            b *= this.uniform(0, 1);
        }

        return i - 1;
    };

     uniformDiscrete (i, j) {
        return i + Math.floor((j - i + 1) * this.uniform(0, 1));
    };
};

module.exports.Random = Random;
