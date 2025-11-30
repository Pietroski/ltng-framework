const { run, Group } = require("../testingtools/gotest");

Group("Random Lib", () => {
  require("./random/number.test");
  require("./random/string.test");
});

Group("Tools Lib", () => {
  // We can't easily reuse pkg/tools/verify.test.js because it auto-runs.
  // So we re-import the tests here, maintaining the grouping structure manually if desired,
  // or just letting them run.
  // Since gotest.js Group doesn't nest yet, we'll just list them.
  
  Group("Converter Tests", () => {
    require("./tools/converter/toStyles.test");
  });

  Group("Object Tests", () => {
    require("./tools/objects/objects.test");
  });

  Group("String Tests", () => {
    require("./tools/strings/strings.test");
  });
});

Group("Internationalisation Lib", () => {
  require("./internationalisation/index.test");
});

Group("Transport Lib", () => {
  require("./transport/http/client.test");
});

(async () => {
  await run();
})();
