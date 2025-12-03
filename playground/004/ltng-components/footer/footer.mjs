import { styleToString } from '../../ltng-tools/converter/index.mjs'

// Load styles
window.loadCSS(new URL('../styles/theme.css', import.meta.url).href)
window.loadCSS(new URL('./footer.css', import.meta.url).href)

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
