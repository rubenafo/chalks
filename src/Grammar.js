/**
* @license
* Copyright 2019 Ruben Afonso, rubenaf.com
* This source code is licensed under the Apache license (see LICENSE file)
**/

"use strict";

class Grammar {

  constructor (f) {
    f()
    this.branches = {}; // name -> {p, fun}
  }

  add (weight, branchFun) {
    this.branches[branchFun.name] = {p: weight, fun:branchFun}
    return this
  }

  run (start, it=10) {
    this.stop = it
    this.it = 0
    let runStart = undefined
    if (start instanceof Function) {
      runStart = start
    }
    else {
      runStart = this.branches[start]
      if (!runStart)
        throw ("Grammar error: " + start + " function not found. Did you add() it to the grammar?")
      runStart = runStart.fun
    }
    runStart()
  }

  take (...functionNames) {
    if (this.it < this.stop) {
      this.it++;
      let funName = random (functionNames)
      if (funName in this.branches)
        this.branches[funName].fun()
      else
        throw ("Grammar error: " + funName + " function not found. Did you add() it to the grammar?")
    }
    else
      console.log("Stopped after " + this.stop + " iterations")
  }
}

module.exports = Grammar
