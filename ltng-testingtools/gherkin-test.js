const { color } = require('./colours')

const stepDefinitions = []
const features = []

function Given(pattern, fn) {
	stepDefinitions.push({ pattern, fn, type: "Given" })
}

function When(pattern, fn) {
	stepDefinitions.push({ pattern, fn, type: "When" })
}

function Then(pattern, fn) {
	stepDefinitions.push({ pattern, fn, type: "Then" })
}

function Feature(name, fn) {
	const feature = { name, scenarios: [] }
	features.push(feature)

	const currentFeature = feature

	// Global Scenario function that adds to the current feature
	global.Scenario = (name, body) => {
		currentFeature.scenarios.push({ name, body })
	}

	fn()
}

async function run() {
	console.log(color("\n=== Running Gherkin-like Tests ===\n", "magenta"))

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

	let passed = 0
	let failed = 0

	for (const feature of features) {
		// Check if any scenario in this feature matches, or if the feature name matches
		// For simplicity, we'll just filter scenarios, but if a feature has no matching scenarios, we might skip printing it?
		// Let's filter scenarios first.
		const matchingScenarios = feature.scenarios.filter(s =>
			!filterRegex || filterRegex.test(s.name) || filterRegex.test(feature.name)
		)

		if (matchingScenarios.length === 0) continue

		console.log(color(`Feature: ${feature.name}`, "blue"))

		for (const scenario of matchingScenarios) {
			console.log(color(`  Scenario: ${scenario.name}`, "cyan"))
			let scenarioFailed = false

			// Parse the body string into steps
			const lines = scenario.body
				.split("\n")
				.map((l) => l.trim())
				.filter((l) => l.length > 0)

			const context = {} // Shared context for steps in a scenario

			for (const line of lines) {
				let matchFound = false
				// Strip keyword (Given, When, Then, And, But) to match the step definition
				const cleanLine = line.replace(/^(Given|When|Then|And|But)\s+/i, "")

				for (const stepDef of stepDefinitions) {
					// Simple regex matching or string matching
					// We'll assume the pattern can be a string or regex
					let match
					if (typeof stepDef.pattern === "string") {
						if (cleanLine === stepDef.pattern) {
							match = []
						} else if (cleanLine.startsWith(stepDef.pattern)) {
							// Basic parameter extraction if needed
						}
					} else if (stepDef.pattern instanceof RegExp) {
						match = cleanLine.match(stepDef.pattern)
					}

					if (match) {
						matchFound = true
						try {
							// Pass context and captured groups
							const args = match.slice(1)
							await stepDef.fn(context, ...args)
							console.log(color(`    ${color("✔", "green")} ${line}`, "gray"))
						} catch (e) {
							console.error(
								color(`    ${color("✘", "red")} ${line} \n      Error: ${e.message}`, "red")
							)
							scenarioFailed = true
						}
						break // Stop looking for definitions for this line
					}
				}

				if (!matchFound) {
					console.error(color(`    ? Undefined step: ${line}`, "yellow"))
					scenarioFailed = true
				}

				if (scenarioFailed) break
			}

			if (scenarioFailed) {
				failed++
			} else {
				passed++
			}
		}
	}

	console.log(color("\n=== Summary ===", "magenta"))
	console.log(`Total Scenarios: ${passed + failed}`)
	console.log(color(`Passed:          ${passed}`, "green"))
	console.log(color(`Failed:          ${failed}`, failed > 0 ? "red" : "green"))

	if (failed > 0) {
		process.exitCode = 1
	}
}

module.exports = {
	Feature,
	Given,
	When,
	Then,
	run,
}
