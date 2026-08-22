require("./helpers/p5-stub")
let assert = require("assert")
let Grammar = require("../src/Grammar.js")

describe("Grammar", () => {
  it("run() invokes a raw function passed as the start rule", () => {
    let g = new Grammar()
    let called = false
    g.run(() => { called = true }, null, 5)
    assert.strictEqual(called, true)
  })

  it("run() calls the setup function once before starting", () => {
    let g = new Grammar()
    let order = []
    g.run(() => order.push("start"), () => order.push("setup"), 5)
    assert.deepStrictEqual(order, ["setup", "start"])
  })

  it("run() dispatches a string start rule via add()", () => {
    let g = new Grammar()
    let called = false
    function begin() { called = true }
    g.add(1, begin)
    g.run("begin", null, 5)
    assert.strictEqual(called, true)
  })

  it("run() throws when the named start rule was never add()ed", () => {
    let g = new Grammar()
    assert.throws(() => g.run("missing", null, 5))
  })

  it("take() enqueues a single function candidate directly, without add()", () => {
    let g = new Grammar()
    let calls = []
    function start() {
      g.take(() => calls.push("a"))
    }
    g.run(start, null, 5)
    assert.deepStrictEqual(calls, ["a"])
  })

  it("take() stops enqueuing once the iteration budget is exhausted", () => {
    let g = new Grammar()
    let calls = 0
    function recurse() {
      calls++
      g.take(recurse)
    }
    g.run(recurse, null, 4)
    // budget of 4 take() acceptances, plus the initial start call itself
    assert.strictEqual(calls, 5)
  })

  it("take() throws for a branch name that was never add()ed", () => {
    let g = new Grammar()
    assert.throws(() => {
      g.run(() => g.take("neverAdded"), null, 5)
    })
  })
})
