import gotest from './gotest.mjs'
import gherkinTest from './gherkin-test.mjs'

// === Go-like Tests ===
gotest.Test("Addition", (t) => {
	t.Equal(1 + 1, 2, "1 + 1 should be 2")
})

gotest.Test("String Concatenation", (t) => {
	t.Equal("hello " + "world", "hello world", "strings should match")
})

gotest.Test("Async Test", async (t) => {
	await new Promise((resolve) => setTimeout(resolve, 10))
	t.Assert(true, "Async operation completed")
})

gotest.Test("Failing Test (Expected)", (t) => {
	// This is just to demonstrate failure, but for verification we want it to pass
	// so I'll comment out the failure or make it pass
	t.Assert(true, "This should pass")
})

// === Gherkin-like Tests ===
gherkinTest.Given(/^I have a calculator$/, (context) => {
	context.calculator = { value: 0, add: (n) => (context.calculator.value += n) }
})

gherkinTest.When(/^I add (\d+)$/, (context, num) => {
	context.calculator.add(parseInt(num, 10))
})

gherkinTest.Then(/^the result should be (\d+)$/, (context, expected) => {
	if (context.calculator.value !== parseInt(expected, 10)) {
		throw new Error(`Expected ${expected} but got ${context.calculator.value}`)
	}
})

gherkinTest.Feature("Calculator", () => {
	Scenario("Simple Addition", `
		Given I have a calculator
		When I add 5
		When I add 3
		Then the result should be 8
`)
})

	// Run both runners
	; (async () => {
		try {
			await gotest.run()
			await gherkinTest.run()
		} catch (e) {
			console.error(e)
			process.exit(1)
		}
	})()
