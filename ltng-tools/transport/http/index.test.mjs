import { run, Group } from '../../../ltng-testingtools/gotest.mjs'
import { fileURLToPath } from 'url'

Group("Client Tests", () => {
	import('./client.test.mjs')
})

if (process.argv[1] === fileURLToPath(import.meta.url)) {
	await run()
}
