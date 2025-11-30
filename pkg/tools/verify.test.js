const { run, Group } = require("../../testingtools/gotest")

Group("Converter Tests", () => {
  require("./converter/toStyles.test")
})

Group("Object Tests", () => {
  require("./objects/objects.test")
})

Group("String Tests", () => {
  require("./strings/strings.test")
})

  ; (async () => {
    await run()
  })()
