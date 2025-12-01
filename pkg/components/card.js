// Helper to convert style object to string
function styleToString(styleObj) {
	return Object.entries(styleObj || {}).map(([key, value]) => {
		const kebabKey = key.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2').toLowerCase()
		return `${kebabKey}: ${value}`
	}).join('; ')
}

const Colours = {
	Primary: '#1976d2',
	Whitesmoke: 'whitesmoke',
	DarkGray: '#333',
}

const DefaultCardStyles = (darkMode) => ({
	width: '250px',
	height: '150px',
	position: 'relative',
	borderRadius: '15px',
	border: `1px solid ${Colours.Primary}`,
	boxSizing: 'border-box',
	backgroundColor: darkMode ? Colours.Whitesmoke : Colours.DarkGray,
	color: darkMode ? 'black' : 'white',
	display: 'flex',
	flexDirection: 'column',
	justifyContent: 'center',
	alignItems: 'center',
})

const CloseButtonStyles = {
	width: '35px',
	height: '35px',
	position: 'absolute',
	top: 0,
	right: 0,
	borderRadius: '15px',
	border: `1px solid ${Colours.Primary}`,
	boxSizing: 'border-box',
	display: 'flex',
	justifyContent: 'center',
	alignItems: 'center',
	cursor: 'pointer',
	backgroundColor: 'transparent',
	color: 'inherit',
}

// Alias global Div to avoid recursion if we named it Div
const GlobalDiv = window.Div

export const Card = (props, ...children) => {
	const { darkMode = true, style, ...rest } = props || {}

	const componentStyles = {
		...DefaultCardStyles(darkMode),
		...(style || {})
	}

	return Div({
		...rest,
		style: styleToString(componentStyles)
	}, ...children)
}

const CardCloseButton = (props) => {
	const { onClick, style } = props
	return Div({
		style: styleToString({ ...CloseButtonStyles, ...(style || {}) }),
		onClick: onClick
	}, 'X')
}

Card.Closable = (props, ...children) => {
	const { initialCardState = true, onCloseClick, closeBtnStyle, ...rest } = props || {}

	// Simple state simulation for the component instance
	// In a real framework this would be handled by a reactive primitive
	// Here we just render if open is true, but we can't easily re-render *just* this component 
	// without a reactive system or re-rendering the whole tree.
	// For ltng-book visualization, we might just show it always open or use a simple toggle that re-renders the story.

	// Since ltng-framework is simple, we'll return a container that can remove itself?
	// Or we rely on the parent to handle visibility (controlled component).

	// For now, let's render the close button and let the onClick handler do whatever (like alert or remove element).

	return Card(rest,
		CardCloseButton({ onClick: onCloseClick, style: closeBtnStyle }),
		...children
	)
}

// SelfClosable would need internal state, which we have via createStore but it's global-ish.
// We can make a closure-based component if we were using a reactive renderer.
// For now, we'll implement it similar to Closable but with the intent that it manages its own state if possible.
Card.SelfClosable = (props, ...children) => {
	const id = `card-${Math.random().toString(36).substring(2, 11)}`

	const closeHandler = (e) => {
		const el = document.getElementById(id)
		if (el) el.remove()
		if (props.onCloseClick) props.onCloseClick(e)
	}

	return Card({ ...props, id },
		CardCloseButton({ onClick: closeHandler }),
		...children
	)
}
