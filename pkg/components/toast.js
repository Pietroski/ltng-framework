import { Card } from './card.js'
import { Div } from './containers.js'
import { Typography } from './typography.js'

// Helper to convert style object to string
function styleToString(styleObj) {
	return Object.entries(styleObj || {}).map(([key, value]) => {
		const kebabKey = key.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2').toLowerCase()
		return `${kebabKey}: ${value}`
	}).join('; ')
}

const Colours = {
	DarkGoldenRod: '#b8860b',
	DarkGreen: '#006400',
	DarkRed: '#8b0000',
	Whitesmoke: 'whitesmoke',
	Primary: '#1976d2',
	DarkGray: '#333',
}

// Toast Store
const createToastStore = () => {
	let toasts = []
	const listeners = new Set()
	let counter = 0

	const notify = () => listeners.forEach(l => l(toasts))

	const remove = (id) => {
		toasts = toasts.filter(t => t.id !== id)
		notify()
	}

	const add = (toast) => {
		const id = ++counter
		const newToast = { ...toast, id }
		toasts = [...toasts, newToast]
		notify()

		if (newToast.duration !== 0) {
			setTimeout(() => {
				remove(id)
			}, newToast.duration || 5000)
		}
		return id
	}

	return {
		getToasts: () => toasts,
		subscribe: (l) => {
			listeners.add(l)
			return () => listeners.delete(l)
		},
		add,
		remove
	}
}

export const toastStore = createToastStore()

const ToastCardStyles = (type, darkMode, index) => {
	const base = {
		width: '400px',
		height: '100px',
		position: 'absolute',
		top: `${index * 110 + 20}px`, // Stack them
		right: 'calc(50% - 200px)',
		transition: 'all 0.3s ease',
		zIndex: 2000 + index,
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		color: 'white',
	}

	switch (type) {
		case 'warning':
			return { ...base, backgroundColor: Colours.Whitesmoke, color: Colours.Primary, border: `1px solid ${Colours.Primary}` }
		case 'success':
			return { ...base, backgroundColor: Colours.Primary, border: 'none' }
		case 'failure':
			return { ...base, backgroundColor: Colours.DarkRed, border: 'none' }
		default:
			return { ...base, backgroundColor: darkMode ? Colours.DarkGray : Colours.Whitesmoke, color: darkMode ? 'white' : 'black' }
	}
}

export const Toast = {
	Container: (props) => {
		const { store = toastStore, darkMode = true } = props || {}
		const container = Div({
			style: {
				position: 'fixed',
				top: '0',
				left: '0',
				width: '100%',
				height: '0', // Don't block clicks
				overflow: 'visible',
				zIndex: '2000'
			}
		})

		const renderToasts = (list) => {
			container.innerHTML = '' // Clear current
			list.forEach((t, index) => {
				const toastCard = Card.Closable({
					darkMode,
					onCloseClick: () => store.remove(t.id),
					style: ToastCardStyles(t.type, darkMode, index),
					closeBtnStyle: { borderColor: t.type === 'failure' ? 'white' : 'currentColor' }
				},
					Typography.Paragraph({ style: { margin: 0, color: 'inherit' } }, t.message)
				)
				container.appendChild(toastCard)
			})
		}

		store.subscribe(renderToasts)
		return container
	},
	show: (message, options = {}) => toastStore.add({ message, ...options }),
	success: (message, options = {}) => toastStore.add({ message, type: 'success', ...options }),
	warning: (message, options = {}) => toastStore.add({ message, type: 'warning', ...options }),
	failure: (message, options = {}) => toastStore.add({ message, type: 'failure', ...options }),
}
