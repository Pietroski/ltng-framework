import { styleToString } from '../../ltng-tools/converter/style.js'
import { Card } from './card/card.js'
import { Div } from './container/containers.js'
import { Typography } from './typography.js'

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

// Load styles
window.loadCSS('../styles/theme.css')
window.loadCSS('./toast.css')

export const toastStore = createToastStore()

export const Toast = {
	Container: (props) => {
		const { store = toastStore, darkMode = true } = props || {}
		const container = Div({
            class: 'ltng-toast-container'
		})

		const renderToasts = (list) => {
			container.innerHTML = '' // Clear current
			list.forEach((t, index) => {
                const classes = ['ltng-toast-card']
                
                if (t.type === 'warning') classes.push('ltng-toast-card--warning')
                else if (t.type === 'success') classes.push('ltng-toast-card--success')
                else if (t.type === 'failure') classes.push('ltng-toast-card--failure')
                else {
                    if (darkMode) classes.push('ltng-toast-card--default-dark')
                    else classes.push('ltng-toast-card--default-light')
                }

				const toastCard = Card.Closable({
					darkMode,
					onCloseClick: () => store.remove(t.id),
                    className: classes.join(' '),
					style: {
                        marginTop: `${index * 110}px`,
                        zIndex: 2000 + index
                    },
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
