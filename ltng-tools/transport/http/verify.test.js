const { run, Group } = require('../../../ltng-testingtools/gotest')

Group("Client Tests", () => {
	require('./client.test')
})

	; (async () => {
		await run()
	})()
