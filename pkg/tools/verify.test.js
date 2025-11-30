const { run } = require("../../testingtools/gotest");

require("./converter/toStyles.test");
require("./objects/objects.test");
require("./strings/strings.test");

(async () => {
  await run();
})();
