// Helper to convert style object to string
function styleToString(styleObj) {
	return Object.entries(styleObj || {}).map(([key, value]) => {
		const kebabKey = key.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2').toLowerCase()
		return `${kebabKey}: ${value}`
	}).join('; ')
}

// Load styles
window.loadCSS('/pkg/styles/theme.css')
window.loadCSS('/pkg/components/footer.css')

export const Footer = (props, ...children) => {
	const { className = '', style, ...rest } = props || {}

	const classes = ['ltng-footer']
	if (className) classes.push(className)

	const footerProps = {
		...rest,
		class: classes.join(' ')
	}
	if (style) footerProps.style = typeof style === 'object' ? styleToString(style) : style

	return footer(footerProps, ...children)
}
