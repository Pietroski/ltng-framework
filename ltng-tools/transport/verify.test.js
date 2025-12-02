const { run, Group } = require('../../ltng-testingtools/gotest')

Group("HTTP Tests", () => {
	require('./http/verify.test')
})

	; (async () => {
		await run()
	})()
