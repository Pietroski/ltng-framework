const { Test } = require('../../ltng-testingtools/gotest')
const { toStyles, styleToString } = require('./style')

Test("toStyles should test case", (t) => {
	const testCase = { "testCase": "any-value" }
	const result = toStyles(testCase)
	t.Equal(JSON.stringify(result), JSON.stringify(testCase), "Should be equal")
})

Test("styleToString should test case", (t) => {
	const testCase = { "testCase": "any-value" }
	const result = styleToString(testCase)
	t.Equal(result, "test-case: any-value", "Should be equal")
})
