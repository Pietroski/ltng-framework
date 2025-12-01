// Helper to convert style object to string
function styleToString(styleObj) {
	return Object.entries(styleObj || {}).map(([key, value]) => {
		const kebabKey = key.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2').toLowerCase()
		return `${kebabKey}: ${value}`
	}).join('; ')
}

const Colours = {
	HotPink: 'hotpink',
	Whitesmoke: 'whitesmoke',
	DarkGray: '#333',
}

const InputDivStyles = (darkMode) => ({
	border: '3px solid hotpink', // Thicker border
	borderRadius: '10px',
	margin: '5px 5px 5px 5px', // Increased top margin for floating label

	width: '100%',
	padding: '0 0 5px 0',
	position: 'relative',
	fontFamily: 'inherit', // Match component style
	display: 'flex',
	flexDirection: 'column',
	backgroundColor: darkMode ? Colours.DarkGray : Colours.Whitesmoke,
})

const LabelStyles = (darkMode) => ({
	zIndex: '2',
	position: 'relative',
	top: '-12px', // Adjusted for thicker border
	left: '10px', // More indentation
	margin: '0',
	padding: '0 6px',
	backgroundColor: darkMode ? Colours.DarkGray : Colours.Whitesmoke,
	color: darkMode ? '#ffffff' : '#000000',
	width: 'max-content',
	height: 'auto',
	fontSize: '14px', // Slightly smaller for a "label" look
	fontWeight: '500', // Slightly bolder
	fontFamily: 'inherit', // Match component style
	lineHeight: '1.2',
})

const InputFieldStyles = (darkMode) => ({
	height: '24px', // Slightly taller
	maxHeight: '24px',
	border: 'none',
	fontSize: '16px', // Standard input size
	fontFamily: 'inherit', // Match component style
	backgroundColor: darkMode ? Colours.DarkGray : Colours.Whitesmoke,
	color: darkMode ? '#ffffff' : '#000000',
	outline: 'none',
	padding: '0 10px', // More padding
	width: 'calc(100% - 20px)',
})

const SecretDivStyles = (darkMode) => ({
	zIndex: '3',
	position: 'absolute',
	backgroundColor: 'transparent',
	top: '50%',
	right: '10px',
	transform: 'translateY(-50%)',
	cursor: 'pointer',
	userSelect: 'none',
	color: darkMode ? '#ffffff' : '#000000',
})

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
		...rest
	} = props || {}

	const inputId = id || `input-${Math.random().toString(36).substring(2, 11)}`
	let currentType = isSecret ? 'password' : type

	const inputEl = window.Input({
		id: inputId,
		type: currentType,
		value: value || '',
		placeholder: '', // Placeholder is handled by label
		style: styleToString({
			...InputFieldStyles(darkMode),
			...(isSecret ? { width: 'calc(100% - 40px)' } : {})
		}),
		onInput: onChange, // Map onChange to onInput for real-time updates
		onFocus: onFocus,
		onBlur: onBlur,
		...rest
	})

	const children = [
		Label({
			style: styleToString(LabelStyles(darkMode)),
			for: inputId
		}, placeholder || ''),
		inputEl
	]

	if (isSecret) {
		const toggleBtn = Div({
			style: styleToString(SecretDivStyles(darkMode)),
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

	return Div({
		style: styleToString({
			...InputDivStyles(darkMode),
			...(style || {})
		})
	}, ...children)
}

Input.Secret = (props) => Input({ ...props, isSecret: true })
