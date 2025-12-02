import { styleToString } from '../../ltng-tools/converter/style.js'

// Load styles
window.loadCSS('../styles/theme.css')
window.loadCSS('./footer.css')

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
