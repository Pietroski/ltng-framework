const { run, Group } = require('../../testingtools/gotest')

Group("Internationalisation Tests", () => {
	require('./index.test')
})

	; (async () => {
		await run()
	})()
