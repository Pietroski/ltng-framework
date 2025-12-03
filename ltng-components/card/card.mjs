import { styleToString } from '../../ltng-tools/converter/index.mjs'

// Load styles
window.loadCSS(new URL('../styles/theme.css', import.meta.url).href)
window.loadCSS(new URL('./card.css', import.meta.url).href)

export const Card = (props, ...children) => {
	const { darkMode = true, className = '', style, ...rest } = props || {}

	const classes = ['ltng-card']
	if (darkMode) classes.push('ltng-card--dark')
	else classes.push('ltng-card--light')

	if (className) classes.push(className)

	return div({
		...rest,
		class: classes.join(' '),
		style: typeof style === 'object' ? styleToString(style) : style
	}, ...children)
}

const CardCloseButton = (props) => {
	const { onClick, style, className = '' } = props

	const classes = ['ltng-card-close-btn']
	if (className) classes.push(className)

	return div({
		class: classes.join(' '),
		style: typeof style === 'object' ? styleToString(style) : style,
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
