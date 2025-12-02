const { run, Group } = require('../../ltng-testingtools/gotest')

Group("Object Tests", () => {
	require('./objects.test')
})

Group("String Tests", () => {
	require('./strings.test')
})

Group("Style Tests", () => {
	require('./style.test')
})

	; (async () => {
		await run()
	})()
