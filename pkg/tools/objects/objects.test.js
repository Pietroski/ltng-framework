const { Test } = require("../../../testingtools/gotest");
const { objStrDasher } = require("./objects");

Test("objStrDasher should test case", (t) => {
  const result = objStrDasher({"testCase": "any-value"})
  t.Equal(JSON.stringify(result), JSON.stringify({"test-case": "any-value"}), "Should be equal")
});
