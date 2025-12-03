import { Test } from '../../ltng-testingtools/gotest.mjs'
import { objStrDasher } from './objects.mjs'

Test("objStrDasher should test case", (t) => {
	const result = objStrDasher({ "testCase": "any-value" })
	t.Equal(JSON.stringify(result), JSON.stringify({ "test-case": "any-value" }), "Should be equal")
})
