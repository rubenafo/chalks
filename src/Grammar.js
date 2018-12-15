/**
* @license
* Copyright 2019 Ruben Afonso, rubenaf.com
* This source code is licensed under the Apache license (see LICENSE file)
**/

"use strict";

class Grammar {

  constructor () {
    this.branches = {}; // name -> {p, fun}
    this.fns = [] // stores the function calls
  }

  add (weight, branchFun) {
    this.branches[branchFun.name] = {p: weight, fun:branchFun}
    return this
  }

  run (startFun, setupFun, it=10, debug=false) {
    this.stop = it
    this.it = 0
    this.debug = debug
    if (setupFun)
      setupFun()
    let runStart = undefined
    if (startFun instanceof Function) {
      runStart = startFun
    }
    else {
      runStart = this.branches[startFun]
      if (!runStart)
        throw ("Grammar error: " + runStart + " method not found. Did you add() it to the grammar?")
      runStart = runStart.fun
    }
    if (this.debug)
      console.log("Starting grammar with " + runStart.name)
    this.fns.push(runStart)
    while (this.fns.length > 0) {
      let next = this.fns.shift()
      next()
    }
  }

  take (...functionNames) {
    if (this.it < this.stop) {
      let funName = random (functionNames)
      if (typeof(funName) === "function")
      {
        this.it++
        this.fns.push(funName)
      }
      else {
        if (funName in this.branches) {
          if (this.debug)
            console.log("Branching to " + this.branches[funName].fun.name)
          this.it++
          this.fns.push(this.branches[funName].fun)
        }
        else
          throw ("Grammar error: " + funName + " method not found. Did you add() it to the grammar?")
      }
    }
    else
      console.log("Stopped after " + this.stop + " iterations")
  }
}

module.exports = Grammar
