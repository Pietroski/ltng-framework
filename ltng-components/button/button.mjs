import { styleToString } from '../../ltng-tools/converter/index.mjs'

// Load styles
window.loadCSS(new URL('../styles/theme.css', import.meta.url).href)
window.loadCSS(new URL('./button.css', import.meta.url).href)

export const Button = (props, ...children) => {
	const { variant = 'default', disabled, className = '', style, ...rest } = props || {}

	const classes = ['ltng-button']

	if (variant === 'primary') {
		classes.push('ltng-button--primary')
	} else if (variant === 'secondary') {
		classes.push('ltng-button--secondary')
	}

	if (disabled) {
		// We rely on :disabled pseudo-class, but can add a class if needed for non-button elements
		// classes.push('ltng-button--disabled')
	}

	if (className) {
		classes.push(className)
	}

	const buttonProps = {
		...rest,
		class: classes.join(' ')
	}
	if (style) buttonProps.style = typeof style === 'object' ? styleToString(style) : style // Pass through inline styles

	if (disabled) {
		buttonProps.disabled = true
	}

	return button(buttonProps, ...children)
}

Button.Primary = (props, ...children) => Button({ ...props, variant: 'primary' }, ...children)
Button.Secondary = (props, ...children) => Button({ ...props, variant: 'secondary' }, ...children)
