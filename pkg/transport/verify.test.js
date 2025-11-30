const { run } = require("../../testingtools/gotest");

require("./http/client.test");

(async () => {
  await run();
})();
