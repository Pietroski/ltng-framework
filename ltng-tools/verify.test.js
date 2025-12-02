const { run, Group } = require('../ltng-testingtools/gotest')

Group("Converter Tests", () => {
	require('./converter/verify.test')
})

Group("Random Lib", () => {
	require('./random/number.test')
	require('./random/string.test')
})

Group("Internationalisation Lib", () => {
	require('./internationalisation/index.test')
})

Group("Transport Lib", () => {
	require('./transport/http/client.test')
})

	; (async () => {
		await run()
	})()
