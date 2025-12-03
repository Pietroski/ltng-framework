import { Card } from '../index.mjs'

// Load styles
window.loadCSS(new URL('../styles/theme.css', import.meta.url).href)
window.loadCSS(new URL('./modal.css', import.meta.url).href)

export const Modal = (props, ...children) => {
	const {
		isOpen,
		onClose,
		darkMode = true,
		style,
		closeFromOutside = true,
		className = '',
		...rest
	} = props || {}
	
	if (!isOpen) return null
	
	// The background overlay that handles clicks
	const backgroundOverlay = div({
		class: 'ltng-modal-overlay',
		onClick: (e) => {
			if (closeFromOutside && onClose) {
				onClose(e)
			}
		}
	})
	
	// Content Classes
	const contentClasses = ['ltng-modal-content']
	if (darkMode) contentClasses.push('ltng-modal-content--dark')
	else contentClasses.push('ltng-modal-content--light')
	
	// The content card
	const content = Card.Closable({
		darkMode,
		onCloseClick: onClose,
		className: contentClasses.join(' '),
		style: style,
		...rest
	}, ...children)
	
	// Container Classes
	const containerClasses = ['ltng-modal-container']
	if (className) containerClasses.push(className)
	
	// The main container holding both
	const baseContainer = div({
		class: containerClasses.join(' ')
	}, backgroundOverlay, content)
	
	return baseContainer
}
