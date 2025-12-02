const { run, Group } = require('../../ltng-testingtools/gotest')

Group("Number Tests", () => {
	require('./number.test')
})

Group("String Tests", () => {
	require('./string.test')
})

	; (async () => {
		await run()
	})()
