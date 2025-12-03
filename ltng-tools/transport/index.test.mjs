import { run, Group } from '../../ltng-testingtools/gotest.mjs'
import { fileURLToPath } from 'url'

await Group("HTTP Tests", async () => {
	await import('./http/client.test.mjs')
})

if (process.argv[1] === fileURLToPath(import.meta.url)) {
	await run()
}
