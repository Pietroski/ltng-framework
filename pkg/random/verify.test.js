const { run } = require("../../testingtools/gotest");

require("./number.test");
require("./string.test");

(async () => {
  await run();
})();
