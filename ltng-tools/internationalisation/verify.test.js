const { run, Group } = require('../../ltng-testingtools/gotest')

Group("Internationalisation Tests", () => {
	require('./index.test')
})

	; (async () => {
		await run()
	})()
