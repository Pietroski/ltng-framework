const content = `
<body>
	<div class="ltng-container"></div>
	<script src="../../ltng-framework.js"></script>
	<script src="./theme.js"></script>
	<script type="importmap">
		{
			"imports": {
				"ltng-components": "../../ltng-components/index.mjs"
			}
		}
	</script>
	<script type="module">
		console.log('module')
	</script>
</body>
`

const bodyRegex = /<body\b[^>]*>([\s\S]*?)<\/body>/i
const bodyMatch = bodyRegex.exec(content)

if (bodyMatch) {
    const innerBody = bodyMatch[1]
    console.log('Inner Body Length:', innerBody.length)
    console.log('Inner Body Start:', innerBody.substring(0, 100))
    
    const sRegex = /<script\b[^>]*>([\s\S]*?)<\/script>/gmi
    let sMatch
    while ((sMatch = sRegex.exec(innerBody)) !== null) {
        console.log('Found script:', sMatch[0].substring(0, 50))
    }
} else {
    console.log('No body match')
}
