# ltng-testingtools

A lightweight testing library for the `ltng-framework`, providing both Go-style and Gherkin-style (BDD) testing capabilities.

## Installation

This package is part of the `ltng-framework` monorepo. You can import it directly from the source.

```javascript
import { Test, Group, run as runGoTests } from './path/to/ltng-testingtools/gotest.mjs';
import { Feature, Given, When, Then, run as runGherkinTests } from './path/to/ltng-testingtools/gherkin-test.mjs';
// OR import everything
import testing from './path/to/ltng-testingtools/index.mjs';
```

## Go-style Testing (`gotest.mjs`)

Designed to feel familiar to Go developers.

### Usage

```javascript
import gotest from './gotest.mjs';

gotest.Test("Addition", (t) => {
    t.Equal(1 + 1, 2, "1 + 1 should be 2");
});

gotest.Test("Async Test", async (t) => {
    await someAsyncOp();
    t.Assert(true, "Async operation succeeded");
});

// Run the tests
gotest.run();
```

### API

- **`Test(name, fn)`**: Defines a test case. `fn` receives a `t` object.
- **`Group(name, fn)`**: Groups tests under a suite name.
- **`run()`**: Executes all defined tests.

#### `t` Object Methods
- `t.Assert(condition, message)`: Fails if condition is false.
- `t.Equal(actual, expected, message)`: Fails if actual !== expected.
- `t.Fail()`: Manually fails the test.
- `t.Skip(message)`: Skips the test.
- `t.Log(...args)`: Logs information.

## Gherkin-style Testing (`gherkin-test.mjs`)

Supports Behavior-Driven Development (BDD) using Gherkin syntax.

### Usage

```javascript
import gherkinTest from './gherkin-test.mjs';

gherkinTest.Given(/^I have a calculator$/, (context) => {
    context.calculator = new Calculator();
});

gherkinTest.When(/^I add (\d+)$/, (context, num) => {
    context.calculator.add(Number(num));
});

gherkinTest.Then(/^the result should be (\d+)$/, (context, expected) => {
    if (context.calculator.value !== Number(expected)) {
        throw new Error(`Expected ${expected} got ${context.calculator.value}`);
    }
});

gherkinTest.Feature("Calculator", () => {
    Scenario("Simple Addition", `
        Given I have a calculator
        When I add 5
        When I add 3
        Then the result should be 8
    `);
});

// Run the tests
gherkinTest.run();
```

### API

- **`Feature(name, fn)`**: Defines a feature. Inside `fn`, you can call `Scenario`.
- **`Scenario(name, stepsString)`**: Defines a scenario with Gherkin steps.
- **`Given(pattern, fn)`**, **`When(pattern, fn)`**, **`Then(pattern, fn)`**: Define step definitions. `pattern` can be a string or RegExp. `fn` receives `(context, ...args)`.
- **`run()`**: Executes all defined features and scenarios.

## CLI Options

Both runners support filtering tests via command line arguments:

```bash
# Run tests matching "Addition"
node your-test-file.mjs --run Addition
```
