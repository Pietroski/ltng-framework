// Load styles
window.loadCSS('/pkg/styles/theme.css')
window.loadCSS('/pkg/components/input.css')

// Alias global Input to avoid recursion if we named it Input
const GlobalInput = window.Input

export const Input = (props) => {
	const {
		id,
		placeholder,
		type = 'text',
		isSecret,
		darkMode = true,
		style,
		onChange,
		onFocus,
		onBlur,
		value,
        className = '',
		...rest
	} = props || {}

	const inputId = id || `input-${Math.random().toString(36).substring(2, 11)}`
	let currentType = isSecret ? 'password' : type

    // Input Field Classes
    const inputClasses = ['ltng-input-field']
    if (darkMode) inputClasses.push('ltng-input-field--dark')
    else inputClasses.push('ltng-input-field--light')
    if (isSecret) inputClasses.push('ltng-input-field--secret')

	const inputEl = GlobalInput({
		id: inputId,
		type: currentType,
		value: value || '',
		placeholder: '', // Placeholder is handled by label
        class: inputClasses.join(' '),
		onInput: onChange, // Map onChange to onInput for real-time updates
		onFocus: onFocus,
		onBlur: onBlur,
		...rest
	})

    // Label Classes
    const labelClasses = ['ltng-input-label']
    if (darkMode) labelClasses.push('ltng-input-label--dark')
    else labelClasses.push('ltng-input-label--light')

	const children = [
		Label({
            class: labelClasses.join(' '),
			for: inputId
		}, placeholder || ''),
		inputEl
	]

	if (isSecret) {
        const toggleClasses = ['ltng-input-secret-toggle']
        if (darkMode) toggleClasses.push('ltng-input-secret-toggle--dark')
        else toggleClasses.push('ltng-input-secret-toggle--light')

		const toggleBtn = Div({
            class: toggleClasses.join(' '),
			onClick: (e) => {
				const input = document.getElementById(inputId)
				if (input) {
					if (input.type === 'password') {
						input.type = 'text'
						e.target.textContent = 'Hide' // Simple text for now, could be icon
					} else {
						input.type = 'password'
						e.target.textContent = 'Show'
					}
				}
			}
		}, 'Show')
		children.push(toggleBtn)
	}

    // Wrapper Classes
    const wrapperClasses = ['ltng-input-wrapper']
    if (darkMode) wrapperClasses.push('ltng-input-wrapper--dark')
    else wrapperClasses.push('ltng-input-wrapper--light')
    if (className) wrapperClasses.push(className)

	return Div({
        class: wrapperClasses.join(' '),
        style: style
	}, ...children)
}

Input.Secret = (props) => Input({ ...props, isSecret: true })
