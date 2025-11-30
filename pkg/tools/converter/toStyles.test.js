const { Test } = require("../../../testingtools/gotest");
const { toStyles } = require("./toStyles");

Test("toStyles should test case", (t) => {
  const testCase = {"testCase": "any-value"}
  const result = toStyles(testCase)
  t.Equal(JSON.stringify(result), JSON.stringify(testCase), "Should be equal")
});
