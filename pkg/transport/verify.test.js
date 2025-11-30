const { run, Group } = require("../../testingtools/gotest")

Group("HTTP Client Tests", () => {
  require("./http/client.test")
})

  ; (async () => {
    await run()
  })()
