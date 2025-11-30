const { run } = require("../../testingtools/gotest");

require("./index.test");

(async () => {
  await run();
})();
