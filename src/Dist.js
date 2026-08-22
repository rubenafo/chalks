/**
* @license
* Copyright 2019 Ruben Afonso, rubenaf.com
* This source code is licensed under the Apache license (see LICENSE file)
**/

"use strict";

/**
 * @classdesc Seedable statistical distributions. Every method returns a single
 * generated value.
 *
 * Each instance owns its own seeded stream, independent of p5's global
 * random() and of the particle system's Random. The generator is mulberry32,
 * built only from integer operations (Math.imul, shifts, xor), so a given seed
 * produces exactly the same sequence in every browser and Node version --
 * unlike Math.sin-based generators, whose precision is implementation-defined.
 *
 * @example
 * let d = new Dist(42)
 * d.uniform(0, 100)   // 0 <= v < 100
 * d.normal(50, 10)    // mean 50, standard deviation 10
 * d.exp(0.5)          // exponential, mean 1/0.5 = 2
 * @class
 */
class Dist {

  /**
   * @param {number|string} [seed] - seed value. Omit for a random one, which
   *                                 is then readable at `.seed` so a run can
   *                                 be reproduced later.
   */
  constructor (seed) {
    this.setSeed(seed);
  }

  /**
   * Reseeds the stream and returns this. Also clears any half-used internal
   * state, so the same seed always replays the exact same sequence.
   * @param {number|string} [seed] - seed value, random if omitted
   * @return {Dist} this, for chaining
   */
  setSeed (seed) {
    if (seed === undefined)
      seed = Math.floor(Math.random() * 4294967296);
    this.seed = seed;
    this._state = typeof(seed) === "string" ? Dist._hash(seed) : (Math.floor(seed) | 0);
    // normal() draws two variates at a time; drop any cached one so that
    // reseeding is a full reset rather than leaving a stale value behind.
    this._spare = undefined;
    return this;
  }

  // Hashes a string seed into a 32 bit integer. Order sensitive, so "ab" and
  // "ba" seed different streams.
  static _hash (str) {
    let h = 2166136261;
    for (let i = 0; i < str.length; i++) {
      h ^= str.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return h | 0;
  }

  // mulberry32: one uniform value in [0,1). Integer ops only.
  _next () {
    this._state = (this._state + 0x6D2B79F5) | 0;
    let t = this._state;
    t = Math.imul(t ^ (t >>> 15), 1 | t);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }

  /**
   * Uniform distribution. Mirrors p5's random() argument handling.
   * @param {number} [min] - lower bound, or the upper bound if max is omitted
   * @param {number} [max] - upper bound
   * @return {number} uniform value: [0,1) with no args, [0,min) with one, [min,max) with two
   */
  uniform (min, max) {
    let u = this._next();
    if (min === undefined) return u;
    if (max === undefined) return u * min;
    return min + u * (max - min);
  }

  /**
   * Normal (Gaussian) distribution, via the Marsaglia polar method.
   * @param {number} [mu=0] - mean
   * @param {number} [sigma=1] - standard deviation
   * @return {number} a normally distributed value
   */
  normal (mu = 0, sigma = 1) {
    if (this._spare !== undefined) { // polar method yields two at a time
      let value = this._spare;
      this._spare = undefined;
      return mu + sigma * value;
    }
    let p1, p2, p;
    do {
      p1 = this.uniform(-1, 1);
      p2 = this.uniform(-1, 1);
      p = p1 * p1 + p2 * p2;
    } while (p >= 1 || p === 0); // p === 0 would make the log below infinite
    let factor = Math.sqrt(-2 * Math.log(p) / p);
    this._spare = p2 * factor;
    return mu + sigma * p1 * factor;
  }

  /**
   * Gaussian distribution. Alias of {@link Dist#normal} -- "gauss" and
   * "normal" name the same distribution.
   * @param {number} [mu=0] - mean
   * @param {number} [sigma=1] - standard deviation
   * @return {number} a normally distributed value
   */
  gauss (mu = 0, sigma = 1) {
    return this.normal(mu, sigma);
  }

  /**
   * Exponential distribution, via inverse transform sampling.
   * @param {number} [lambda=1] - rate parameter, must be > 0. The mean is 1/lambda.
   * @return {number} a non-negative exponentially distributed value
   */
  exp (lambda = 1) {
    if (!(lambda > 0))
      throw ("Dist error: exp() needs a rate lambda > 0, got " + lambda);
    // 1 - u lands in (0,1], so the log is always finite
    return -Math.log(1 - this._next()) / lambda;
  }

  /**
   * Exponential distribution. Alias of {@link Dist#exp}.
   * @param {number} [lambda=1] - rate parameter, must be > 0
   * @return {number} a non-negative exponentially distributed value
   */
  exponential (lambda = 1) {
    return this.exp(lambda);
  }
}

module.exports = Dist;
