const { color } = require("./colours")

const tests = []
let currentSuite = ""

function Group(name, fn) {
  const previousSuite = currentSuite
  currentSuite = name
  fn()
  currentSuite = previousSuite
}

function Test(name, fn) {
  const testName = currentSuite ? `[${currentSuite}] ${name}` : name
  tests.push({ name: testName, fn })
}

async function run() {
  let passed = 0
  let failed = 0
  let skipped = 0

  // Parse arguments for filtering
  const args = process.argv.slice(2)
  let filterRegex = null
  const runIndex = args.indexOf("--run")
  if (runIndex !== -1 && args[runIndex + 1]) {
    try {
      filterRegex = new RegExp(args[runIndex + 1])
    } catch (e) {
      console.error(color(`Invalid filter regex: ${e.message}`, "red"))
      process.exit(1)
    }
  }

  console.log(color("\n=== Running Go-like Tests ===\n", "cyan"))

  for (const test of tests) {
    if (filterRegex && !filterRegex.test(test.name)) {
      console.log(color(`    [SKIP] ${test.name}: Filtered out`, "yellow"))
      skipped++
      continue
    }

    let isFailed = false
    let isSkipped = false

    const t = {
      name: test.name,
      Assert: (condition, msg) => {
        if (!condition) {
          console.error(
            color(`    [FAIL] ${test.name}: ${msg || "Assertion failed"}`, "red")
          )
          isFailed = true
        }
      },
      Equal: (actual, expected, msg) => {
        if (actual !== expected) {
          console.error(
            color(
              `    [FAIL] ${test.name}: ${msg || "Equality check failed"}\n      Expected: ${expected}\n      Actual:   ${actual}`,
              "red"
            )
          )
          isFailed = true
        }
      },
      Fail: () => {
        isFailed = true
      },
      Skip: (msg) => {
        console.log(color(`    [SKIP] ${test.name}: ${msg || ""}`, "yellow"))
        isSkipped = true
      },
      Log: (...args) => {
        console.log(`    [LOG]`, ...args)
      },
    }

    try {
      await test.fn(t)
    } catch (e) {
      console.error(color(`    [ERROR] ${test.name}: ${e.message}`, "red"))
      isFailed = true
    }

    if (isSkipped) {
      skipped++
    } else if (isFailed) {
      failed++
      console.log(color(`FAIL: ${test.name}`, "red"))
    } else {
      passed++
      console.log(color(`PASS: ${test.name}`, "green"))
    }
  }

  console.log(color("\n=== Summary ===", "cyan"))
  console.log(`Total:   ${tests.length}`)
  console.log(color(`Passed:  ${passed}`, "green"))
  console.log(color(`Failed:  ${failed}`, failed > 0 ? "red" : "green"))
  console.log(color(`Skipped: ${skipped}`, skipped > 0 ? "yellow" : "gray"))

  if (failed > 0) {
    process.exitCode = 1
  }
}

module.exports = {
  Test,
  Group,
  run,
}
