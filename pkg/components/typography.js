// Helper to convert style object to string
function styleToString(styleObj) {
	return Object.entries(styleObj || {}).map(([key, value]) => {
		const kebabKey = key.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2').toLowerCase()
		return `${kebabKey}: ${value}`
	}).join('; ')
}

const Colours = {
	Whitesmoke: 'whitesmoke',
	Black: 'black',
}

const DefaultTypographyStyle = (darkMode) => ({
	color: darkMode ? Colours.Whitesmoke : Colours.Black,
	fontFamily: 'inherit',
	margin: '0', // Reset default margins for better control
})

const createTypographyComponent = (tag) => (props, ...children) => {
	const { darkMode = true, style, ...rest } = props || {}

	const componentStyles = {
		...DefaultTypographyStyle(darkMode),
		...(style || {})
	}

	// Use the global element wrappers from ltng-framework if available, or fallback to createElement
	const elementCreator = window[tag] || ((p, ...c) => {
		const el = document.createElement(tag.toLowerCase())
		// ... apply props ... (simplified here as we assume window[tag] exists)
		return window.createElement(tag.toLowerCase(), p, ...c)
	})

	return elementCreator({
		...rest,
		style: styleToString(componentStyles)
	}, ...children)
}

export const Typography = (props, ...children) => {
	return createTypographyComponent('Div')(props, ...children)
}

Typography.H1 = createTypographyComponent('H1')
Typography.H2 = createTypographyComponent('H2')
Typography.H3 = createTypographyComponent('H3')
Typography.H4 = createTypographyComponent('H4')
Typography.H5 = createTypographyComponent('H5')
Typography.Paragraph = createTypographyComponent('P')
Typography.Span = createTypographyComponent('Span')
