/**
* @license
* Copyright 2019 Ruben Afonso, rubenaf.com
* This source code is licensed under the Apache license (see LICENSE file)
**/

class Rnd {

  geo (p) {
    return Math.floor(Math.log(random(0,10)) / Math.log(1-p))
  }

  normal (mu, sigma) {
    var p , p1, p2;
    do {
      p1 = random(-1, 1);
      p2 = random(-1, 1);
      p = p1 * p1 + p2 * p2;
    }
    while (p >= 1);
    return mu + sigma * p1 * Math.sqrt(-2 * Math.log(p) / p);
  }
}

module.exports.Rnd = Rnd
