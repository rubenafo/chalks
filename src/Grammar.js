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

  run (startFun, setupFun, it=10) {
    this.stop = it
    this.it = 0
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
    runStart()
  }

  take (...functionNames) {
    if (this.it < this.stop) {
      this.it++;
      let funName = random (functionNames)
      if (funName in this.branches)
        this.branches[funName].fun()
        //this.fns.push(this.branches[funName])
      else
        throw ("Grammar error: " + funName + " method not found. Did you add() it to the grammar?")
    }
    else
      console.log("Stopped after " + this.stop + " iterations")
  }
}

module.exports = Grammar
