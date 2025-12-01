// Helper to convert style object to string
function styleToString(styleObj) {
	return Object.entries(styleObj || {}).map(([key, value]) => {
		const kebabKey = key.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2').toLowerCase()
		return `${kebabKey}: ${value}`
	}).join('; ')
}

const DefaultFooterStyling = {
	backgroundColor: '#1976d2',
	minHeight: '250px',
	width: '100%',
	border: '0',
	margin: '0',
	padding: '0',
	display: 'flex', // Added for better content layout by default
	flexDirection: 'column',
	justifyContent: 'center',
	alignItems: 'center',
	color: 'white'
}

// Alias global Footer to avoid recursion if we named it Footer
const GlobalFooter = window.Footer

export const Footer = (props, ...children) => {
	const { style, ...rest } = props || {}

	const componentStyles = {
		...DefaultFooterStyling,
		...(style || {})
	}

	return GlobalFooter({
		...rest,
		style: styleToString(componentStyles)
	}, ...children)
}
