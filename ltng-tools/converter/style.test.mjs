import { Test } from '../../ltng-testingtools/gotest.mjs'
import { toStyles, styleToString } from './style.mjs'

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
