const GlobalButton = window.Button

// Helper to convert style object to string
function styleToString(styleObj) {
	return Object.entries(styleObj || {}).map(([key, value]) => {
		const kebabKey = key.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2').toLowerCase()
		return `${kebabKey}: ${value}`
	}).join('; ')
}

// Load styles
window.loadCSS('/pkg/styles/theme.css')
window.loadCSS('/pkg/components/button.css')

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

	return GlobalButton(buttonProps, ...children)
}

Button.Primary = (props, ...children) => Button({ ...props, variant: 'primary' }, ...children)
Button.Secondary = (props, ...children) => Button({ ...props, variant: 'secondary' }, ...children)
